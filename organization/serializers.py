from rest_framework import serializers
from organization.models import Organization, Location, Branch, Department, Designation

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = "__all__"

class OrganizationSerializer(serializers.ModelSerializer):
    branches = BranchSerializer(many=True, required=False) 
    class Meta:
        model = Organization
        fields = "__all__"
    
    def create(self, validated_data):
        branches_data = validated_data.pop("branches", [])
        organization = Organization.objects.create(**validated_data)

        # Validate branch data using serializer before bulk creating
        branch_serializer = BranchSerializer(data=branches_data, many=True)
        branch_serializer.is_valid(raise_exception=True)  # Validate data

        branch_instances = [
            Branch(**branch_data, location=organization.headquarters)
            for branch_data in branch_serializer.validated_data
        ]

        if branch_instances:
            Branch.objects.bulk_create(branch_instances)

        return organization

    
    def update(self, instance, validated_data):
       
        branches_data = validated_data.pop("branches", None)

        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.save()

        if branches_data is not None:
            instance.branches.all().delete()  

            branch_instances = []
            for branch_data in branches_data:
                branch_serializer = BranchSerializer(data=branch_data)
                if branch_serializer.is_valid(raise_exception=True):
                    branch_instances.append(Branch(**branch_serializer.validated_data, location=instance.headquarters))

            if branch_instances:
                Branch.objects.bulk_create(branch_instances)  # Bulk insert new branches

        return instance

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = "__all__"
