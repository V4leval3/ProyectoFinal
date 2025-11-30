package com.example.tecsup_proyectos.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ListaInteres {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ID del usuario de Django (temporalmente asumimos que es 1 o 2 para pruebas)
    private Long usuarioId; 
    
    // Relación: Un elemento de lista apunta a un Proyecto
    @ManyToOne 
    @JoinColumn(name = "proyecto_id")
    private Proyecto proyecto;

    private Integer cantidad = 1; // Mantenemos "cantidad" para simular un ítem de carrito
    private java.time.LocalDateTime fechaAdicion = java.time.LocalDateTime.now();
}