from django.urls import path
from .views import register, login_view, logout_view
from .views import (
    list_transactions, 
    add_income_transaction, 
    add_expense_transaction,
    delete_transaction, 
    edit_transaction, 
    expense_breakdown, 
    income_vs_expenses,
    monthly_summary, 
    overall_balance
)

urlpatterns = [

    # USER INTERFACE
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),

    # List all transactions or add a transaction (generic)
    path('transactions/', list_transactions, name='transactions_list_create'),
    
    # Endpoints to add a specific type of transaction
    path('transactions/income/', add_income_transaction, name='add_income_transaction'),
    path('transactions/expense/', add_expense_transaction, name='add_expense_transaction'),
    
    # Delete a transaction by its id
    path('transactions/<int:transaction_id>/', delete_transaction, name='transaction_delete'),
    
    path('transactions/edit/<int:transaction_id>/', edit_transaction, name='edit_transaction'),
    path('expense_breakdown/', expense_breakdown, name='expense_breakdown'),
    path('income_vs_expenses/', income_vs_expenses, name='income_vs_expenses'),

    # Get monthly summary for a given year and month
    path('summary/monthly/<int:year>/<int:month>/', monthly_summary, name='monthly_summary'),
    
    # Get overall balance summary
    path('balance/', overall_balance, name='overall_balance'),
]
