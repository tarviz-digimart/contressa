from rest_framework import serializers
from base.models import CustomUser
from rest_framework import serializers

    
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'organization', 'department', 'location', 'designation']

