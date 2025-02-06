from django.utils.deprecation import MiddlewareMixin
from organization.models import Organization, Location, Branch

class OrganizationContextMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.organization = None
        request.location = None
        request.branch = None

        org_id = request.headers.get("Organization")
        loc_id = request.headers.get("Location")
        branch_id = request.headers.get("Branch")

        if org_id:
            request.organization = Organization.objects.filter(id=org_id).first()

        if loc_id:
            request.location = Location.objects.filter(id=loc_id, organization=request.organization).first()

        if branch_id:
            request.branch = Branch.objects.filter(id=branch_id, location=request.location).first()
