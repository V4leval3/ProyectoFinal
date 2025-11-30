package com.example.tecsup_proyectos.repository;

import com.example.tecsup_proyectos.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    // Spring Data JPA hace todo el trabajo por ti
}