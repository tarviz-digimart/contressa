from rest_framework import viewsets
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwnProfile

class CustomUserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get','post','patch','delete']
    permission_classes = [IsAuthenticated, IsOwnProfile] 
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_queryset(self):
        return CustomUser.objects.filter(id=self.request.user.id)


from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from .models import Organization, CustomUser
from .serializers import OrganizationSerializer, MemberSerializer

class OrganizationViewSet(viewsets.ReadOnlyModelViewSet):
    """API to get organization details"""
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]

class OrganizationMembersListView(generics.ListAPIView):
    """API to get members of an organization"""
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        org_id = self.kwargs['pk']
        organization = Organization.objects.get(id=org_id)
        self.organization = organization  
        return organization.employees.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['organization'] = self.organization
        return context