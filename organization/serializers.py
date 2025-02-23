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
        fields = ["id", "name"]


class BranchNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = [
            "id",
            "name",
        ]

class BranchSerializer(serializers.ModelSerializer):
    location = LocationSerializer()

    class Meta:
        model = Branch
        fields = [
            "id",
            "name",
            "location",
            "address_line_1",
            "address_line_2",
            "city",
            "state",
            "postal_code",
            "organization",
        ]
        extra_kwargs = {"organization": {"required": False}}  

    def create(self, validated_data):
        request = self.context.get("request") 
        organization_id = request.headers.get("Organization")

        if not organization_id:
            raise serializers.ValidationError({"organization": "Organization ID is required in the header."})

        location_data = validated_data.pop("location", None)
        if not isinstance(location_data, dict):
            raise serializers.ValidationError({"location": "Invalid format. Expected an object with 'name'."})

        location, _ = Location.objects.get_or_create(
            name=location_data["name"], organization_id=organization_id
        )

        branch = Branch.objects.create(
            location=location,
            **validated_data,
        )
        organization = Organization.objects.get(id=organization_id)
        if not organization.headquarters:
            organization.headquarters = branch
            organization.save(update_fields=["headquarters"])

        return branch

    def update(self, instance, validated_data):
        location_data = validated_data.pop("location", None)

        # Update location if provided
        if location_data:
            instance.location.name = location_data.get("name", instance.location.name)
            instance.location.save()

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance



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
        else:
            self.organization_id = None  # Default to None if request is not available

    def validate_level(self, value):
            """Ensure role levels are consecutive within an organization."""
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