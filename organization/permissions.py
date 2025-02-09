from rest_framework.permissions import BasePermission

class IsBranchAdmin(BasePermission):
    """
    Allows access only if the user is an admin of the branch they are trying to modify.
    """
    def has_permission(self, request, view):
        branch_id = view.kwargs.get("branch_id")  # Get from URL parameters
        if not branch_id:
            return False  # Deny access if no branch ID is found in the URL
        branch_id = int(branch_id)  # Convert to integer
        return request.branch_roles.get(branch_id) == "admin"

class IsBranchSuperuser(BasePermission):
    """
    Allows access only if the user is a superuser of the branch they are trying to modify.
    """
    def has_permission(self, request, view):
        branch_id = view.kwargs.get("branch_id")  # Get from URL parameters
        if not branch_id:
            return False  # Deny access if no branch ID is found in the URL
        branch_id = int(branch_id)  # Convert to integer
        return request.branch_roles.get(branch_id) == "superuser"
    
class IsBranchEmployee(BasePermission):
    """
    Allows access only if the user is an employee of the branch they are trying to modify.
    """
    def has_permission(self, request, view):
        branch_id = view.kwargs.get("branch_id")  # Get from URL parameters
        if not branch_id:
            return False  # Deny access if no branch ID is found in the URL
        branch_id = int(branch_id)  # Convert to integer
        return request.branch_roles.get(branch_id) == "employee"