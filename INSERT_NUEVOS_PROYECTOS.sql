-- Insertar ParkingTec: Gestor de Estacionamiento Inteligente
INSERT INTO proyecto (nombre, descripcionCorta, tecnologiasUsadas, integrantesDetalle, complejidadNivel, disponibleParaPatrocinio, miembrosDisponibles, vistasContador, cuentaBancaria)
VALUES (
  'ParkingTec: Gestor de Estacionamiento Inteligente',
  'Sistema de control de acceso y ocupación en tiempo real para estacionamientos usando sensores y MQTT.',
  'ESP32, Sensor Ultrasónico, Servomotor, MQTT, Node-RED, Certificados SSL',
  '[
    {"nombre": "Chávez Arianna", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4},
    {"nombre": "Velasco Valeria", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4},
    {"nombre": "Ccarita Veronica", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4},
    {"nombre": "Medina Diego", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}
  ]',
  2,
  true,
  3,
  0,
  '21598016589050'
);

-- Insertar Campus Virtual 3D: Tecsup XR
INSERT INTO proyecto (nombre, descripcionCorta, tecnologiasUsadas, integrantesDetalle, complejidadNivel, disponibleParaPatrocinio, miembrosDisponibles, vistasContador, cuentaBancaria)
VALUES (
  'Campus Virtual 3D: Tecsup XR',
  'Modelo inmersivo del campus de Tecsup utilizando realidad virtual para visitas guiadas y simulación de laboratorios.',
  'Blender, Unity, Spatial, WebXR, C#',
  '[
    {"nombre": "Chávez Arianna", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4},
    {"nombre": "Velasco Valeria", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4},
    {"nombre": "Ccarita Veronica", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4},
    {"nombre": "Medina Diego", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4},
    {"nombre": "Ojeda Kevin", "carrera": "Diseño y Desarrollo del Software", "ciclo": 4}
  ]',
  3,
  true,
  3,
  0,
  NULL
);

-- Guardar cambios
COMMIT;
