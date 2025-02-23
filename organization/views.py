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
        # organization_id = request.user.organization.id  
        organization_id = request.data.get("organization_id")

        # Step 1: Check if an invitation already exists
        organization = Organization.objects.get(id=organization_id)
        designation = Designation.objects.get(id=designation_id)
        role = Role.objects.get(id=role_id)
        branch = Branch.objects.get(id=branch_id)
        existing_user = User.objects.filter(email=email, organization=organization).first()
        if existing_user:
            return Response({"detail": "User is already a member of this organization."}, status=status.HTTP_400_BAD_REQUEST)

        if OrganizationInvite.objects.filter(email=email, organization_id=organization_id).exists():
            return Response({"detail": "User has already been invited."}, status=status.HTTP_400_BAD_REQUEST)

        invite = OrganizationInvite.objects.create(
            email=email,
            full_name=full_name,
            organization_id=organization_id,
            role_id=role_id,
            branch_id=branch_id,
            designation=designation,
            notes=notes,
        )

        invite_link = f"https://{settings.DOMAIN_ADDRESS}/accept-invite/{invite.token}/"
        send_mail(
            "You're invited to join the organization",
            f"Hello {full_name},\n\nYou have been invited to join {organization.name}. Click the link below to accept the invitation:\n\n{invite_link}",
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
        existing_user = User.objects.filter(email=invite.email, organization=invite.organization).first()
        if existing_user:
            return Response({"detail": "User is already part of this organization."}, status=status.HTTP_400_BAD_REQUEST)

        # Create or fetch the user
        user = User.objects.create(
            email=invite.email,
            full_name= invite.full_name
        )

        employee_data = {
            "user": user.id,
            "organization": invite.organization.id,
            "role": invite.role.id if invite.role else None,
            "branch": invite.branch.id if invite.branch else None,
            "designation": invite.designation.id if invite.designation else None,
            "joining_date": now().date()
        }

        # Use serializer to create employee
        serializer = EmployeeSerializer(data=employee_data)
        if serializer.is_valid():
            serializer.save()
            invite.accepted = True
            invite.save()
            return Response({"message": "Invitation accepted. User added successfully!"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RoleViewSet(viewsets.ModelViewSet):
    """
    Role management API (Create, List, Update, Delete)
    """
    queryset = Role.objects.all() 
    serializer_class = RoleSerializer
    http_method_names = ["get", "post", "patch", "delete"] 


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