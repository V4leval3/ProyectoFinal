from django.urls import path
from .views import RegisterView

urlpatterns = [
    # Endpoint: POST /api/register/
    path('register/', RegisterView.as_view(), name='auth_register'),
]