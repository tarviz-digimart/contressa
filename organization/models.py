from django.db import models
from base.base_model import BaseModel
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
import uuid
from django.core.exceptions import ValidationError
from crum import get_current_user
from django.db.models.signals import pre_save
from django.contrib.postgres.fields import ArrayField 


class Organization(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True, related_name="organizations")
    headquarters = models.OneToOneField(
        'Branch', on_delete=models.SET_NULL, null=True, blank=True,
        related_name="hq_of",
        help_text="The main headquarters of the organization."
    )
    domains = ArrayField(models.CharField(max_length=255), blank=True, default=list)  
    def clean(self):
        """Ensure a user cannot be the owner of multiple organizations."""
        if self.owner and Organization.objects.filter(owner=self.owner).exclude(id=self.id).exists():
            raise ValidationError({"owner": "This user is already the owner of another organization."})
        
    def __str__(self):
        return self.name

    
@receiver(pre_save, sender=Organization)
def assign_owner(sender, instance, **kwargs):
    """Automatically assign the logged-in user as owner if not set."""
    if not instance.owner:
        user = get_current_user()
        if user and user.is_authenticated:
            instance.owner = user  

            
@receiver(post_save, sender=Organization)
def create_default_roles(sender, instance, created, **kwargs):
    if created:
        print("Creating owner role...")
        owner_role = Role.objects.create(
            name="Owner",
            organization=instance,
            level=1,
            permissions=[p[0] for p in PERMISSION_CHOICES]
        )

        print(f"Org owner: {instance.owner}")
        from base.models import Employee

        if instance.owner:
            print("Entering instance owner...")
            employee = Employee.objects.filter(user=instance.owner).first()
            print("Getting the owner details...")
            if employee:
                employee.organization = instance
                employee.role = owner_role 
                employee.save()


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
    address_line_1 = models.CharField(max_length=255, blank=True, null=True)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Warehouse(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    branch = models.ForeignKey('Branch', on_delete=models.CASCADE, related_name="warehouses")  
    address_line_1 = models.CharField(max_length=255, blank=True, null=True)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
PERMISSION_CHOICES = [
    # Branches
    ("view_branches", "View Branches"),
    ("create_branches", "Create Branches"),
    ("edit_branches", "Edit Branches"),
    ("delete_branches", "Delete Branches"),
    ("export_branches", "Export Branches"),

    # Members
    ("view_members", "View Members"),
    ("create_members", "Create Members"),
    ("edit_members", "Edit Members"),
    ("delete_members", "Delete Members"),
    ("invite_members", "Invite Members"),
    ("export_members", "Export Members"),
    ("bulk_import_members", "Bulk Import Members"),

    # Roles
    ("view_roles", "View Roles"),
    ("create_roles", "Create Roles"),
    ("edit_roles", "Edit Roles"),
    ("delete_roles", "Delete Roles"),
    ("export_roles", "Export Roles"),
    ("bulk_import_roles", "Bulk Import Roles"),

    # Projects
    ("view_projects", "View Projects"),
    ("create_projects", "Create Projects"),
    ("edit_projects", "Edit Projects"),
    ("delete_projects", "Delete Projects"),
    ("export_projects", "Export Projects"),
    ("bulk_import_projects", "Bulk Import Projects"),

    # Kanban Columns
    ("view_kanban_columns", "View Kanban Columns"),
    ("create_kanban_columns", "Create Kanban Columns"),
    ("edit_kanban_columns", "Edit Kanban Columns"),
    ("delete_kanban_columns", "Delete Kanban Columns"),

    # Work Items
    ("view_work_items", "View Work Items"),
    ("create_work_items", "Create Work Items"),
    ("edit_work_items", "Edit Work Items"),
    ("delete_work_items", "Delete Work Items"),
    ("export_work_items", "Export Work Items"),

    # Time Off Requests
    ("view_time_off_requests", "View Time Off Requests"),
    ("create_time_off_requests", "Create Time Off Requests"),
    ("edit_time_off_requests", "Edit Time Off Requests"),
    ("delete_time_off_requests", "Delete Time Off Requests"),
    ("export_time_off_requests", "Export Time Off Requests"),
    ("bulk_import_time_off_requests", "Bulk Import Time Off Requests"),

    ("view_vendors", "View Vendors"),
    ("create_vendors", "Create Vendors"),
    ("edit_vendors", "Edit Vendors"),
    ("delete_vendors", "Delete Vendors"),
    ("approve_vendors", "Approve Vendors"),
    ("export_vendors", "Export Vendors"),
    ("bulk_import_vendors", "Bulk Import Vendors"),

    ("view_products", "View Products"),
    ("create_products", "Create Products"),
    ("edit_products", "Edit Products"),
    ("delete_products", "Delete Products"),
    ("approve_products", "Approve Products"),
    ("export_products", "Export Products"),
    ("bulk_import_products", "Bulk Import Products"),

    ("view_purchase_orders", "View Purchase Orders"),
    ("create_purchase_orders", "Create Purchase Orders"),
    ("edit_purchase_orders", "Edit Purchase Orders"),
    ("delete_purchase_orders", "Delete Purchase Orders"),
    ("approve_purchase_orders", "Approve Purchase Orders"),
    ("export_purchase_orders", "Export Purchase Orders"),

    ("view_purchase_invoices", "View Purchase Invoices"),
    ("create_purchase_invoices", "Create Purchase Invoices"),
    ("edit_purchase_invoices", "Edit Purchase Invoices"),
    ("delete_purchase_invoices", "Delete Purchase Invoices"),
    ("approve_purchase_invoices", "Approve Purchase Invoices"),
    ("export_purchase_invoices", "Export Purchase Invoices"),

    ("view_payments_made", "View Payments Made"),
    ("create_payments_made", "Create Payments Made"),
    ("edit_payments_made", "Edit Payments Made"),
    ("delete_payments_made", "Delete Payments Made"),
    ("approve_payments_made", "Approve Payments Made"),
    ("export_payments_made", "Export Payments Made"),

    ("view_warehouses", "View Warehouses"),
    ("create_warehouses", "Create Warehouses"),
    ("edit_warehouses", "Edit Warehouses"),
    ("delete_warehouses", "Delete Warehouses"),
    ("export_warehouses", "Export Warehouses"),
    ("bulk_import_warehouses", "Bulk Import Warehouses"),

    ("view_customers", "View Customers"),
    ("create_customers", "Create Customers"),
    ("edit_customers", "Edit Customers"),
    ("delete_customers", "Delete Customers"),
    ("approve_customers", "Approve Customers"),
    ("export_customers", "Export Customers"),
    ("bulk_import_customers", "Bulk Import Customers"),

    ("view_quotes", "View Quotes"),
    ("create_quotes", "Create Quotes"),
    ("edit_quotes", "Edit Quotes"),
    ("delete_quotes", "Delete Quotes"),
    ("approve_quotes", "Approve Quotes"),
    ("export_quotes", "Export Quotes"),

    ("view_sales_orders", "View Sales Orders"),
    ("create_sales_orders", "Create Sales Orders"),
    ("edit_sales_orders", "Edit Sales Orders"),
    ("delete_sales_orders", "Delete Sales Orders"),
    ("approve_sales_orders", "Approve Sales Orders"),
    ("export_sales_orders", "Export Sales Orders"),

    ("view_invoices", "View Invoices"),
    ("create_invoices", "Create Invoices"),
    ("edit_invoices", "Edit Invoices"),
    ("delete_invoices", "Delete Invoices"),
    ("approve_invoices", "Approve Invoices"),
    ("export_invoices", "Export Invoices"),

    ("view_returns", "View Returns"),
    ("create_returns", "Create Returns"),
    ("edit_returns", "Edit Returns"),
    ("delete_returns", "Delete Returns"),
    ("approve_returns", "Approve Returns"),
    ("export_returns", "Export Returns"),

    ("view_discounts", "View Discounts"),
    ("create_discounts", "Create Discounts"),
    ("edit_discounts", "Edit Discounts"),
    ("delete_discounts", "Delete Discounts"),
    ("approve_discounts", "Approve Discounts"),
    ("export_discounts", "Export Discounts"),
    ("bulk_import_discounts", "Bulk Import Discounts"),

    ("view_meetings", "View Meetings"),
    ("create_meetings", "Create Meetings"),
    ("edit_meetings", "Edit Meetings"),
    ("delete_meetings", "Delete Meetings"),
    ("approve_meetings", "Approve Meetings"),
    ("export_meetings", "Export Meetings"),

    ("view_forms", "View Forms"),
    ("create_forms", "Create Forms"),
    ("edit_forms", "Edit Forms"),
    ("delete_forms", "Delete Forms"),
    ("approve_forms", "Approve Forms"),

    ("view_tickets", "View Tickets"),
    ("create_tickets", "Create Tickets"),
    ("edit_tickets", "Edit Tickets"),
    ("delete_tickets", "Delete Tickets"),
    ("approve_tickets", "Approve Tickets"),
    ("export_tickets", "Export Tickets"),
    ("resolve_tickets", "Resolve Tickets"),
]

class Permission(models.Model):
    name = models.CharField(max_length=255, unique=True) 
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)    
    def __str__(self):
        return self.name


