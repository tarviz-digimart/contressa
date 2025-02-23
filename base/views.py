from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from base.models import Employee
from base.serializers import EmployeeSerializer, EmployeeListSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Employees.
    Employees are linked to an organization, and filtering is based on organization headers.
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    def get_queryset(self):
        """Return employees belonging to the organization from request header"""
        organization_id = self.request.headers.get("Organization")
        if not organization_id:
            return Employee.objects.none()

        return Employee.objects.filter(organization_id=organization_id).select_related(
            "user", "branch", "role", "designation", "reports_to"
        )

    def get_serializer_class(self):
        """Use EmployeeListSerializer for list views to optimize performance"""
        if self.action == "list":
            return EmployeeListSerializer
        return EmployeeSerializer

    def perform_create(self, serializer):
        """Assign organization from request header before saving"""
        organization_id = self.request.headers.get("Organization")
        if not organization_id:
            raise ValidationError({"error": "Organization ID is required in the header."})

        serializer.save(organization_id=organization_id)

    def partial_update(self, request, *args, **kwargs):
        """Only allow partial updates (PATCH)"""
        return super().partial_update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Disable PUT requests to prevent full object replacement"""
        return Response({"error": "PUT method is not allowed. Use PATCH instead."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
