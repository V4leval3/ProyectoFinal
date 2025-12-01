#!/bin/sh

# entrypoint.sh 

# 1. Esperar a que PostgreSQL esté completamente activo
echo "Esperando a PostgreSQL..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "PostgreSQL listo!"

# 2. Aplicar migraciones de Django y crear superusuario
python manage.py makemigrations usuarios
python manage.py makemigrations soporte
python manage.py migrate
python manage.py createsuperuser --noinput || true # Si ya existe, ignora el error

# 3. Iniciar el servidor
exec python manage.py runserver 0.0.0.0:8000