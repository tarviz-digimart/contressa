from rest_framework import permissions

class IsOwnProfile(permissions.BasePermission):
    """
    Custom permission to allow users to only view and edit their own profile.
    """

    def has_object_permission(self, request, view, obj):
        """
        Check if the user is trying to access their own profile.
        """
        # Only allow access if the profile being accessed belongs to the authenticated user
        return obj == request.user
