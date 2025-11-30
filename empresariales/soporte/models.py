from django.db import models
from django.contrib.auth.models import User

class Ticket(models.Model):
    # Relacionar el ticket al usuario que lo crea
    usuario = models.ForeignKey(User, on_delete=models.CASCADE) 

    ASUNTOS = [
        ('BUG', 'Error de Plataforma'),
        ('INFO', 'Consulta de Contacto Empresarial'),
        ('REPORT', 'Reporte de Proyecto'),
        ('OTHER', 'Otro'),
    ]

    asunto = models.CharField(max_length=50, choices=ASUNTOS)
    mensaje = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    ESTADOS = [
        ('PENDIENTE', 'Pendiente de Revisión'),
        ('PROCESO', 'En Proceso'),
        ('RESUELTO', 'Resuelto'),
    ]
    estado = models.CharField(max_length=10, choices=ESTADOS, default='PENDIENTE')

    def __str__(self):
        return f'Ticket #{self.id} - {self.asunto}'