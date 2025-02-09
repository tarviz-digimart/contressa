from django.utils.deprecation import MiddlewareMixin
from organization.models import Branch, Organization

class OrganizationContextMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.organization = None
        request.branches = []
        request.branch_roles = {}

        org_id = request.headers.get("Organization")
        branch_ids = request.headers.get("Branch")  # Can be multiple branches

        if org_id:
            request.organization = Organization.objects.filter(id=org_id).first()

        if branch_ids:
            branch_ids = [int(b_id) for b_id in branch_ids.split(",")]
            branches = Branch.objects.filter(id__in=branch_ids)

            for branch in branches:
                if branch.admins.filter(id=request.user.id).exists():
                    request.branch_roles[branch.id] = "admin"
                elif branch.employees.filter(id=request.user.id).exists():
                    request.branch_roles[branch.id] = "employee"

            request.branches = branches
