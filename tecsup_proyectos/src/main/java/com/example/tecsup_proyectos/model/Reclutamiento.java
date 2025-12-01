package com.example.tecsup_proyectos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Reclutamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String empresa;
    private String email;
    private String telefono;
    private String industria;

    @Column(columnDefinition = "TEXT")
    private String perfiles;

    private String estado = "PENDIENTE";

    private LocalDateTime creadoEn = LocalDateTime.now();

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getIndustria() { return industria; }
    public void setIndustria(String industria) { this.industria = industria; }
    public String getPerfiles() { return perfiles; }
    public void setPerfiles(String perfiles) { this.perfiles = perfiles; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
}
