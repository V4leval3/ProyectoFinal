# Verificación de la Base de Datos PostgreSQL en Docker

Esta guía te muestra cómo verificar que los proyectos se han insertado correctamente en la base de datos PostgreSQL dentro del contenedor Docker.

## Requisitos
- Docker y Docker Compose instalados y en ejecución
- La carpeta del proyecto en `C:\Users\Valeria\Desktop\Integrador`

## Pasos de Verificación

### 1. Verificar que el contenedor PostgreSQL está en ejecución

```powershell
docker-compose ps
```

Deberías ver algo como:
```
NAME                 COMMAND                  SERVICE             STATUS              PORTS
postgres_db          postgres                 db                  running (healthy)   5432/tcp
backend_springboot   java -jar app.jar        backend-java        running             8080/tcp
backend_django       python manage.py         backend-python      running             8000/tcp
frontend_vite        nginx -g 'daemon off;'   frontend            running             80/tcp→5173/tcp
```

### 2. Acceder a PostgreSQL dentro del contenedor

Usa `docker-compose exec` para abrir una sesión de `psql` dentro del contenedor:

```powershell
docker-compose exec db psql -U postgres -d integrador_db
```

**Nota:** Si se te solicita una contraseña, usa: `postgres`

### 3. Listar todas las tablas

Una vez dentro de `psql`:

```sql
\dt
```

Deberías ver algo como:
```
            List of relations
 Schema |      Name       | Type  | Owner
--------+-----------------+-------+----------
 public | auth_user       | table | postgres
 public | lista_interes   | table | postgres
 public | proyecto        | table | postgres
(3 rows)
```

### 4. Ver los proyectos insertados

```sql
SELECT id, nombre, complejidadNivel, disponibleParaPatrocinio, miembrosDisponibles FROM proyecto;
```

**Resultado esperado:** Deberías ver una lista de proyectos (por ejemplo, 11 proyectos) con sus IDs, nombres, niveles de complejidad, estado de disponibilidad y miembros disponibles para inversión.

Ejemplo de salida:
```
 id | nombre  | complejidadNivel | disponibleParaPatrocinio | miembrosDisponibles
----+---------+------------------+--------------------------+---------------------
  1 | Proyecto A | 1           | t                        | 3
  2 | Proyecto B | 2           | t                        | 3
  3 | Proyecto C | 3           | t                        | 3
...
```

### 5. Ver la tabla de lista de interés

```sql
SELECT id, usuario_id, proyecto_id FROM lista_interes;
```

Esto mostrará los elementos que los usuarios han agregado a sus listas de interés.

### 6. Ver usuarios registrados

```sql
SELECT id, username, email FROM auth_user WHERE is_active = true;
```

### 7. Salir de PostgreSQL

```sql
\q
```

## Comandos Útiles Adicionales

### Contar el número de proyectos
```sql
SELECT COUNT(*) FROM proyecto;
```

### Verificar integridad de datos de un proyecto específico
```sql
SELECT * FROM proyecto WHERE id = 1 \gx
```
(El `\gx` mostrará la salida en formato expandido para mejor legibilidad)

### Ver proyectos con disponibilidad de inversión (miembrosDisponibles > 0)
```sql
SELECT id, nombre, miembrosDisponibles FROM proyecto WHERE disponibleParaPatrocinio = true AND miembrosDisponibles > 0;
```

### Actualizar miembrosDisponibles manualmente (solo para pruebas)
```sql
UPDATE proyecto SET miembrosDisponibles = 3 WHERE id = 1;
```

### Restaurar disponibilidad a todos los proyectos (reset para pruebas)
```sql
UPDATE proyecto SET disponibleParaPatrocinio = true, miembrosDisponibles = 3;
COMMIT;
```

## Inserción Manual de Proyectos (si es necesario)

Si necesitas agregar más proyectos manualmente:

```sql
INSERT INTO proyecto (nombre, descripcionCorta, tecnologiasUsadas, integrantesDetalle, complejidadNivel, disponibleParaPatrocinio, miembrosDisponibles, vistasContador)
VALUES 
  ('Mi Proyecto 1', 'Una app de prueba', 'React, Node.js', '[]', 1, true, 3, 0),
  ('Mi Proyecto 2', 'Otra app', 'Python, Django', '[]', 2, true, 3, 0);
COMMIT;
```

## Troubleshooting

### Error: "could not translate host name "db" to address"
- Asegúrate de que `docker-compose` está ejecutándose en el directorio correcto (`C:\Users\Valeria\Desktop\Integrador`)
- Verifica que el servicio `db` está en ejecución: `docker-compose ps`

### Error: "password authentication failed for user "postgres""
- La contraseña por defecto es `postgres`
- Si la has cambiado, verifica el archivo `docker-compose.yml` bajo `POSTGRES_PASSWORD`

### No hay proyectos insertados
- Verifica que el archivo de inicialización se ejecutó correctamente
- Revisa los logs del contenedor: `docker-compose logs db`
- Inserta proyectos manualmente usando el comando SQL proporcionado arriba

## Verificar datos desde la API (alternativo)

En lugar de usar `psql`, puedes verificar los datos desde la API REST:

```powershell
# Ver todos los proyectos
Invoke-RestMethod -Method Get -Uri 'http://127.0.0.1:8080/api/proyectos' | ConvertTo-Json -Depth 5

# Ver un proyecto específico
Invoke-RestMethod -Method Get -Uri 'http://127.0.0.1:8080/api/proyectos/1' | ConvertTo-Json -Depth 5
```

## Hacer backup de la BD (opcional)

Para hacer un backup de los datos:

```powershell
docker-compose exec db pg_dump -U postgres integrador_db > backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql
```

Esto creará un archivo SQL con todos los datos que puedes restaurar más tarde.
