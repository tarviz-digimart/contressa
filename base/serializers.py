from rest_framework import serializers
from base.models import CustomUser, Employee
from organization.models import Role, Branch, Designation, Organization

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ["id", "full_name", "email", "created_at", "active_status"]


class EmployeeListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    designation = serializers.CharField(source="designation.name", read_only=True)
    branch = serializers.CharField(source="branch.name", read_only=True)

    class Meta:
        model = Employee
        fields = ["id", "full_name", "designation", "branch"]


class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Full user details
    reports_to = serializers.SerializerMethodField()

    # Accept IDs when creating/updating
    branch_id = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all(), source="branch", write_only=True
    )
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), source="role", write_only=True
    )
    designation_id = serializers.PrimaryKeyRelatedField(
        queryset=Designation.objects.all(), source="designation", write_only=True
    )
    reports_to_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(), source="reports_to", write_only=True, required=False
    )
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(), source="organization", write_only=True
    )

    class Meta:
        model = Employee
        fields = [
            "id",
            "user",
            "branch",
            "branch_id",  # Accept ID for input
            "role",
            "role_id",  # Accept ID for input
            "designation",
            "designation_id",  # Accept ID for input
            "salary",
            "commission_type",
            "reports_to",
            "reports_to_id",  # Accept ID for input
            "joining_date",
            "organization",
            "organization_id",  # Accept ID for input
        ]

    def __init__(self, *args, **kwargs):
        """Lazy import related serializers to prevent circular import."""
        super().__init__(*args, **kwargs)  # Ensure proper initialization
        from organization.serializers import (
            BranchNameSerializer,
            RoleListSerializer,
            DesignationSerializer,
        )

        self.fields["branch"] = BranchNameSerializer(read_only=True)
        self.fields["role"] = RoleListSerializer(read_only=True)
        self.fields["designation"] = DesignationSerializer(read_only=True)

    def get_reports_to(self, obj):
        """Use EmployeeListSerializer to avoid circular reference."""
        from base.serializers import EmployeeListSerializer  # Lazy import
        return EmployeeListSerializer(obj.reports_to).data if obj.reports_to else None
