from rest_framework import serializers
from base.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    access = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ["id", "full_name", "email", "designation", "access", "created_at", "active_status"]

    def get_access(self, obj):
        """Determine the user's role within a given branch."""
        request = self.context.get("request")
        branch = self.context.get("branch")  # Pass the branch explicitly

        if not request or not branch:
            return None  # No request context or branch

        # Check if the user is a superuser in the branch's organization
        if obj in branch.location.organization.superusers.all():
            return "superuser"

        # Check if the user is an admin of this branch
        if branch.admins.filter(id=obj.id).exists():
            return "admin"

        # Check if the user is an employee of this branch
        if branch.employees.filter(id=obj.id).exists():
            return "employee"

        return None  # No role found
