FROM python:3.11-slim
# Configura el buffer para que los logs se muestren en tiempo real
ENV PYTHONUNBUFFERED 1
WORKDIR /app
# Copiar e instalar dependencias
COPY requirements.txt .
RUN pip install -r requirements.txt
# Copiar todo el código fuente
COPY . .
# CRÍTICO: Haz que el script de inicio sea ejecutable
RUN chmod +x entrypoint.sh 
EXPOSE 8000
# Comando de entrada
CMD ["/bin/sh", "entrypoint.sh"]