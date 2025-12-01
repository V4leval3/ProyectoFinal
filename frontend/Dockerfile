# Stage 1: Build the React application (Compilación)
FROM node:20-alpine AS build
WORKDIR /app
# Copiar archivos de dependencia
COPY package.json .
COPY package-lock.json .
RUN npm install --legacy-peer-deps --no-audit --no-fund
# Copiar código fuente y construir la versión de producción
COPY . .
RUN npm run build 

# Stage 2: Serve the application using a lightweight web server (Nginx)
FROM nginx:stable-alpine
# Copiar los archivos estáticos generados por npm run build
COPY --from=build /app/dist /usr/share/nginx/html
# Copiar configuración personalizada de Nginx para SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Generar certificado autofirmado en tiempo de build para HTTPS local (dev)
RUN apk add --no-cache openssl \
	&& mkdir -p /etc/nginx/certs \
	&& openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout /etc/nginx/certs/self.key \
		-out /etc/nginx/certs/self.crt \
		-subj "/CN=localhost" \
	&& chmod 600 /etc/nginx/certs/self.key

# Exponer puerto HTTPS dentro del contenedor (usaremos 443)
EXPOSE 443

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]