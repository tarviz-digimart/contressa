from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'users', CustomUserViewSet)  # This will create `/users/` endpoint

# Define urlpatterns
urlpatterns = [
    path('', include(router.urls)),  
]
