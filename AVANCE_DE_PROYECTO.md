# Avance del Proyecto - Integrador

Fecha: 2025-11-30

Resumen general
- Proyecto orquestado con `docker-compose` con servicios: `frontend` (Vite + nginx), `backend-java` (Spring Boot), `backend-python` (Django) y `db` (Postgres).
- Objetivo: servir SPA (frontend) que consuma APIs Java (proyectos, checkout) y Python (auth), y soporte pagos vía Stripe (modo test).

Cambios realizados (resumen)
- Frontend
  - Normalicé todas las llamadas a APIs para usar rutas relativas `/api/...` (proxy nginx) en:
    - `frontend/src/pages/Home.jsx`
    - `frontend/src/components/CheckoutDonationModal_v2.jsx`
    - `frontend/src/components/CheckoutDonationModal.jsx`
    - `frontend/src/components/CheckoutInvestModal.jsx`
    - `frontend/src/components/CheckoutContactModal.jsx`
  - Modifiqué `ProyectoCard.jsx` para que el botón `Ver Detalles` siempre navegue a la página de detalle (antes estaba deshabilitado si `disponibleParaPatrocinio=false`). Esto asegura que los detalles del proyecto siempre sean visibles aunque ya no acepte inversiones.
  - Añadí un enlace en la `NavbarComponent.jsx` visible sólo para administradores: `Peticiones de Reclutamiento` → `/admin/reclutamientos`.
  - Añadida la página `AdminReclutamientos.jsx` (ya existía) que consume `/api/checkout/reclutamientos` usando la cabecera `X-Is-Admin: true` para compatibilidad retroactiva.

- Backend (Spring Boot)
  - Añadí dependencias para seguridad y JWT en `tecsup_proyectos/pom.xml`:
    - `spring-boot-starter-security`
    - `com.auth0:java-jwt`
  - Implementé un módulo minimal de seguridad (`tecsup_proyectos/src/main/java/com/example/tecsup_proyectos/security`):
    - `JwtUtil.java`: genera y verifica tokens JWT (algoritmo HMAC256, secreto desde `JWT_SECRET` env var; fallback dev).
    - `JwtAuthenticationFilter.java`: extrae `Authorization: Bearer <token>` y, si es válido, construye autenticación con roles.
    - `SecurityConfig.java`: registra `JwtAuthenticationFilter` y deja *públicos* los endpoints principales (`/api/proyectos/**`, `/api/checkout/**`, `/api/auth/**`) mientras protege rutas administrativas `/api/checkout/reclutamientos/**` para `ROLE_ADMIN`.
  - Añadí `AuthController` (`/api/auth/login`) que permite obtener un JWT para el usuario administrador definido en memoria (variables `ADMIN_USER` / `ADMIN_PASSWORD` o `admin`/`admin` por defecto). Este endpoint devuelve `{ token: "<jwt>" }`.
  - Actualicé `CheckoutController` para permitir tanto la cabecera `X-Is-Admin: true` (legacy) como la autorización basada en JWT (ROLE_ADMIN) al listar/actualizar `reclutamientos`.

Comprobaciones realizadas
- Reinicié `frontend` y `backend-java` mediante `docker-compose build/up`.
- Verifiqué desde host:
  - `GET http://127.0.0.1:5173/api/proyectos` → HTTP 200 con JSON (lista de proyectos).
  - `POST http://127.0.0.1:5173/api/checkout/donar` → respuesta simulada de donación (transactionId).
  - `POST http://127.0.0.1:5173/api/checkout/create-payment-intent` → devuelve `clientSecret` usando la clave Stripe test que proporcionaste.
- Verifiqué desde contenedor frontend la conectividad hacia `http://backend-java:8080/api/proyectos` → HTTP 200.

Archivos creados/Modificados importantes
- Modificados (frontend):
  - `frontend/src/pages/Home.jsx`
  - `frontend/src/components/CheckoutDonationModal_v2.jsx`
  - `frontend/src/components/CheckoutDonationModal.jsx`
  - `frontend/src/components/CheckoutInvestModal.jsx`
  - `frontend/src/components/CheckoutContactModal.jsx`
  - `frontend/src/components/ProyectoCard.jsx`
  - `frontend/src/components/NavbarComponent.jsx`
