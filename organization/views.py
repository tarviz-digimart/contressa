from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from organization.models import Organization, Location, Branch, Designation
from organization.serializers import (
    OrganizationSerializer, LocationSerializer, BranchSerializer, DesignationSerializer, RoleSerializer, RoleListSerializer
)
from base.serializers import EmployeeSerializer
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.core.mail import send_mail
from organization.models import OrganizationInvite, Role
from django.utils.timezone import now
from django.core.exceptions import ValidationError
from django.db import transaction
from django.contrib.auth.hashers import make_password
from organization.permissions import HasPermission

User = get_user_model()

class OrganizationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Organizations.
    Superusers have full control over an organization.
    """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    # permission_classes = [HasSuperuserAccess]  # Ensure only authenticated users can access


class LocationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Locations.
    A location belongs to an organization.
    """
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    # permission_classes = [HasSuperuserAccess]

    def get_queryset(self):
        """Return locations belonging to the organization from request header"""
        organization_id = self.request.headers.get("Organization")
        if not organization_id:
            return Location.objects.none()

        return Location.objects.filter(organization_id=organization_id)

    def perform_create(self, serializer):
        """Assign organization from request header before saving"""
        organization_id = self.request.headers.get("Organization")
        if not organization_id:
            raise ValidationError({"error": "Organization ID is required in the header."})

        serializer.save(organization_id=organization_id)

    def partial_update(self, request, *args, **kwargs):
        """Only allow partial updates (PATCH)"""
        return super().partial_update(request, *args, **kwargs)


class BranchViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Branches.
    A branch belongs to a specific location.
    Branch admins are responsible for managing the branch.
    """
    serializer_class = BranchSerializer
    queryset = Branch.objects.all()
    http_method_names = ["get", "post", "patch", "delete"] 
    permission_classes = [HasPermission]

    def get_permissions(self):
        """Set dynamic permission codes per action."""
        if self.action in ["list","retrieve"]:
            self.permission_code = "view_branches"
        elif self.action == "create":
            self.permission_code = "create_branches"
        elif self.action in ["update", "partial_update"]:
            self.permission_code = "edit_branches"
        elif self.action == "destroy":
            self.permission_code = "delete_branches"

        return [HasPermission()]
    
    def get_queryset(self):
        """Return branches belonging to the organization from request header"""
        organization_id = self.request.headers.get("Organization")
        if not organization_id:
            return Branch.objects.none()  # Return empty queryset if no org ID

        return Branch.objects.filter(organization_id=organization_id).exclude(
            id=Organization.objects.filter(id=organization_id)
            .values_list("headquarters_id", flat=True)
            .first()
        )

    def perform_create(self, serializer):
        """Assign organization from request header before saving"""
        organization_id = self.request.headers.get("Organization")
        if not organization_id:
            raise ValidationError({"error": "Organization ID is required in the header."})

        serializer.save(organization_id=organization_id)

    def partial_update(self, request, *args, **kwargs):
        """Only allow partial updates (PATCH)"""
        return super().partial_update(request, *args, **kwargs)

class DesignationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Designations.
    A designation belongs to an organization.
    """
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer
    # permission_classes = [HasBranchAdminAccess]


