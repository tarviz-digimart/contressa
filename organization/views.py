from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from organization.models import Organization, Location, Branch, Designation
from organization.serializers import (
    OrganizationSerializer, LocationSerializer, BranchSerializer, DesignationSerializer
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


class BranchViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Branches.
    A branch belongs to a specific location.
    Branch admins are responsible for managing the branch.
    """
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    # permission_classes = [HasBranchAdminAccess]



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

