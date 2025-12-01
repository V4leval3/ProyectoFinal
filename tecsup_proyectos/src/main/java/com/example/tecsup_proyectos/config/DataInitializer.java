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
        if (proyectoRepository.count() == 0) {
            Proyecto p1 = new Proyecto();
            p1.setNombre("Control de LED con Arduino");
            p1.setDescripcionCorta("Sistema simple de control de LED RGB mediante botones y Arduino.");
            p1.setTecnologiasUsadas("Arduino, C++");
            p1.setIntegrantesDetalle("2 alumnos: Juan Perez, Maria Gomez");
            p1.setComplejidadNivel(1);
            p1.setVistasContador(120);
            p1.setDisponibleParaPatrocinio(true);
            p1.setMiembrosDisponibles(3);
            proyectoRepository.save(p1);

            Proyecto p2 = new Proyecto();
            p2.setNombre("ParkingTec: Gestor de Estacionamiento Inteligente");
            p2.setDescripcionCorta("Control de acceso y ocupación en tiempo real usando sensores y MQTT.");
            p2.setTecnologiasUsadas("Raspberry Pi, MQTT, Node.js");
            p2.setIntegrantesDetalle("3 alumnos: Luis A., Carla R., Diego S.");
            p2.setComplejidadNivel(2);
            p2.setVistasContador(230);
            proyectoRepository.save(p2);

            Proyecto p3 = new Proyecto();
            p3.setNombre("Campus Virtual 3D: Tecsup XR");
            p3.setDescripcionCorta("Modelo inmersivo del campus de Tecsup utilizando VR para visitas guiadas.");
            p3.setTecnologiasUsadas("Unity, Blender, WebXR");
            p3.setIntegrantesDetalle("4 alumnos: Ana, Pedro, Jose, Lucia");
            p3.setComplejidadNivel(3);
            p3.setVistasContador(540);
            proyectoRepository.save(p3);
        }
    }
}
