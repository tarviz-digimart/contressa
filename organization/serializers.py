from rest_framework import serializers
from organization.models import Organization, Location, Branch, Role, Designation
from base.serializers import UserSerializer

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