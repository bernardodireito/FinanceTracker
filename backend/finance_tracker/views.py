import json
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from django.utils.dateparse import parse_datetime
from .models import Transaction
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.middleware.csrf import get_token
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

# Custom authentication decorator
def require_authentication(func):
    def wrapper(request, *args, **kwargs):
        auth = JWTAuthentication()
        try:
            user_auth_tuple = auth.authenticate(request)
            if user_auth_tuple is None:
                raise AuthenticationFailed("Authentication required.")
            request.user, _ = user_auth_tuple  # Set the authenticated user
        except AuthenticationFailed as e:
            return JsonResponse({"error": str(e)}, status=401)
        return func(request, *args, **kwargs)
    return wrapper

# --------------------
# USERS "INTERFACE"
# --------------------

@csrf_exempt
def register(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            if not username or not password:
                return JsonResponse({"error": "Username and password required."}, status=400)
            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "User already exists."}, status=400)
            user = User.objects.create_user(username=username, password=password)
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                "message": "User registered successfully.",
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Method not allowed."}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    "message": "Logged in successfully.",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh)
                })
            else:
                return JsonResponse({"error": "Invalid credentials."}, status=401)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Method not allowed."}, status=405)

@csrf_exempt
def logout_view(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({"message": "Logged out successfully."})
    return JsonResponse({"error": "Method not allowed."}, status=405)

# --------------------
# PLATFORM ITSELF
# --------------------

@csrf_exempt
@require_authentication
def list_transactions(request):
    if request.method == "GET":
        # Retrieve only the transactions that belong to the authenticated user
        transactions = Transaction.objects.filter(owner=request.user).order_by('-date')

        if not transactions.exists():
            return JsonResponse({'message': 'No transactions found.'}, status=404)
        
        transactions_list = []
        for t in transactions:
            transactions_list.append({
                'id': t.id,
                'type': t.type,
                'amount': float(t.amount),
                'category': t.category,
                'description': t.description,
                'date': t.date.strftime('%Y-%m-%dT%H:%M:%S')
            })
        return JsonResponse({'transactions': transactions_list})
    
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            parsed_date = parse_datetime(data.get('date', ''))
            if parsed_date is None:
                return JsonResponse({'error': 'Invalid date format.'}, status=400)
            transaction = Transaction.objects.create(
                owner=request.user,  # Associate transaction with logged-in user
                type=data.get('type'),
                amount=data.get('amount'),
                category=data.get('category'),
                description=data.get('description', ''),
                date=parsed_date
            )
            return JsonResponse({
                'id': transaction.id,
                'type': transaction.type,
                'amount': float(transaction.amount),
                'category': transaction.category,
                'description': transaction.description,
                'date': transaction.date.strftime('%Y-%m-%dT%H:%M:%S')
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

@csrf_exempt
@require_authentication
def add_income_transaction(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            amount = data.get('amount')
            if float(amount) < 0:
                return JsonResponse({'error': 'Amount must be non-negative.'}, status=400)
            parsed_date = parse_datetime(data.get('date', ''))
            if parsed_date is None:
                return JsonResponse({'error': 'Invalid date format.'}, status=400)
            transaction = Transaction.objects.create(
                owner=request.user,
                type='income',
                amount=amount,
                category=data.get('category'),
                description=data.get('description', ''),
                date=parsed_date
            )
            return JsonResponse({
                'id': transaction.id,
                'type': transaction.type,
                'amount': float(transaction.amount),
                'category': transaction.category,
                'description': transaction.description,
                'date': transaction.date.strftime('%Y-%m-%dT%H:%M:%S')
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return HttpResponseNotAllowed(['POST'])


@csrf_exempt
@require_authentication
def add_expense_transaction(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            amount = data.get('amount')
            if float(amount) < 0:
                return JsonResponse({'error': 'Amount must be non-negative.'}, status=400)
            parsed_date = parse_datetime(data.get('date', ''))
            if parsed_date is None:
                return JsonResponse({'error': 'Invalid date format.'}, status=400)
            transaction = Transaction.objects.create(
                owner=request.user,
                type='expense',
                amount=amount,
                category=data.get('category'),
                description=data.get('description', ''),
                date=parsed_date
            )
            return JsonResponse({
                'id': transaction.id,
                'type': transaction.type,
                'amount': float(transaction.amount),
                'category': transaction.category,
                'description': transaction.description,
                'date': transaction.date.strftime('%Y-%m-%dT%H:%M:%S')
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return HttpResponseNotAllowed(['POST'])


@csrf_exempt
@require_authentication
def delete_transaction(request, transaction_id):
    if request.method == "DELETE":
        # Only allow deletion of transactions belonging to the logged-in user
        transaction = get_object_or_404(Transaction, id=transaction_id, owner=request.user)
        transaction.delete()
        return JsonResponse({'message': 'Transaction deleted.'})
    else:
        return HttpResponseNotAllowed(['DELETE'])


@csrf_exempt
@require_authentication
def edit_transaction(request, transaction_id):
    if request.method == "PUT":
        transaction = get_object_or_404(Transaction, id=transaction_id, owner=request.user)
        try:
            data = json.loads(request.body)
            transaction.type = data.get('type', transaction.type)
            transaction.amount = data.get('amount', transaction.amount)
            transaction.category = data.get('category', transaction.category)
            transaction.description = data.get('description', transaction.description)
            new_date = data.get('date')
            if new_date:
                parsed_date = parse_datetime(new_date)
                if parsed_date is None:
                    return JsonResponse({'error': 'Invalid date format.'}, status=400)
                transaction.date = parsed_date
            transaction.save()
            return JsonResponse({
                'id': transaction.id,
                'type': transaction.type,
                'amount': float(transaction.amount),
                'category': transaction.category,
                'description': transaction.description,
                'date': transaction.date.strftime('%Y-%m-%dT%H:%M:%S')
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return HttpResponseNotAllowed(['PUT'])

@csrf_exempt
@require_authentication
def expense_breakdown(request):
    if request.method == "GET":
        expenses = Transaction.objects.filter(owner=request.user, type='expense')
        breakdown = expenses.values('category').annotate(total=Sum('amount'))
        return JsonResponse({'breakdown': list(breakdown)})
    else:
        return HttpResponseNotAllowed(['GET'])

@csrf_exempt
@require_authentication
def income_vs_expenses(request):
    if request.method == "GET":
        income_total = Transaction.objects.filter(owner=request.user, type='income').aggregate(total=Sum('amount'))['total'] or 0
        expense_total = Transaction.objects.filter(owner=request.user, type='expense').aggregate(total=Sum('amount'))['total'] or 0
        return JsonResponse({
            'income': float(income_total),
            'expenses': float(expense_total)
        })
    else:
        return HttpResponseNotAllowed(['GET'])


@csrf_exempt
@require_authentication
def monthly_summary(request, year, month):
    if request.method == "GET":
        # Summarize transactions only for the authenticated user
        transactions = Transaction.objects.filter(owner=request.user, date__year=year, date__month=month)
        income_total = transactions.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0
        expense_total = transactions.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0
        balance = income_total - expense_total
        return JsonResponse({
            'year': year,
            'month': month,
            'total_income': float(income_total),
            'total_expenses': float(expense_total),
            'balance': float(balance)
        })
    else:
        return HttpResponseNotAllowed(['GET'])

@csrf_exempt
@require_authentication
def overall_balance(request):
    if request.method == "GET":
        # Calculate overall balance only for the authenticated user
        income_total = Transaction.objects.filter(owner=request.user, type='income').aggregate(total=Sum('amount'))['total'] or 0
        expense_total = Transaction.objects.filter(owner=request.user, type='expense').aggregate(total=Sum('amount'))['total'] or 0
        balance = income_total - expense_total
        return JsonResponse({
            'total_income': float(income_total),
            'total_expenses': float(expense_total),
            'balance': float(balance)
        })
    else:
        return HttpResponseNotAllowed(['GET'])
