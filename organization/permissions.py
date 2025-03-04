import logging
from rest_framework.permissions import BasePermission
from organization.models import UserRole

logger = logging.getLogger(__name__) 

class HasPermission(BasePermission):
    """
    Generic permission class to check role-based access.
    Usage:
      - Add `permission_code = "view_branches"` in the view.
    """
    
    def has_permission(self, request, view):
        organization_id = request.headers.get("Organization")

        logger.info(f"Checking permission for user: {request.user} in organization: {organization_id}")

        if not request.user.is_authenticated:
            logger.warning("Permission denied: User is not authenticated.")
            return False 
        
        # Ensure the view defines `permission_code`
        if not hasattr(view, "permission_code") or not view.permission_code:
            logger.warning("Permission denied: No permission_code defined in the view.")
            return False
        
        logger.info(f"Required permission: {view.permission_code}")

        user_role = UserRole.objects.filter(
            user=request.user, organization_id=organization_id
        ).select_related("role").first()

        if user_role.role.name == "Owner":
            return True
        
        if not user_role or not user_role.role:
            logger.warning("Permission denied: No role assigned to user.")
            return False  # No role assigned

        logger.info(f"User role: {user_role.role.name}, Permissions: {user_role.role.permissions}")

        # Check if permission_code exists in the role's permissions
        if view.permission_code not in user_role.role.permissions:
            logger.warning(f"Permission denied: User does not have '{view.permission_code}' permission.")
            return False
        
        logger.info("Permission granted.")
        return True  # Permission granted
