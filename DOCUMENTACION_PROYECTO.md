# Documentación del Proyecto - Tecsup Showcase

Fecha: 2025-11-30

Este documento explica la arquitectura, la base de datos, el flujo de tickets, qué ver en Docker, pasos para pruebas y cómo funciona internamente el frontend y backend.

**1. Resumen de la arquitectura**
- Microservicios: `backend-java` (Spring Boot), `backend-python` (Django + DRF), `frontend` (React + Vite), `postgres_db` (Postgres).
- Orquestación por `docker-compose.yml` (levanta los 4 contenedores y una red interna). El frontend está empacado por Vite y servido por `nginx` dentro del contenedor `frontend`.
- Reverse proxy: `nginx` en el contenedor `frontend` proxifica las rutas `/api/*` a los backends correspondientes (Spring Boot y Django).

**2. Base de datos (PostgreSQL)**
- Nombre del servicio en `docker-compose`: `postgres_db`.
- Credenciales y DB definidas en `docker-compose.yml` (por ahora en variables de entorno, revisa el archivo para valores exactos).
- Estructura relevante (resumen conceptual):
  - Tabla `proyecto` (en el esquema usado por Spring Boot JPA): campos típicos: `id`, `titulo`, `descripcion`, `autor_nombre`, `carrera`, `ciclo`, `estado` (DISPONIBLE, INVERSION_ACTIVA, COMPLETADO), `stock` o `max_participantes`, `vistasContador`, `complejidad`, `precio_referencia`, `fecha_creacion`, etc.
  - Tablas de usuarios (Django) usadas para autenticación/tickets: `auth_user` (Django default) y `soporte_ticket` (modelo Ticket con `usuario_id`, `asunto`, `mensaje`, `estado`, `fecha_creacion`).
  - Tabla `lista_interes` o `cart` (Spring Boot): relaciona `user_id` con `proyecto_id` y cantidad o metadata; regla de negocio: máximo 3 proyectos por usuario.

2.1. ¿Cómo gestionar proyectos (cambiar estado) desde la base de datos?
- Opción recomendada (producción / segura): usar endpoints del backend Java para cambiar estado (p. ej. admin endpoints protegidos por JWT). Evitar modificar directamente la DB si no sabes qué triggers/consistencias hay.
- Si necesitas hacer una prueba rápida o forzar un cambio manualmente:
  1. Conéctate al contenedor Postgres desde tu host:
     - PowerShell ejemplo: `docker exec -it postgres_db psql -U postgres -d proyectos_tecsup`
  2. Listar proyectos: `SELECT id, titulo, estado FROM proyecto ORDER BY id LIMIT 50;`
  3. Actualizar estado: `UPDATE proyecto SET estado='DISPONIBLE' WHERE id=5;` (usa el `id` correcto).
  4. Si hay reglas en la capa aplicación, recuerda que cambiar DB a mano puede dejar inconsistencia: p. ej. si pasas a `COMPLETADO` debes también actualizar stock/counters.

- Recomendación: añade endpoints administrativos (Spring Boot) para cambiar estado y que ejecuten la lógica de negocio (transaccional, anotado `@Transactional`).

**3. Tickets (Soporte)**
3.1. Cómo funcionan conceptualmente:
- El módulo `soporte` está implementado en Django (DRF).
- El modelo `Ticket` contiene referencia al usuario (Django `User`), `asunto`, `mensaje`, `estado` (abierto, en_progreso, cerrado), y fecha de creación.
- Endpoints principales (explicación):
  - `POST /api/tickets/` — crear nuevo ticket (requiere token JWT de Django, el backend Django obtiene `request.user` y lo asigna al ticket).
  - `GET /api/tickets/` — listar tickets del usuario autenticado (permite seguimiento); administradores pueden listar todos.
  - `PATCH /api/tickets/{id}/` — actualizar estado o agregar respuesta (permite al equipo de soporte responder o cerrar tickets).

3.2. Cómo hacer pruebas de tickets:
- En frontend `Soporte` se agregó una página que usa el endpoint `/api/tickets/` (proxy a Django).
- Flujo de prueba:
  1. Regístrate o usa una cuenta existente en Django (frontend no siempre expone la UI de registro; si necesitas, usa `/api/token/` o crea usuario en DB).
  2. Obtener token JWT de Django: `POST /api/token/` con `{username, password}` → `access` token.
  3. En frontend, ve a `/soporte`, pega token (el frontend debería pedir login si no existe) y crea un ticket.
  4. Verifica en DB o con `GET /api/tickets/` que el ticket aparece.
  5. Como admin (Django staff) puedes cambiar estado con `PATCH`.

