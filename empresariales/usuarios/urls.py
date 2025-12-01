from django.urls import path
from .views import RegisterView, UserDetailView

urlpatterns = [
    # Endpoint: POST /api/register/
    path('register/', RegisterView.as_view(), name='auth_register'),
    # Endpoint: GET /api/user/ (requires auth)
    path('user/', UserDetailView.as_view(), name='user_detail'),
]