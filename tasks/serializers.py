from rest_framework import serializers
from .models import Project, Organization
from organization.models import CustomUser 

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email']

class ProjectSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)  
    users = UserSerializer(many=True, read_only=True)  
    admins = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'organization', 'users', 'admins', 'allowskip', 'all_users_admin']
