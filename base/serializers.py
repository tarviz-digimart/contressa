from rest_framework import serializers
from base.models import CustomUser, Employee
from organization.models import Role, Branch, Designation

class UserSerializer(serializers.ModelSerializer):
    access = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ["id", "full_name", "email", "created_at", "active_status"]



class EmployeeSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())  
    role = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), required=False, allow_null=True)
    branch = serializers.PrimaryKeyRelatedField(queryset=Branch.objects.all(), required=False, allow_null=True)
    designation = serializers.PrimaryKeyRelatedField(queryset=Designation.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Employee
        fields = ["id", "user", "organization", "role", "branch", "designation", "joining_date"]
