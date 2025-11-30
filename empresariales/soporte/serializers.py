from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        # El usuario no se pide, se asigna automáticamente en la vista
        fields = ['id', 'asunto', 'mensaje', 'fecha_creacion', 'estado']
        read_only_fields = ['usuario', 'estado']