class Role(BaseModel):
    name = models.CharField(max_length=255)
    level = models.PositiveIntegerField(default=2)  # Owner will be level 1
    description = models.TextField(blank=True, null=True)
    organization = models.ForeignKey('Organization', on_delete=models.CASCADE, related_name="roles", blank=True, null=True)
    permissions = models.JSONField(default=list)  # Store a list of permission codes

    def clean(self):
        """Enforce reports_to constraint and organization assignment based on role."""
        
        if not self.name.lower() == "owner" and not self.organization:
            raise ValidationError({"organization": "Organization cannot be empty."})

                
    def delete(self, *args, **kwargs):
        """Prevent deletion of the 'Owner' role."""
        if self.name.lower() == "owner":
            raise ValidationError("The 'Owner' role cannot be deleted.")
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - Level {self.level}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'organization'], 
                name='unique_role_per_organization'
            )
        ]

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


class UserRole(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.role.name}"




class OrganizationInvite(models.Model):
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)  # Unique token for verification
    email = models.EmailField(unique=True)  # Ensure no duplicate invites
    full_name = models.CharField(max_length=255)
    branch = models.ForeignKey('Branch', on_delete=models.SET_NULL, null=True, blank=True)
    role = models.ForeignKey('Role', on_delete=models.CASCADE)  # Pre-assign a role
    designation = models.ForeignKey('organization.Designation', on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="sent_invites")  # Who sent the invite
    expires_at = models.DateTimeField()  
    accepted_at = models.DateTimeField(null=True, blank=True) 
    is_active = models.BooleanField(default=True)  
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(days=7)  # Default expiry 7 days
        super().save(*args, **kwargs)

    def is_expired(self):
        """Check if the invite is expired"""
        return timezone.now() > self.expires_at