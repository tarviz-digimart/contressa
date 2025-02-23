from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from organization.models import UserRole, Role, Designation
from.base_model import BaseModel


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, full_name=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, full_name=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, full_name, **extra_fields)

class CustomUser(AbstractUser, BaseModel):
    USER_TYPES = (
        ('employee', 'Employee'),
        ('client', 'Client'),
        ('vendor', 'Vendor'),
    )
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    receive_emails = models.BooleanField(default=True)
    receive_notifications = models.BooleanField(default=True)
    active_status = models.BooleanField(default=False)
    user_type = models.CharField(max_length=10, choices=USER_TYPES)
    organization = models.ForeignKey("organization.Organization", on_delete=models.CASCADE, blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = ['full_name']  

    def get_role(self):
        """Fetch the user's global role (not per branch)"""
        try:
            return UserRole.objects.get(user=self).role  
        except UserRole.DoesNotExist:
            return None

    def get_role_permissions(self):
        """Fetch the user's global permissions"""
        role = self.get_role()
        if role:
            return role.permissions 
        return {}
    
    def has_permission(self, permission):
        """Check if the user has a specific permission"""
        permissions = self.get_role_permissions()
        return permissions.get(permission, False)
    
    def save(self, *args, **kwargs):
        if self.full_name:
            names = self.full_name.split(' ', 1)
            self.first_name = names[0]
            if len(names) > 1:
                self.last_name = names[1]
            else:
                self.last_name = ''
        self.username = self.email
        super().save(*args, **kwargs)

class Employee(BaseModel):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="employee_profile")
    branch = models.ForeignKey('organization.Branch', on_delete=models.SET_NULL, null=True, blank=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, related_name="employees")
    designation = models.ForeignKey(Designation, on_delete=models.SET_NULL, null=True, blank=True, related_name="employees")
    # teams = models.ManyToManyField('organization.Team', blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    commission_type = models.CharField(max_length=50, choices=[('markup', 'Markup-Based')], null=True, blank=True)
    reports_to = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name="subordinates")
    joining_date = models.DateField(null=True, blank=True)
    organization = models.ForeignKey("organization.Organization", on_delete=models.CASCADE, null=True, blank=True)

    def clean(self):
        """Enforce role-based constraints for organization and reporting structure."""

        if self.role:
            role_name = self.role.name.lower()

            if role_name == "owner":
                # Owner must always belong to an organization
                if not self.organization:
                    raise ValidationError({"organization": "Owner must belong to an organization."})

                # Ensure only one owner per organization
                existing_owner = Employee.objects.filter(
                    organization=self.organization,
                    role__name__iexact="owner"
                ).exclude(id=self.id).exists()

                if existing_owner:
                    raise ValidationError({"role": "An organization can have only one owner."})

                self.reports_to = None  # Owner should never report to anyone

            elif role_name == "creator":
                # Creator can exist without an organization
                pass  

            else:
                # All other employees (except Creator) must belong to an organization
                if not self.organization:
                    raise ValidationError({"organization": "Members with roles other than 'Creator' must belong to an organization."})

                # Auto-assign reports_to if missing (assign to the existing owner)
                if not self.reports_to:
                    owner = Employee.objects.filter(
                        organization=self.organization, role__name__iexact="owner"
                    ).first()
                    if owner:
                        self.reports_to = owner


    def save(self, *args, **kwargs):
        self.full_clean() 
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Transfer ownership to 'Temp Owner' before deleting the owner."""
        if self.role and self.role.name.lower() == "owner":
            temp_owner = Employee.objects.filter(
                organization=self.organization, role__name__iexact="temp owner"
            ).first()

            if not temp_owner:
                raise ValidationError("Cannot delete the owner unless a 'Temp Owner' exists.")

            # Get the Owner role
            owner_role = Role.objects.filter(name__iexact="owner").first()
            if not owner_role:
                raise ValidationError("The 'Owner' role is missing from the database.")

            # Promote temp owner to Owner
            temp_owner.role = owner_role
            temp_owner.save()

            # Delete the current owner
            super().delete(*args, **kwargs)

        else:
            super().delete(*args, **kwargs)


class Vendor(BaseModel):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="vendor_profile")
    company_name = models.CharField(max_length=255, null=True, blank=True)
    category = models.CharField(max_length=255, null=True, blank=True)
    # preferred_products = models.ManyToManyField('inventory.Product', blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    payment_terms = models.CharField(max_length=50, null=True, blank=True)
    organization = models.ForeignKey("organization.Organization", on_delete=models.CASCADE)


class Client(BaseModel):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="client_profile")
    company_name = models.CharField(max_length=255, null=True, blank=True)
    business_type = models.CharField(max_length=255, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    payment_terms = models.CharField(max_length=50, null=True, blank=True)
    organization = models.ForeignKey("organization.Organization", on_delete=models.CASCADE)
