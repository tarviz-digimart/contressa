from django.db import models
from base.models import BaseModel
from django.conf import settings
from django.core.exceptions import ValidationError


class Organization(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="organizations")
    superusers = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="superuser_organizations")
    headquarters = models.OneToOneField(
        'Branch', on_delete=models.SET_NULL, null=True, blank=True,
        related_name="hq_of",
        help_text="The main headquarters of the organization."
    )

    def clean(self):
        """Enforce unique user membership and proper user separation."""
        if self.owner:
            # Owner should not be in superusers or employees
            if self.superusers.filter(id=self.owner.id).exists():
                raise ValidationError("The owner cannot be a superuser of the same organization.")
            if self.employees.filter(id=self.owner.id).exists():
                raise ValidationError("The owner cannot be an employee of the same organization.")

        # Superusers should not be in employees
        if self.superusers.filter(id__in=self.employees.values_list("id", flat=True)).exists():
            raise ValidationError("Superusers cannot also be employees.")

    def save(self, *args, **kwargs):
        """Validate constraints before saving."""
        self.clean()  # Call validation before saving
        super().save(*args, **kwargs)

    def get_all_members(self):
        """Get all members of the organization, separating superusers and employees/admins."""
        
        # Prefetch branches along with related admins and employees
        branches = Branch.objects.filter(location__organization=self).prefetch_related("admins", "employees")
        
        # Fetch superusers directly
        superusers = list(self.superusers.all())
        
        # Collect employees and admins from branches
        employees_and_admins = set()
        
        for branch in branches:
            employees_and_admins.update(branch.admins.all())
            employees_and_admins.update(branch.employees.all())
        
        return {
            "superusers": superusers,
            "members": list(employees_and_admins)
        }


    def __str__(self):
        return self.name
    

class Location(BaseModel):
    name = models.CharField(max_length=255)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE, related_name="locations")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'organization'], 
                name='unique_location_per_organization'
            )
        ]

    def __str__(self):
        return self.name  

class Branch(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    location = models.ForeignKey('Location', on_delete=models.CASCADE, related_name="branches")  
    admins = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name="managed_branches",
        help_text="Users who are responsible for managing this branch."
    )
    employees = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="branches")
    address_line_1 = models.CharField(max_length=255, blank=True, null=True)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)

    def get_all_users(self):
        """Get all users in the branch, separating superusers, admins, and employees."""

        organization = self.location.organization  # Get the related organization

        return {
            "superusers": list(organization.superusers.all()),  # Superusers from the org
            "admins": list(self.admins.all()),  # Admins for this branch
            "employees": list(self.employees.all()),  # Employees for this branch
        }
    def __str__(self):
        return self.name
    
class Department(BaseModel):
    name = models.CharField(max_length=255)
    branch = models.ForeignKey('Branch', on_delete=models.CASCADE, related_name="departments")  
    department_heads = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name="managed_departments",
        help_text="Users who are responsible for managing this department."
    )

    def __str__(self):
        return self.name

class Designation(BaseModel):
    name = models.CharField(max_length=255)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE, related_name="designations")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'organization'], 
                name='unique_designation_per_organization'
            )
        ]


    def __str__(self):
        return self.name  
