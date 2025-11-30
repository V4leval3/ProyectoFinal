package com.example.tecsup_proyectos.repository;

import com.example.tecsup_proyectos.model.ListaInteres;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ListaInteresRepository extends JpaRepository<ListaInteres, Long> {
    // Buscar todos los elementos de la lista de un usuario
    List<ListaInteres> findByUsuarioId(Long usuarioId);
    
    // Para evitar que el mismo proyecto se añada dos veces a la lista del mismo usuario
    Optional<ListaInteres> findByUsuarioIdAndProyectoId(Long usuarioId, Long proyectoId);
}