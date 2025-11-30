from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated] # Solo usuarios logueados pueden crear tickets

    # Este método asegura que solo se muestren los tickets del usuario logueado
    def get_queryset(self):
        return Ticket.objects.filter(usuario=self.request.user).order_by('-fecha_creacion')

    # Este método asigna el usuario logueado al ticket automáticamente al crearlo
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)