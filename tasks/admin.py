from django.contrib import admin
from django.apps import apps

# Get all models from the current app
app_models = apps.get_app_config('tasks').get_models()

# Register all models automatically
for model in app_models:
    admin.site.register(model)
