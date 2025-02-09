from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from organization.models import Organization, Location, Branch, Department, Designation
from organization.serializers import (
    OrganizationSerializer, LocationSerializer, BranchSerializer, DepartmentSerializer, DesignationSerializer
)
# from organization.permissions import HasBranchAdminAccess, HasDepartmentHeadAccess, HasSuperuserAccess
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


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Departments.
    A department belongs to a specific branch.
    Department heads manage the department.
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    # permission_classes = [HasDepartmentHeadAccess]


class DesignationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Designations.
    A designation belongs to an organization.
    """
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer
    # permission_classes = [HasBranchAdminAccess]
