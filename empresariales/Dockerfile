FROM python:3.11-slim
# Configura el buffer para que los logs se muestren en tiempo real
ENV PYTHONUNBUFFERED 1
WORKDIR /app
# Copiar e instalar dependencias
COPY requirements.txt .
RUN pip install -r requirements.txt
# Copiar todo el código fuente
COPY . .
# Exponer el puerto por defecto de Django
EXPOSE 8000
# Comando para iniciar el servidor de desarrollo
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]