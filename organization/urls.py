from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrganizationViewSet, OrganizationMembersListView

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('organizations/<int:pk>/members/', OrganizationMembersListView.as_view(), name='organization-members'),
]