from rest_framework.test import APITestCase
from django.test import override_settings
from authentication.models import PendingOTP
from organization.models import Organization, Role
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from base.models import Employee

User = get_user_model()

@override_settings(TEST_MODE=True)
class OrganizationTestCase(APITestCase):

    def setUp(self):
        """Set up necessary data before each test case."""
        self.client = APIClient()
        self.creator_role = Role.objects.get(name="Creator")
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="testpassword123",
            full_name="Test User",
            user_type="employee"
        )
        self.employee = Employee.objects.create(user=self.user, role=self.creator_role)
        self.token = self.login_and_verify_otp()
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.token}"
        )
        response = self.client.post(
            "/api/organizations/",
            {"name": "Test Organization", "description": "For testing"},
            format="json"
        )
        self.assertEqual(response.status_code, 201, "Organization creation failed!")
        self.organization = Organization.objects.get(name="Test Organization")

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.token}",
            HTTP_ORGANIZATION=str(self.organization.id)
        )

    def login_and_verify_otp(self):
        """Helper method to log in the user and verify OTP."""
        login_response = self.client.post(
            "/api/auth/login/", 
            {"email": self.user.email, "password": "testpassword123"}, 
            format="json"
        )
        self.assertEqual(login_response.status_code, 200, "Login Failed!")

        pending_token = login_response.data.get("pending_token")
        self.assertIsNotNone(pending_token, "Pending Token Not Received!")

        otp_instance = PendingOTP.objects.filter(user=self.user).first()
        self.assertIsNotNone(otp_instance, "OTP Instance Not Found!")
        otp_code = otp_instance.raw_otp  

        otp_response = self.client.post("/api/auth/verify-otp/", {
            "pending_token": pending_token,
            "otp": otp_code
        })
        self.assertEqual(otp_response.status_code, 200, "OTP Verification Failed!")

        return otp_response.data["access"]

    def test_create_organization(self):
        """Test organization creation with authentication."""
        org_data = {
            "name": "Test Organization1",
            "description": "A sample organization for testing."
        }
        response = self.client.post("/api/organizations/", org_data, format="json")
        
        self.assertEqual(response.status_code, 201, "Organization creation failed!")

        org = Organization.objects.get(name="Test Organization1")
        self.user.refresh_from_db()
        self.employee.refresh_from_db()

        self.owner_role = Role.objects.get(name="Owner", organization=org)
        self.assertEqual(org.owner, self.user, "Organization owner should be the authenticated user.")
        self.assertEqual(self.employee.role, self.owner_role, "User role should be 'Owner' after creating an organization.")
        self.assertEqual(self.employee.organization, org, "User should be assigned to the newly created organization.")