**4. ¿Qué puedo ver en Docker?**
- Comandos útiles:
  - `docker-compose ps` — lista los contenedores levantados y sus puertos.
  - `docker logs frontend_vite` — ver los logs nginx / build (útil para errores de carga estática).
  - `docker logs backend_springboot` — ver arranque de Spring Boot y errores de runtime.
  - `docker logs backend_django` — ver arranque Django y errores.
  - `docker exec -it postgres_db psql -U postgres -d proyectos_tecsup` — abrir consola psql para inspección directa.
  - `docker inspect <container>` — ver redes, IPs, montajes.
- Qué chequear:
  - Que `frontend` sirva la aplicación en `0.0.0.0:5173` (o el puerto mapeado en `docker-compose`).
  - Que `backend-java` esté escuchando en `:8080` y responde `/actuator/health` o `/api/proyectos`.
  - Que `backend-python` esté en `:8000` y responde `/api/token/`.
  - Que `postgres_db` esté `healthy` o al menos `running`.

**5. Pruebas paso a paso (manuales) — checklist**
Pre-requisitos: Docker corriendo y el `docker-compose up -d --build` ejecutado.

5.1. Verificar servicios corriendo
- `docker-compose ps` → confirmar 4 contenedores `Up`.

5.2. Frontend carga y layout
- Abrir `http://127.0.0.1:5173/` en navegador.
- Verificar header, barra de búsqueda y que el contenido ocupa todo el ancho (no caja centrada). Si usas móvil o herramientas dev-tools, verifica en 320px y 768px.

5.3. Obtener lista de proyectos
- `GET http://127.0.0.1:5173/api/proyectos` → debe devolver JSON.
- Si JSON OK, frontend debería mostrar cards.

5.4. Ver detalle del proyecto
- Click `Ver Detalles` en un proyecto → se abre `/proyecto/:id`.
- Verificar que nombre de estudiante, carrera, ciclo, descripción, y estado aparezcan.
- Probar que si proyecto `COMPLETADO`, aún se vea el detalle pero con botón de invertir deshabilitado.

5.5. Lista de interés (carrito)
- Agregar proyecto a Lista de Interés (restricción máxima 3): prueba agregando 4 proyectos con la misma cuenta y comprobar que rechaza el cuarto.

5.6. Checkout — Donación (mock)
- Ir a Checkout desde Lista de Interés y elegir Donar.
- Modal con tarjeta mock/QR debe mostrar y crear `PaymentIntent` simulada vía `POST /api/checkout/create-payment-intent` (Spring Boot).
- Verificar que respuesta incluye `clientSecret`.

5.7. Checkout — Invertir (contacto)
- Elegir opción Invertir, llenar RUC y presionar → se debe generar enlace a WhatsApp (link con número fijo más mensaje) o mostrar confirmación.

5.8. Tickets (Soporte)
- Autenticar en Django para obtener token:
  - `POST http://127.0.0.1:8000/api/token/` con `{username,password}` → `access` token.
- En frontend Soporte: crear ticket y validar que aparece en la lista.

5.9. Admin — Reclutamientos
- `POST http://127.0.0.1:5173/api/auth/login` (proxy) con credenciales admin (por defecto `admin`/`admin` en el endpoint que implementamos) → recibir JWT.
- `GET http://127.0.0.1:5173/api/checkout/reclutamientos` con `Authorization: Bearer <token>` → debe devolver lista.

**6. Cómo funciona TODO internamente (resumen técnico)**
6.1. Frontend (React + Vite)
- Codebase: `frontend/src`.
- Componentes principales:
  - `App.jsx` — rutas y layout.
  - `pages/Home.jsx` — listado de proyectos, buscador y filtros.
  - `pages/ProyectoDetallePage.jsx` — detalle del proyecto.
  - `components/*` — cards, navbar, modales de checkout.
  - `pages/Soporte.jsx` — formulario y lista de tickets (consume Django via `/api/tickets`).
- Comunicación con backend: todas las llamadas a APIs usan rutas relativas `/api/...` que son proxificadas por `nginx` del contenedor `frontend` a los servicios correctos.
- Estado de sesión: algunas partes guardan `localStorage.admin_jwt` para administrar token de admin; usuarios normales usan tokens de Django para tickets.
- UI: CSS principal está en `src/assets/style.css` junto con `App.css` e `index.css`. Se aplicó un parche para que la página ocupe todo el ancho y sea responsive.

6.2. Backend Java (Spring Boot)
- Ubicación: `tecsup_proyectos/src/main/java/...`.
- Responsabilidades:
  - Lógica principal del Showcase (proyectos, lista de interés, checkout mock, control de estados y reglas de negocio).
  - Stripe: endpoint `POST /api/checkout/create-payment-intent` que crea un `PaymentIntent` con la `STRIPE_SECRET_KEY` (en dev se usa test key en `docker-compose.yml`).
  - Seguridad admin: implementado con JWT sencillo (JwtUtil + JwtAuthenticationFilter + SecurityConfig). Admins obtienen token vía `/api/auth/login`.
  - Persistencia: Spring Data JPA hacia Postgres.
