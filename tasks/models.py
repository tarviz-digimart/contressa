from django.db import models
from base.base_model import BaseModel
from organization.models import Organization
from django.conf import settings

class Project(BaseModel):
    name = models.CharField(max_length=255)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="projects")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="projects")
    allowskip = models.BooleanField(default=True)
    admins = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="admin_projects")
    all_users_admin = models.BooleanField(default=False)
    
# Column Model (Kanban-style board)
class Column(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="columns")
    title = models.CharField(max_length=255)
    limit = models.PositiveIntegerField(default=0)  # 0 means unlimited work items
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

class Label(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

# Work Item Model
class WorkItem(models.Model):
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name="workitems")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    assigned_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="assigned_tasks")
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="tasks")
    assigned_at = models.DateTimeField(auto_now_add=True)
    label = models.ManyToManyField(Label, related_name="workitems", blank=True)  # Label for WorkItem (many-to-many)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name="subtasks")  # Self-reference for parent WorkItem
    is_priority = models.BooleanField(default=False)  # To mark priority
    deadline = models.DateTimeField(null=True, blank=True)  # Deadline for the task
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

class WorkItemImage(models.Model):
    workitem = models.ForeignKey(WorkItem, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="workitem_images/")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)



class WorkItemFile(models.Model):
    workitem = models.ForeignKey(WorkItem, on_delete=models.CASCADE, related_name="files")
    file = models.FileField(upload_to="workitem_files/")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

class WorkItemCustomerNotification(models.Model):
    workitem = models.ForeignKey(WorkItem, on_delete=models.CASCADE, related_name="customer_notifications")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="workitem_notifications")
    notify = models.BooleanField(default=False)  # Whether to notify the customer
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)


class Comment(models.Model):
    workitem = models.ForeignKey(WorkItem, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name="replies")  # Self-referencing for nested replies
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
