from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import admin_create_user, admin_manage_user, current_user, login_user, logout_user, register_user

urlpatterns = [
    path("register/", register_user, name="register_user"),
    path("admin/users/", admin_create_user, name="admin_create_user"),
    path("admin/users/<int:user_id>/", admin_manage_user, name="admin_manage_user"),
    path("login/", login_user, name="login_user"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", current_user, name="current_user"),
    path("logout/", logout_user, name="logout_user"),
]