- Transaccionalidad: las operaciones críticas deben usar `@Transactional` para garantizar integridad.

6.3. Backend Python (Django)
- Ubicación: `empresariales/soporte` (o `soporte/` en el repo).
- Responsabilidades:
  - Autenticación JWT (Simple JWT) para usuarios y sesiones.
  - Tickets: modelo `Ticket` y DRF `ViewSet` para CRUD.

**7. Checklist vs requisitos originales (estado actual y faltantes)**
- Implementado / Verificado:
  - Microservicios y orquestación Docker ✅ (4 contenedores funcionando)
  - Reverse-proxy `/api/*` desde nginx ✅
  - Frontend React + Vite ✅ (se corrigió layout para full-width)
  - Backend Spring Boot con endpoints de proyectos y checkout mock ✅
  - Stripe test flow (create-payment-intent) ✅ (test key)
  - Django tickets endpoint y frontend Soporte creado ✅
  - JWT admin básico en Spring Boot (AuthController + filter) ✅
  - Reglas básicas: proyecto muestra detalle aun si `COMPLETADO` (visual) ✅

- Parcial o pendiente:
  - Integración completa de JWT de Django en frontend para login/registro usuario — frontend tiene soporte básico, pero validar flujo de registro/obtención de token es necesario. (Pendiente de pruebas E2E)
  - Consolidar gestión de tokens (mover admin_jwt al `AuthContext`) — mejora UX/seguridad (pendiente)
  - Persistencia de usuarios admin (actualmente in-memory demo) — necesario para producción
  - Harden secrets: `STRIPE_SECRET_KEY`, `JWT_SECRET` están en `docker-compose.yml` (pendiente mover a Docker secrets)
  - Tests automáticos / unitarios faltan o no integrados (recomendado para robustez)
  - Material UI (MUI) requerido en prompt: la UI actual usa un template CSS pero no está migrada a MUI (si el requisito exige MUI, falta implementar).
  - Validaciones y transaccionalidad: revisar que todos los endpoints críticos tengan validaciones y `@Transactional` apropiadamente.

**8. Riesgos y recomendaciones rápidas antes de entrega**
- R1: Secrets in repo (`docker-compose.yml`) — mover a variables de entorno fuera del repo o Docker secrets.
- R2: Admin in-memory — crear tabla de admin/roles o usar Django admin; documentar credenciales.
- R3: UI MUI requirement — si la evaluación exige MUI, priorizar adaptar key screens (Home, ProyectoDetalle, Checkout, Soporte) — esto puede llevar 6–12 horas dependiendo del alcance.
- R4: Tests y QA — dedicar tiempo a test manual y a arreglar visuales en móviles.

**9. Guía de verificación rápida (pasos mínimos para entrega)**
1. Rebuild completo: `docker-compose up -d --build`.
2. Abrir `http://127.0.0.1:5173/` y recorrer: Home → Detalle → Agregar a Lista → Checkout (Donar) → confirmar `clientSecret` recibido.
3. Soporte: autenticar en Django y crear ticket; verificar en DB o `GET /api/tickets/`.
4. Admin: `POST /api/auth/login` (proxy) → obtener token → `GET /api/checkout/reclutamientos`.
5. Probar cambiar estado de un proyecto mediante endpoint admin o con SQL en Postgres (ver sección 2.1).

**10. Estimación para completar faltantes (24 horas?)**
- Si el requisito de MUI es flexible: es viable terminar los puntos críticos (UI responsive polish, tests manuales, token consolidation, secrets checklist) dentro de 24 horas si dedicaste ya buen avance. Necesitarás priorizar:
  - Crítico (0–6h): pulir responsive, terminar pruebas manuales (checkout, tickets, admin), asegurar no build errors.
  - Medio (6–14h): consolidar tokens en `AuthContext`, fix endpoints pendientes, add transactional annotations.
  - Opcional/Extras (14–24h): migrate styles to MUI, add unit tests, move secrets to Docker secrets.
- Con 30 horas es cómodo; con 24 horas es factible si priorizas y evitas migrating-to-MUI full refactor.

---
Si quieres, ahora hago cualquiera de estas acciones concretas (elige):
- Ejecutar pruebas E2E manuales y reportar resultados y fallos encontrados.
- Integrar admin_jwt en `AuthContext` y refactor components to use it.
- Move secrets into Docker environment variables managed outside the repo (prepare `env.example` and docs).
- Convert key pages to MUI templates (I can start with `Home` and `ProyectoDetalle`).

Dime cuál prefieres y sigo con los siguientes pasos.