class InviteUserView(APIView):
    def post(self, request):
        email = request.data.get("email")
        full_name = request.data.get("full_name")
        role_id = request.data.get("role_id")
        branch_id = request.data.get("branch_id")
        designation_id = request.data.get("designation_id")
        notes = request.data.get("notes")
        organization_id = request.headers.get("Organization")

        existing_user = User.objects.filter(email=email, organization_id=organization_id).first()
        if existing_user:
            return Response({"detail": "User is already a member of this organization."}, status=status.HTTP_400_BAD_REQUEST)

        if OrganizationInvite.objects.filter(email=email, organization_id=organization_id).exists():
            return Response({"detail": "User has already been invited."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            organization = Organization.objects.get(id=organization_id)
        except Organization.DoesNotExist:
            return Response({"detail": "Invalid organization."}, status=status.HTTP_400_BAD_REQUEST)
        email_domain = email.split("@")[-1]
        if email_domain not in organization.domains:
            return Response(
                {"detail": "Email domain is not allowed for this organization."},
                status=status.HTTP_400_BAD_REQUEST
            )
        invite = OrganizationInvite.objects.create(
            email=email,
            full_name=full_name,
            organization_id=organization_id,
            role_id=role_id,
            branch_id=branch_id,
            designation_id=designation_id,
            notes=notes,
        )

        invite_link = f"https://{settings.DOMAIN_ADDRESS}/accept-invite/{invite.token}/"
        send_mail(
            "You're invited to join the organization",
            f"Hello {full_name},\n\nYou have been invited to join . Click the link below to accept the invitation:\n\n{invite_link}",
            "noreply@yourcrm.com",
            [email],
        )

        return Response({"message": "Invitation sent successfully"}, status=status.HTTP_201_CREATED)


class AcceptInviteView(APIView):
    def post(self, request, token):
        try:
            invite = OrganizationInvite.objects.get(token=token)
        except OrganizationInvite.DoesNotExist:
            return Response({"detail": "Invalid or expired invitation."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user already exists in the organization
        if User.objects.filter(email=invite.email, organization=invite.organization).exists():
            return Response({"detail": "User is already part of this organization."}, status=status.HTTP_400_BAD_REQUEST)
        
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        # Validate passwords
        if not password or not confirm_password:
            return Response({"detail": "Both password fields are required."}, status=status.HTTP_400_BAD_REQUEST)
        if password != confirm_password:
            return Response({"detail": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            try:
                user = User.objects.create(
                    email=invite.email,
                    full_name=invite.full_name,
                    organization=invite.organization,
                    user_type="employee",
                    password=make_password(password) 
                )

                employee_data = {
                    "user_id": user.id,  # Pass as a dictionary
                    "organization_id": invite.organization.id,
                    "role_id": invite.role.id if invite.role else None,
                    "branch_id": invite.branch.id if invite.branch else None,
                    "designation_id": invite.designation.id if invite.designation else None,
                    "joining_date": now().date(),
                }

                # Use serializer to create employee
                serializer = EmployeeSerializer(data=employee_data)
                if serializer.is_valid():
                    serializer.save(user=user)  # Pass user explicitly
                    invite.accepted = True
                    invite.save()
                    return Response({"message": "Invitation accepted. User added successfully!"}, status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                transaction.set_rollback(True) 
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RoleViewSet(viewsets.ModelViewSet):
    """
    Role management API (Create, List, Update, Delete)
    """
    queryset = Role.objects.all() 
    serializer_class = RoleSerializer
    http_method_names = ["get", "post", "patch", "delete"] 
    permission_classes = [HasPermission]

    def get_permissions(self):
        """Grant access to all actions only if the user has 'manage_roles' permission."""
        
        self.permission_code = "manage_roles"
        return [HasPermission()]


    def get_queryset(self):
        """Return roles belonging to the organization from request header"""
        organization_id = self.request.headers.get("Organization")
        if not organization_id:
            return Role.objects.none()  

        return Role.objects.filter(organization_id=organization_id)

    def list(self, request, *args, **kwargs):
        """Use RoleListSerializer when listing roles"""
        queryset = self.get_queryset()
        serializer = RoleListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        """Create a new role for the given organization"""
        organization_id = request.headers.get("Organization")
        if not organization_id:
            return Response({"error": "Organization ID is required"}, status=400)

        data = request.data.copy()
        data["organization"] = organization_id  # Assign organization

        serializer = self.get_serializer(data=data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def partial_update(self, request, *args, **kwargs):
        """Allow PATCH but prevent updating the 'Owner' role"""
        role = self.get_object()
        if role.name.lower() == "owner":
            return Response({"error": "Updating the 'Owner' role is not allowed."}, status=403)

        serializer = self.get_serializer(role, data=request.data, partial=True, context={"request": request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

        return Response(serializer.errors, status=400)
    
    def destroy(self, request, *args, **kwargs):
        """Prevent deleting 'Owner' role"""
        role = self.get_object()
        if role.name.lower() == "owner":
            return Response({"error": "Deleting the 'Owner' role is not allowed."}, status=403)
        return super().destroy(request, *args, **kwargs)