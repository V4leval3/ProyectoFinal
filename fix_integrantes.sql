-- Convertir datos antiguos a JSON format
UPDATE proyecto SET integrantes_detalle = '[{"nombre": "Ana Perez", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}, {"nombre": "Luis Gomez", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}]' WHERE id = 1;

UPDATE proyecto SET integrantes_detalle = '[{"nombre": "Carlos Ruiz", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}]' WHERE id = 2;

UPDATE proyecto SET integrantes_detalle = '[{"nombre": "María Soto", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}]' WHERE id = 3;
