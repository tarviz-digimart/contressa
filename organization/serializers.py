from rest_framework import serializers
from .models import CustomUser
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import CustomUser
from allauth.utils import get_username_max_length #Import this

class CustomRegisterSerializer(RegisterSerializer):
    full_name = serializers.CharField(max_length=255, required=True)
    username = serializers.CharField(max_length=get_username_max_length(), required=False) # Add this!

    def custom_signup(self, request, user):
        user.full_name = self.validated_data['full_name']
        user.save()

    def validate_username(self, username):
        return username # Important!

    def create(self, validated_data):
        validated_data['username'] = validated_data['email']
        user = super().create(validated_data)
        return user
    
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'organization', 'department', 'location', 'designation']

