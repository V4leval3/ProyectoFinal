FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# 🚨 Reemplaza el nombre del JAR si es necesario
# Copiar el archivo JAR construido (generado con mvn package)
COPY target/tecsup_proyectos-0.0.1-SNAPSHOT.jar app.jar 
# Exponer el puerto por defecto de Spring Boot
EXPOSE 8080
# Comando de entrada para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]