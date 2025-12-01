package com.example.tecsup_proyectos.model;

import jakarta.persistence.Column; 
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "proyectos")
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
    
    @Column(name = "cuenta_bancaria")
    private String cuentaBancaria;
}