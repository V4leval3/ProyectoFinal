-- Actualizar Campus XR con cuenta bancaria
UPDATE proyecto SET cuenta_bancaria = '4214100327895365' WHERE nombre = 'Campus Virtual 3D: Tecsup XR';

-- Insertar AlphaKids: Plataforma interactiva para aprendizaje temprano
INSERT INTO proyecto (nombre, descripcion_corta, tecnologias_usadas, integrantes_detalle, complejidad_nivel, disponible_para_patrocinio, miembros_disponibles, vistas_contador, cuenta_bancaria)
VALUES (
  'AlphaKids: Plataforma interactiva para aprendizaje temprano',
  'Aplicación móvil educativa orientada a niños de educación inicial, diseñada para reforzar conceptos básicos mediante actividades interactivas, almacenamiento en la nube y seguimiento docente.',
  'Android Studio, Firebase (Authentication, Firestore, Storage, etc)',
  '[{"nombre": "Llanos Garcia, Diego Raúl", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}, {"nombre": "Rojas Juño, Guiller Breyneer", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}, {"nombre": "Sullca Huamán, Junior Benjamin", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}, {"nombre": "Zinanyuca Calcina, Gerald Brand", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}]',
  2,
  true,
  3,
  0,
  NULL
);

-- Insertar AirGuardNet: Sistema Wearable IoT para Monitoreo de Polvo Respirable en Minería
INSERT INTO proyecto (nombre, descripcion_corta, tecnologias_usadas, integrantes_detalle, complejidad_nivel, disponible_para_patrocinio, miembros_disponibles, vistas_contador, cuenta_bancaria)
VALUES (
  'AirGuardNet: Sistema Wearable IoT para Monitoreo de Polvo Respirable en Minería',
  'Dispositivo portátil inteligente que mide PM2.5 y PM10 en tiempo real, enviando alertas a un dashboard web para prevenir enfermedades pulmonares en trabajadores mineros.',
  'ESP32, Sensor óptico PMS5003, LEDs de alerta, Buzzer, Next.js, Django, Neon (PostgreSQL)',
  '[{"nombre": "Alca Peralta Antony Andrew", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}, {"nombre": "Sapacayo Mamani Yordan Romel", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}, {"nombre": "Velasco Sencia Valeria Angela", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}, {"nombre": "Vilca Caza Jorge Thomas", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}]',
  2,
  true,
  3,
  0,
  NULL
);
