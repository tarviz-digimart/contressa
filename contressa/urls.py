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
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from organization.views import CustomUserViewSet
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from organization.views import CustomRegisterView
from dj_rest_auth.registration.views import VerifyEmailView
from allauth.account.views import ConfirmEmailView, email_verification_sent


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)  

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
    path('auth/', include('dj_rest_auth.urls')),  # Login, logout, password reset
    # path('auth/registration/', include('dj_rest_auth.registration.urls')),  # Registration
    path('auth/social/', include('allauth.socialaccount.urls')),  # Social Auth (Google, Facebook, etc.)
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),name='schema-redoc'),
    path('api/', include(router.urls)),
    path('auth/social/login/', GoogleLogin.as_view(), name='google_login'),
    path('auth/registration/', CustomRegisterView.as_view()), # Override the registration URL
    path('auth/registration/account-confirm-email/<str:key>/', ConfirmEmailView.as_view(), name='account_confirm_email'),
    path('auth/verification-sent/', email_verification_sent, name='account_email_verification_sent'),
    path('auth/registration/verify-email/', VerifyEmailView.as_view(), name='rest_verify_email'),

]