# Generated by Django 5.1.5 on 2025-02-25 16:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_remove_pendingotp_organization'),
    ]

    operations = [
        migrations.AddField(
            model_name='pendingotp',
            name='raw_otp',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]
