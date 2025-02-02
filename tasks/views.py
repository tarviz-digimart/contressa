from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can access

    def get_queryset(self):
        """
        Filter projects by organization or users if query parameters are provided.
        """
        queryset = Project.objects.all()
        organization_id = self.request.query_params.get('organization')
        user_id = self.request.query_params.get('user')

        if organization_id:
            queryset = queryset.filter(organization__id=organization_id)
        if user_id:
            queryset = queryset.filter(users__id=user_id)

        return queryset

    def perform_create(self, serializer):
        """
        Automatically assign the authenticated user as an admin when creating a project.
        """
        project = serializer.save()
        project.admins.add(self.request.user)  # Add the creator as an admin

    def update(self, request, *args, **kwargs):
        """
        Only admins can update project details.
        """
        project = get_object_or_404(Project, pk=kwargs.get('pk'))
        if request.user not in project.admins.all():
            return Response({"error": "Only project admins can update this project."}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Only admins can delete a project.
        """
        project = get_object_or_404(Project, pk=kwargs.get('pk'))
        if request.user not in project.admins.all():
            return Response({"error": "Only project admins can delete this project."}, status=403)
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def move_workitem(self, request, pk=None):
        # Get the project
        project = self.get_object()

        # Get the workitem and new column from the request
        workitem_id = request.data.get('workitem_id')
        new_column_id = request.data.get('new_column_id')

        # Retrieve the WorkItem and new Column
        workitem = get_object_or_404(WorkItem, id=workitem_id)
        new_column = get_object_or_404(Column, id=new_column_id, project=project)

        # Update the WorkItem's column and save
        workitem.column = new_column
        workitem.save()

        # Return a response indicating success
        return Response({"detail": "WorkItem moved successfully."}, status=status.HTTP_200_OK)
