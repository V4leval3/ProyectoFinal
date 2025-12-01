-- GUÍA PARA HABILITAR PROYECTOS NO DISPONIBLES
-- Ejecuta cualquiera de estos comandos según necesites:

-- Opción 1: Habilitar TODOS los proyectos
UPDATE proyecto SET disponible_para_patrocinio = true, miembros_disponibles = 3 WHERE disponible_para_patrocinio = false;

-- Opción 2: Habilitar proyecto específico por ID
-- Reemplaza {ID} con el número del proyecto (ej: 1, 2, 3, etc.)
-- UPDATE proyecto SET disponible_para_patrocinio = true, miembros_disponibles = 3 WHERE id = {ID};

-- Opción 3: Habilitar proyecto específico por nombre
-- Reemplaza {NOMBRE} con el nombre exacto del proyecto
-- UPDATE proyecto SET disponible_para_patrocinio = true, miembros_disponibles = 3 WHERE nombre = '{NOMBRE}';

-- Ejemplo: Habilitar Proyecto A
-- UPDATE proyecto SET disponible_para_patrocinio = true, miembros_disponibles = 3 WHERE nombre = 'Proyecto A';

-- Ver todos los proyectos y su estado
SELECT id, nombre, disponible_para_patrocinio, miembros_disponibles FROM proyecto ORDER BY id;
