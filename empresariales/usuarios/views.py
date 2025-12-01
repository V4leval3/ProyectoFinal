from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserSerializer, UserDetailSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Permitimos que cualquiera se registre
    serializer_class = UserSerializer

class UserDetailView(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['is_admin'] = user.is_staff or user.is_superuser
        token['username'] = user.username
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({'detail': str(e)}, status=401)
        
        user = serializer.user
        token = CustomTokenObtainPairSerializer.get_token(user)
        response_data = {
            'access': str(token.access_token),
            'refresh': str(token),
            'is_admin': user.is_staff or user.is_superuser,
            'username': user.username,
        }
        return Response(response_data)
