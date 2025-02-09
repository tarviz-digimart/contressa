from django.db import models
from django_lifecycle import LifecycleModel
from simple_history.models import HistoricalRecords
from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.db import models

class BaseModel(LifecycleModel, models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    history = HistoricalRecords(inherit=True)
    archived = models.BooleanField(default=False)
    archived_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        abstract = True


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
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    designation = models.ForeignKey('organization.Designation', on_delete=models.SET_NULL, null=True, blank=True)
    receive_emails = models.BooleanField(default=True)
    receive_notifications = models.BooleanField(default=True)
    active_status = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'  # Email as username for login
    REQUIRED_FIELDS = ['full_name']  # Full name is now required

    def save(self, *args, **kwargs):
        # Split full name into first and last name
        if self.full_name:
            names = self.full_name.split(' ', 1)
            self.first_name = names[0]
            if len(names) > 1:
                self.last_name = names[1]
            else:
                self.last_name = ''
        self.username = self.email
        super().save(*args, **kwargs)
