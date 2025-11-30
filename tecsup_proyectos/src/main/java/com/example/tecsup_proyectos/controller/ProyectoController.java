package com.example.tecsup_proyectos.controller;

import com.example.tecsup_proyectos.model.Proyecto;
import com.example.tecsup_proyectos.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/proyectos") // Raíz de la API
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ProyectoController {

    // Spring inyecta automáticamente el repositorio (conexión a la DB)
    @Autowired
    private ProyectoRepository proyectoRepository;

    // Endpoint: GET http://localhost:8080/api/proyectos
    @GetMapping
    public List<Proyecto> getAllProyectos() {
        // Este método trae *todos* los proyectos de la tabla Proyecto
        return proyectoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proyecto> getProyectoById(@PathVariable Long id) {
        // Usa el findById de JPA. Si lo encuentra, retorna 200 OK, si no, retorna 404 Not Found.
        return proyectoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Más tarde añadiremos aquí: /api/proyectos/{id}, /api/proyectos/filtrar, etc.

}