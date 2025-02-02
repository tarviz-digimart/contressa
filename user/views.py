from rest_framework import viewsets
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework.permissions import IsAuthenticated
from .permission import IsOwnProfile

class CustomUserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get','post','patch','delete']
    permission_classes = [IsAuthenticated, IsOwnProfile] 
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_queryset(self):
        return CustomUser.objects.filter(id=self.request.user.id)

