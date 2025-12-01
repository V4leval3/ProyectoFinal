package com.example.tecsup_proyectos.config;

import com.example.tecsup_proyectos.model.Proyecto;
import com.example.tecsup_proyectos.repository.ProyectoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProyectoRepository proyectoRepository;

    public DataInitializer(ProyectoRepository proyectoRepository) {
        this.proyectoRepository = proyectoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only seed if DB is completely empty AND no SQL files were run.
        // If you want to restore full data, run RESTORE_FULL_DB.sql manually or via pgAdmin.
        // This prevents overwriting with dummy data.
        long count = proyectoRepository.count();
        
        if (count == 0) {
            // DB is empty: seed one minimal project as fallback, but user should restore full data
            Proyecto p1 = new Proyecto();
            p1.setNombre("Proyecto de Ejemplo (Restaurar datos completos vía SQL)");
            p1.setDescripcionCorta("DB vacía detectada. Ejecuta RESTORE_FULL_DB.sql en pgAdmin para cargar todos los proyectos.");
            p1.setTecnologiasUsadas("Arduino, C++");
            p1.setIntegrantesDetalle("[{\"nombre\": \"Sistema\", \"carrera\": \"Inicialización\", \"ciclo\": 0}]");
            p1.setComplejidadNivel(1);
            p1.setVistasContador(0);
            p1.setDisponibleParaPatrocinio(true);
            p1.setMiembrosDisponibles(3);
            proyectoRepository.save(p1);
            System.out.println("[DataInitializer] DB was empty. Created 1 minimal placeholder project. RUN RESTORE_FULL_DB.sql to load all 15+ projects.");
        } else {
            System.out.println("[DataInitializer] DB already has " + count + " projects. Skipping seeding.");
        }
    }
}
