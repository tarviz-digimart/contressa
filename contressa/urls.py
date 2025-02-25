"""
URL configuration for contressa project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.routers import DefaultRouter
from authentication.views import OTPLoginView, OTPVerifyView, ResendOTPView
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from organization.views import OrganizationViewSet, LocationViewSet, BranchViewSet, DesignationViewSet, InviteUserView, AcceptInviteView, RoleViewSet
from base.views import EmployeeViewSet


router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'branches', BranchViewSet)
router.register(r'designations', DesignationViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'employees', EmployeeViewSet)


schema_view = get_schema_view(
    openapi.Info(
        title="Your API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@yourapi.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,)
)


     
urlpatterns = [
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),name='schema-redoc'),
    path('api/', include(router.urls)),
    path('api/auth/login/', OTPLoginView.as_view(), name='otp-login'),
    path('api/auth/verify-otp/', OTPVerifyView.as_view(), name='verify-otp'),
    path('api/auth/resend-otp/', ResendOTPView.as_view(), name='otp-resend'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/send-invite/', InviteUserView.as_view(), name='send_invite'),
    path('api/accept-invite/<uuid:token>', AcceptInviteView.as_view(), name='accept_invite'),

]

