# Pruebas End-to-End (E2E) - Guía Completa

Esta guía te ayuda a ejecutar pruebas manuales completas del sistema para verificar que todas las funcionalidades funcionan correctamente.

## Requisitos Previos
- Docker Compose levantado y funcionando: `docker-compose up -d`
- Navegador web (Chrome, Firefox, Safari, Edge)
- Acceso a http://127.0.0.1:5173 para el frontend

## Flujo E2E Completo

### **Paso 1: Registro de Usuario**

1. Abre http://127.0.0.1:5173 en tu navegador
2. Haz clic en **"Registrarse"** (esquina superior derecha o menú)
3. Rellena el formulario con datos de prueba:
   - **Username:** `testuser_$(random)`  (ej: `testuser_12345`)
   - **Email:** `test@example.com`
   - **Password:** `password123`
   - **Password (confirm):** `password123`
4. Haz clic en **"Crear cuenta"**
5. **Esperado:** Redirección a login y mensaje de éxito

### **Paso 2: Iniciar Sesión**

1. Completa el formulario de login:
   - **Username:** El que creaste en Paso 1
   - **Password:** `password123`
2. Haz clic en **"Iniciar Sesión"**
3. **Esperado:** Redirección a la página principal (Home) y se mostrará tu nombre de usuario en la esquina superior

### **Paso 3: Prueba de Búsqueda en Tiempo Real**

1. En la página **Home**, verás un campo de búsqueda con el título "Buscar proyectos"
2. Escribe en el campo (ej: "React", "Python", "API") sin presionar botones
3. **Esperado:** Los proyectos se filtrarán automáticamente mientras escribes (sin presionar Enter)
4. La búsqueda es debounced (espera ~350ms después de escribir)
5. Prueba varios términos de búsqueda

### **Paso 4: Prueba de Filtro por Complejidad**

1. En la página Home, verás un desplegable "Filtrar por complejidad"
2. Selecciona cada opción:
   - **Todas las complejidades** (por defecto)
   - **Básica** (solo proyectos nivel 1)
   - **Intermedia** (solo proyectos nivel 2)
   - **Avanzada** (solo proyectos nivel 3)
3. **Esperado:** La lista de proyectos se filtra en tiempo real según la complejidad seleccionada
4. **Nota:** NO debe haber una opción "Muy Avanzada"

### **Paso 5: Ver Detalles de un Proyecto**

1. En la página Home, haz clic en cualquier tarjeta de proyecto (o en "Ver Detalles")
2. Verás la página de detalles con:
   - Nombre y descripción del proyecto
   - Equipo de desarrollo (integrantes)
   - Información clave (disponibilidad, miembros disponibles para invertir, popularidad, complejidad, tecnologías)
3. **Esperado:** La página carga correctamente y muestra toda la información

### **Paso 6: Prueba de Botón Donar**

1. En la página de detalles del proyecto, haz clic en **"💝 Hacer una Donación"**
2. Se abrirá un modal con el formulario de donación:
   - **Monto a Donar (S/.)**  — ingresa `100`
   - **Método de Pago** — selecciona "💳 Tarjeta de Crédito/Débito" o "📱 Yape (QR)"
3. Haz clic en **"✅ Confirmar Donación"**
4. **Esperado:** 
   - Mensaje de éxito: "Donación registrada (simulada)..."
   - Modal se cierra automáticamente después de 2 segundos
   - **Nota:** Por ahora es simulada. Para producción, necesitas proporcionar credenciales de Stripe/Yape

### **Paso 7: Prueba de Botón Invertir**

1. En la página de detalles del proyecto, haz clic en **"💼 Invertir en este Proyecto"**
2. Se abrirá un modal con el formulario de inversión:
   - **Nombre Completo:** `Juan Inversor`
   - **Correo Electrónico:** `juan@example.com`
   - **Teléfono (con código país):** `+51987654321`
   - **Monto dispuesto a Invertir:** `Entre $1000 - $3000`
   - **Experiencia en Inversión:** `Intermedio`
   - **¿Por qué te interesa este proyecto?:** `Tengo interés en apoyo este proyecto`
3. Haz clic en **"Solicitar Información para Invertir por WhatsApp"**
4. **Esperado:** 
   - Se genera un enlace de WhatsApp
   - Aparece un botón verde **"📱 Abrir WhatsApp"**
   - Haz clic en él (se abrirá en una nueva pestaña con `noopener`)
   - El mensaje contiene todos los datos del inversor

### **Paso 8: Verificar Decremento de Stock (miembrosDisponibles)**

1. En **PowerShell**, obtén el proyecto antes de invertir:
```powershell
Invoke-RestMethod -Method Get -Uri 'http://127.0.0.1:8080/api/proyectos/1' | Select-Object miembrosDisponibles
```
2. Anota el número (debe ser 3 si no has hecho inversiones)
3. Ejecuta el paso 7 nuevamente para hacer una inversión
4. Vuelve a ejecutar el comando anterior:
```powershell
Invoke-RestMethod -Method Get -Uri 'http://127.0.0.1:8080/api/proyectos/1' | Select-Object miembrosDisponibles
```
5. **Esperado:** El número debería haber disminuido en 1 (de 3 → 2)
6. Repite 2 veces más para llegar a 0
7. **Esperado:** Cuando llega a 0, el botón "Invertir" debe estar deshabilitado

### **Paso 9: Agregar Proyecto a Lista de Interés**

