from rest_framework.routers import DefaultRouter
from .views import TicketViewSet

router = DefaultRouter()
# Esto crea las rutas: /api/tickets/ (GET, POST), /api/tickets/{id} (GET, PUT, DELETE)
router.register(r'tickets', TicketViewSet, basename='ticket') 

urlpatterns = router.urls