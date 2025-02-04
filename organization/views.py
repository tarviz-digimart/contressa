from rest_framework import viewsets
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwnProfile
from dj_rest_auth.registration.views import RegisterView
from .serializers import CustomRegisterSerializer


class CustomRegisterView(RegisterView):
    serializer_class = CustomRegisterSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get','post','patch','delete']
    permission_classes = [IsAuthenticated, IsOwnProfile] 
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_queryset(self):
        return CustomUser.objects.filter(id=self.request.user.id)

