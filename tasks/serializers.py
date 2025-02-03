from rest_framework import serializers
from organization.models import CustomUser
from organization.serializers import OrganizationSerializer
from tasks.models import Project

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']

class ProjectSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)  
    users = UserSerializer(many=True, read_only=True)  
    admins = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'organization', 'users', 'admins', 'allowskip', 'all_users_admin']