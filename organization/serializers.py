from rest_framework import serializers
from .models import CustomUser, Organization

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'organization', 'department', 'location', 'designation']

        
class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'description']


class MemberSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'role', 'location', 'is_admin']

    def get_role(self, obj):
        """Fetch role from organization designation"""
        organization = self.context.get('organization')
        if organization:
            return organization.designations.filter(employees=obj).first().name if organization.designations.filter(employees=obj).exists() else None
        return None

    def get_location(self, obj):
        """Fetch location from organization"""
        organization = self.context.get('organization')
        if organization:
            return organization.locations.filter(employees=obj).first().name if organization.locations.filter(employees=obj).exists() else None
        return None

    def get_is_admin(self, obj):
        """Check if the user is a superuser in the organization"""
        organization = self.context.get('organization')
        return organization.superusers.filter(id=obj.id).exists() if organization else False