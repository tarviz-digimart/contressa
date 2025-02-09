from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated
from organization.models import Organization, Location, Branch, Department, Designation
from organization.serializers import (
    OrganizationSerializer, LocationSerializer, BranchSerializer, DepartmentSerializer, DesignationSerializer
)
from organization.permissions import HasBranchAdminAccess, HasDepartmentHeadAccess, HasSuperuserAccess


class OrganizationViewSet(mixins.CreateModelMixin,  # Allow POST
                          mixins.UpdateModelMixin,  # Allow PATCH
                          mixins.DestroyModelMixin, # Allow DELETE
                          mixins.RetrieveModelMixin, # Allow GET (single)
                          mixins.ListModelMixin,  # Allow GET (list)
                          viewsets.GenericViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']
    def perform_create(self, serializer):
        print('user',self.request.data)
        serializer.save(owner=self.request.user)