package com.example.tecsup_proyectos.model;

import jakarta.persistence.Column; 
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data 
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre; 
    private String descripcionCorta;
    private String tecnologiasUsadas; 

    @Column(name = "integrantes_detalle", columnDefinition = "TEXT")
    private String integrantesDetalle;

    private Integer complejidadNivel; 
    private Integer vistasContador = 0; 
    private boolean disponibleParaPatrocinio = true; 

    private Integer miembrosDisponibles = 3; 
}