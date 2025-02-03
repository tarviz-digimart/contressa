from django.db import models
from base.models import BaseModel
from organization.models import CustomUser, Organization
from django.core.exceptions import ValidationError


class Project(BaseModel):
    name = models.CharField(max_length=255)
    users = models.ManyToManyField(CustomUser, related_name="projects")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="projects")
    allowskip = models.BooleanField(default=True)
    admins = models.ManyToManyField(CustomUser, related_name="admin_projects")
    all_users_admin = models.BooleanField(default=False)

# Column Model (Kanban-style board)
class Column(BaseModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="columns")
    title = models.CharField(max_length=255)
    limit = models.PositiveIntegerField(default=0)  # 0 means unlimited work items

class Label(BaseModel):
    name = models.CharField(max_length=255)

class Type(BaseModel):
    name = models.CharField(max_length=25)

class Step(BaseModel):
    type = models.ForeignKey(Type, on_delete=models.CASCADE, related_name="steps")
    name = models.CharField(max_length=50)
    completion_date = models.DateTimeField(null=True, blank=True)

class Category(BaseModel):
    name = models.CharField(max_length=30)

class WorkItem(models.Model):
    unique_id = models.CharField(max_length=10, unique=True, editable=False)
    column = models.ForeignKey(Column, on_delete=models.CASCADE, related_name="workitems")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    assigned_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name="assigned_tasks")
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name="tasks")
    assigned_at = models.DateTimeField(auto_now_add=True)
    label = models.ManyToManyField(Label, related_name="workitems", blank=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name="subtasks")
    is_priority = models.BooleanField(default=False)
    deadline = models.DateTimeField(null=True, blank=True)
    type = models.ForeignKey(Type, on_delete=models.SET_NULL, null=True, related_name="workitems")  # Associate WorkItem with a Type
    type = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="workitems")  # Associate WorkItem with a Type

    def save(self, *args, **kwargs):
        if not self.unique_id:
            self.unique_id = self.generate_unique_id()
        super().save(*args, **kwargs)

    @classmethod
    def generate_unique_id(cls):
        last_workitem = cls.objects.order_by("-id").first()  # Get the last created WorkItem
        if last_workitem and last_workitem.unique_id:
            return cls.get_next_id(last_workitem.unique_id)
        return "A1"

    @staticmethod
    def get_next_id(current_id):
        import re

        match = re.match(r"([A-Z]+)(\d+)", current_id)
        if not match:
            return "A1"

        prefix, number = match.groups()
        number = int(number) + 1

        if number > 999:  # If we exceed 999, reset and move to the next prefix
            number = 1
            prefix = WorkItem.increment_prefix(prefix)

        return f"{prefix}{number}"

    @staticmethod
    def increment_prefix(prefix):
        """Increment the alphabetical prefix (e.g., A → B, Z → AA, AZ → BA)."""
        letters = list(prefix)
        i = len(letters) - 1

        while i >= 0:
            if letters[i] != 'Z':
                letters[i] = chr(ord(letters[i]) + 1)
                return "".join(letters)
            letters[i] = 'A'
            i -= 1

        return "A" + "".join(letters)  # Add an extra letter if needed
    

class WorkItemImage(models.Model):
    workitem = models.ForeignKey(WorkItem, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="workitem_images/")



class WorkItemFile(models.Model):
    workitem = models.ForeignKey(WorkItem, on_delete=models.CASCADE, related_name="files")
    file = models.FileField(upload_to="workitem_files/")

class WorkItemCustomerNotification(models.Model):
    workitem = models.ForeignKey(WorkItem, on_delete=models.CASCADE, related_name="customer_notifications")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="workitem_notifications")
    notify = models.BooleanField(default=False)  # Whether to notify the customer



class Comment(models.Model):
    workitem = models.ForeignKey(WorkItem, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="comments")
    parent = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.CASCADE, related_name="replies"
    )  # Allows replies, but only one level

    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        """Ensure that a reply cannot have another reply."""
        if self.parent and self.parent.parent:
            raise ValidationError("Replies cannot have replies.")

    def save(self, *args, **kwargs):
        """Validate before saving to prevent deep nesting."""
        self.clean()
        super().save(*args, **kwargs)