- Modificados (backend):
  - `tecsup_proyectos/pom.xml` (dependencias añadidas)
  - `tecsup_proyectos/src/main/java/com/example/tecsup_proyectos/security/JwtUtil.java`
  - `tecsup_proyectos/src/main/java/com/example/tecsup_proyectos/security/JwtAuthenticationFilter.java`
  - `tecsup_proyectos/src/main/java/com/example/tecsup_proyectos/security/SecurityConfig.java`
  - `tecsup_proyectos/src/main/java/com/example/tecsup_proyectos/controller/AuthController.java`
  - `tecsup_proyectos/src/main/java/com/example/tecsup_proyectos/controller/CheckoutController.java` (compatibilidad admin JWT/header)

Cómo funciona ahora (resumen de seguridad y flujo)
- Autenticación de usuarios (UI): sigue usando Django (endpoint `/api/token/`) para el flujo normal (login/register). Esa parte no se tocó.
- Administración (opcional): Ahora puedes obtener un JWT para el admin de Spring Boot usando `POST /api/auth/login` con las credenciales configuradas en las variables `ADMIN_USER` y `ADMIN_PASSWORD` del servicio `backend-java` (o `admin/admin` por defecto). El JWT debe enviarse en encabezado `Authorization: Bearer <token>` para acceder a rutas protegidas de gestión (`/api/checkout/reclutamientos/**`).
- Compatibilidad retroactiva: La API todavía acepta la cabecera legacy `X-Is-Admin: true` (esto mantiene funcionando la página `AdminReclutamientos.jsx` hasta que se actualice para usar JWT en el frontend).

Puntos pendientes (detectados y recomendaciones)
1. Revisión completa de seguridad: implementé un esquema minimalista JWT para administración. Para producción es necesario:
   - No exponer claves en texto plano en `docker-compose.yml` (usar Docker secrets / vault / variables de entorno en CI).
   - Cambiar el almacenamiento del usuario admin a una fuente persistente (base de datos) y usar `UserDetailsService` real.
   - Forzar HTTPS en producción y rotar claves Stripe/JWT.
   - Revisar permisos finos de endpoints (por ejemplo, quién puede crear `PaymentIntent`).

2. Gestión de base de datos (qué y cómo): ver sección siguiente.

3. Soporte (área pendiente): la UI muestra `Soporte` y hay una referencia a conectar a la API de Django para tickets. Falta crear el formulario en frontend y el endpoint correspondiente en Django (o reutilizar un modelo existente).

Operaciones sugeridas a continuación
- Si quieres, implemento que `AdminReclutamientos` use Authorization Bearer JWT automáticamente (en lugar de la cabecera `X-Is-Admin`). Puedo actualizar el frontend `AuthContext` para solicitar token de Spring (si procede) o agregar una pantalla admin de login.
- Implemento el formulario de soporte en frontend y el endpoint en Django (si me autorizas a editar `empresariales/`).

Cómo gestionar la base de datos (rápido)
- El servicio Postgres está expuesto en el host como `5432:5432` (puedes conectarte con:
  - Host: `127.0.0.1`
  - Puerto: `5432`
  - Usuario: `postgres`
  - Password: `7630`
  - Base: `proyectos_tecsup`
- Herramientas recomendadas para gestionar:
  - GUI: pgAdmin, DBeaver, TablePlus — crea una conexión con los datos anteriores.
  - Línea de comandos: `psql -h 127.0.0.1 -U postgres -d proyectos_tecsup` (ingresa la contraseña `7630`).
- Desde la BD puedes modificar la columna `disponible_para_patrocinio` o el `miembros_disponibles` de la tabla `proyecto` para habilitar/deshabilitar proyectos manualmente.

Nota sobre el problema que reportaste (proyecto deshabilitado impide ver detalles)
- He cambiado `ProyectoCard.jsx` para que el botón siempre permita navegar a la página de detalle; sólo se deshabilitan las acciones de inversión.
- En `ProyectoDetallePage.jsx` las comprobaciones ya solo deshabilitan los botones `Añadir a Lista` e `Invertir` según `disponibleParaPatrocinio` y `miembrosDisponibles`.

Siguientes pasos que puedo ejecutar ahora (elige lo que prefieras)
- A) Actualizar `AdminReclutamientos.jsx` para usar `Authorization: Bearer <token>` en vez de `X-Is-Admin`, y agregar pantalla de login admin en frontend.
- B) Implementar formulario de Soporte (frontend + endpoint Django).
- C) Ejecutar cambios de DB (scripts SQL) para que puedas habilitar/deshabilitar proyectos por lote.
- D) Crear documentación técnica adicional o un README con instrucciones para desplegar en producción (HTTPS, Docker secrets, variables de entorno).


---
Si quieres que guarde este archivo (`AVANCE_DE_PROYECTO.md`) en otra ubicación o que lo exporte a PDF, dime y lo hago. También dime qué tarea priorizo ahora (A/B/C/D o algo diferente).