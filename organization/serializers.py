from rest_framework import serializers
from organization.models import Organization, Location, Branch, Role, Designation
from base.serializers import UserSerializer
from django.db import models

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = "__all__"


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"


class BranchSerializer(serializers.ModelSerializer):
    users = serializers.SerializerMethodField()

    class Meta:
        model = Branch
        fields = ["id", "name", "location", "address_line_1", "address_line_2", "city", "state", "postal_code", "users"]

    def get_users(self, obj):
        """Return all users in the branch categorized by their roles."""
        context = self.context  # Pass request & branch context
        context["branch"] = obj  

        return {
            "superusers": UserSerializer(obj.location.organization.superusers.all(), many=True, context=context).data,
            "admins": UserSerializer(obj.admins.all(), many=True, context=context).data,
            "employees": UserSerializer(obj.employees.all(), many=True, context=context).data,
        }


class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = "__all__"


class InviteBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ["id", "name"]  # Include only relevant fields

class InviteRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "name"]

class InviteDesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = ["id", "name"]

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "name", "description", "level", "permissions", "organization"]

    def __init__(self, *args, **kwargs):
        """Pass organization_id from context to serializer"""
        super().__init__(*args, **kwargs)
        request = self.context.get("request")  # Get request from context
        if request:
            self.organization_id = request.headers.get("Organization")  # Get org ID from headers
            print(f"===> org id: {self.organization_id}")
        else:
            self.organization_id = None  # Default to None if request is not available

    def validate_level(self, value):
            """Ensure role levels are consecutive within an organization."""
            print("validating...")
            print(f"org id is {self.organization_id}")
            if not self.organization_id:
                raise serializers.ValidationError("Organization ID is required.")
            
            if value == 1:
                raise serializers.ValidationError("Only 'Owner' can have level 1.")

            max_level = Role.objects.filter(organization=self.organization_id).exclude(name="Owner").aggregate(models.Max("level"))["level__max"]

            if max_level is None:  
                if value != 2:
                    raise serializers.ValidationError("The first non-owner role must have level 2.")
            else:
                if value != max_level + 1:
                    raise serializers.ValidationError(f"The next level must be {max_level + 1}.")

            return value
    
    
class RoleListSerializer(serializers.ModelSerializer):
    """Serializer to return only ID & Name of the Organization."""
    class Meta:
        model = Role
        fields = ["id", "name", "level"]