1. En la página de detalles del proyecto, haz clic en **"➕ Añadir a Lista de Interés"**
2. **Esperado:** Mensaje de éxito: "Proyecto añadido a tu Lista de Interés..."
3. Intenta agregar el mismo proyecto de nuevo
4. **Esperado:** Mensaje de error: "Este proyecto ya se encuentra en tu Lista de Interés"
5. Agrega 2-3 proyectos más (máximo 3 permitidos por usuario)
6. Intenta agregar un 4to proyecto
7. **Esperado:** Mensaje de error: "Límite de proyectos alcanzado. Solo se permiten 3 en la lista."

### **Paso 10: Acceder a la Lista de Interés**

1. Desde cualquier página, haz clic en **"🛒 Mi Lista de Interés"** (navegación)
2. Verás una tabla con los proyectos agregados:
   - **Columnas:** ID, Proyecto, Complejidad, Tecnologías, **Acciones**
   - **Acciones:** Quitar, Invertir, Enviar petición de contacto
3. **Esperado:** Se muestran los 3 proyectos agregados en el paso anterior

### **Paso 11: Prueba del Botón "Quitar"**

1. En la Lista de Interés, haz clic en **"Quitar"** en la última fila
2. **Esperado:** El proyecto se elimina de la lista inmediatamente
3. Verifica que ahora solo quedan 2 proyectos

### **Paso 12: Prueba del Botón "Enviar petición de contacto"**

1. En la Lista de Interés, haz clic en **"Enviar petición de contacto"** en una de las filas
2. **Esperado:** Mensaje de éxito: "Petición de contacto enviada"
3. **Importante:** Verifica que el stock/disponibilidad del proyecto **NO cambió** (miembrosDisponibles debe seguir igual)

Ejecuta esto en PowerShell para verificar:
```powershell
Invoke-RestMethod -Method Get -Uri 'http://127.0.0.1:8080/api/proyectos/1' | Select-Object disponibleParaPatrocinio, miembrosDisponibles
```
**Esperado:** `disponibleParaPatrocinio = true` y `miembrosDisponibles` sigue siendo el mismo número

### **Paso 13: Prueba de Inversión desde Lista de Interés**

1. En la Lista de Interés, haz clic en **"Invertir"** en una de las filas
2. Se abrirá el modal de inversión (mismo que en Paso 7)
3. Completa el formulario y genera el enlace WhatsApp
4. Verifica que `miembrosDisponibles` decrementó nuevamente

### **Paso 14: Cerrar Sesión**

1. Haz clic en tu nombre de usuario (esquina superior derecha)
2. Selecciona **"Cerrar Sesión"**
3. **Esperado:** Redirección a la página de login, desaparece tu nombre de usuario

### **Paso 15: Prueba de Acceso Restringido**

1. Sin estar logueado, intenta acceder directamente a:
   - http://127.0.0.1:5173/lista-interes
   - http://127.0.0.1:5173/proyecto/1
2. **Esperado:** Se mostrará un mensaje de alerta pidiendo que inicies sesión

## Verificación de Errores Comunes

### Error: "Proyecto no disponible para inversión"
- **Causa:** El proyecto ya alcanzó el límite de 3 inversiones (miembrosDisponibles = 0)
- **Solución:** Usa otro proyecto o reinicia la BD

### Error: "Límite de proyectos alcanzado"
- **Causa:** Ya agregaste 3 proyectos a la lista de interés
- **Solución:** Quita uno usando el botón "Quitar"

### No se ve el campo de búsqueda en Home
- **Causa:** El frontend no se reconstruyó correctamente
- **Solución:** Ejecuta `docker-compose up -d --build frontend`

### No aparece el modal de inversión
- **Causa:** El componente `CheckoutInvestModal` no está importado
- **Solución:** Verifica que `ProyectoDetallePage.jsx` importa `CheckoutInvestModal`

### WhatsApp no abre en nueva pestaña
- **Causa:** El navegador bloqueó la ventana emergente
- **Solución:** Comprueba los permisos de popups en tu navegador

## Resumen de Cambios Implementados

✅ Backend:
- Lista de interés limitada a **3 proyectos** por usuario
- Endpoint `/api/checkout/invertir` decrementa `miembrosDisponibles` (máx 3 inversiones)
- Endpoint `/api/lista-interes/checkout/{usuarioId}` NO modifica stock
- WhatsApp: **+51 941360439**

✅ Frontend:
- Búsqueda **debounced en tiempo real** (350ms)
- Filtro por complejidad: **Básica, Intermedia, Avanzada** (sin "Muy Avanzada")
- Modal de donación en **detalle de proyecto**
- Modal de inversión con formulario completo
- Botón **"Quitar"** en lista de interés
- Botones **"Invertir"** y **"Enviar petición de contacto"** en lista de interés
- WhatsApp se abre en **nueva pestaña** con `noopener`

## Pruebas de Carga / Stress (Opcional)

Si deseas probar el sistema bajo carga:

```powershell
# Ejemplo: Agregar 100 veces el mismo proyecto (esperar error en la 4ta vez)
for ($i = 1; $i -le 100; $i++) {
  Write-Host "Intento $i"
  Invoke-RestMethod -Method Post -Uri 'http://127.0.0.1:8080/api/lista-interes/add/1/1' -ErrorAction SilentlyContinue
  Start-Sleep -Milliseconds 100
}
```

## Conclusión

Si todos los pasos se ejecutan correctamente, el sistema está listo para producción. Si encuentras problemas, revisa los logs:

```powershell
docker-compose logs backend-java
docker-compose logs backend-python
docker-compose logs frontend
```
