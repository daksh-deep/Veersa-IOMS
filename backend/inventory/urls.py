from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Importing views
from .views import CustomerViews
from .views import ProductViews
from .views import OrderViews
from .views import AdminView
from .views import CsrfView

urlpatterns = [
    
    # Auth Routes
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Customer End-points
    path('customer/', CustomerViews.get_customers, name='get_customers'),
    path('customer/active/', CustomerViews.get_active_customers, name='get_active_customers'),
    path('customer/create/', CustomerViews.create_customer, name='create_customer'),
    path('customer/update/', CustomerViews.update_customer, name='update_customer'),
    path('customer/delete/', CustomerViews.delete_customer, name='delete_customer'),
    path('customer/<int:id>', CustomerViews.get_customers, name='get_customer_by_id'),


    # Product End-points
    path('product/', ProductViews.get_products, name='get_products'),
    path('product/create/', ProductViews.create_product, name='create_product'),
    path('product/update/', ProductViews.update_product, name='update_product'),
    path('product/delete/', ProductViews.delete_product, name='delete_product'),
    path('product/<int:id>', ProductViews.get_products, name='get_product_by_id'),

    # Order Routes
    path('order/', OrderViews.get_orders, name='get_orders'),
    path('order/create/', OrderViews.create_order, name="create_order"),
    path('order/delete/', OrderViews.delete_order, name="delete_order"),
    path('order/<int:id>/', OrderViews.get_order, name="get_order_by_id"),
    
    # Admin Login
    path('admin-login/', AdminView.admin_login, name='admin_login'),
    
    # CSRF Token Req
    path('csrf-token/', CsrfView.csrf_token_view, name="csrf_token_view"),
]