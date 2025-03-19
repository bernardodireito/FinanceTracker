from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):

    
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='transactions')


    type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True) 
    date = models.DateTimeField()

    def __str__(self):
        return f"{self.get_type_display()} - {self.amount} ({self.category}) - {self.date.strftime('%Y-%m-%dT%H:%M:%S')}"
