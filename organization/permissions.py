from rest_framework.permissions import BasePermission

class HasSuperuserAccess(BasePermission):
    """
    Allows access only to superusers.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class HasBranchAdminAccess(BasePermission):
    """
    Allows access to:
    - Superusers
    - Branch Admins of the specific branch being accessed
    """

    def has_object_permission(self, request, view, obj):
        """
        Check if the user is a superuser or an admin of the branch.
        """
        return request.user.is_superuser or request.user in obj.branch_admins.all()


class HasDepartmentHeadAccess(BasePermission):
    """
    Allows access to:
    - Superusers
    - Branch Admins of the department's branch
    - Department Heads
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Superusers have full access
        if user.is_superuser:
            return True

        # Ensure `obj` has a branch and branch admins
        if hasattr(obj, 'branch') and obj.branch.branch_admins.filter(id=user.id).exists():
            return True

        # Check if the user is a department head
        if hasattr(obj, 'department_heads') and obj.department_heads.filter(id=user.id).exists():
            return True

        return False
