# Stage 1: Build the React application (Compilación)
FROM node:20-alpine AS build
WORKDIR /app
# Copiar archivos de dependencia
COPY package.json .
COPY package-lock.json .
RUN npm install
# Copiar código fuente y construir la versión de producción
COPY . .
RUN npm run build 

# Stage 2: Serve the application using a lightweight web server (Nginx)
FROM nginx:stable-alpine
# Copiar los archivos estáticos generados por npm run build
COPY --from=build /app/dist /usr/share/nginx/html 
# El puerto 80 es el puerto estándar que usará Nginx dentro del contenedor
EXPOSE 80
# El comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]