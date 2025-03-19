# Generated by Django 5.1.6 on 2025-03-13 22:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Transaction",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[("income", "Income"), ("expense", "Expense")],
                        max_length=7,
                    ),
                ),
                ("amount", models.DecimalField(decimal_places=2, max_digits=10)),
                ("category", models.CharField(max_length=50)),
                ("description", models.TextField(blank=True, null=True)),
                ("date", models.DateTimeField()),
            ],
        ),
    ]
