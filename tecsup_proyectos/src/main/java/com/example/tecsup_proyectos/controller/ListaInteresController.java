package com.example.tecsup_proyectos.controller;

import com.example.tecsup_proyectos.model.ListaInteres;
import com.example.tecsup_proyectos.repository.ListaInteresRepository;
import com.example.tecsup_proyectos.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
@RestController
@RequestMapping("/api/lista-interes")
// Usamos @Transactional a nivel de clase para asegurar que todas las operaciones de la DB 
// (añadir, simular contacto, remover) se realicen correctamente o se reviertan.
@Transactional
public class ListaInteresController {

    @Autowired
    private ListaInteresRepository listaInteresRepository;
    @Autowired
    private ProyectoRepository proyectoRepository;

    private static final int LIMITE_PROYECTOS = 5;

    // 1. Obtener la lista del usuario (GET)
    // GET http://localhost:8080/api/lista-interes/1
    @GetMapping("/{usuarioId}")
    public List<ListaInteres> getListaInteres(@PathVariable Long usuarioId) {
        return listaInteresRepository.findByUsuarioId(usuarioId);
    }

    // 2. Añadir un proyecto a la lista (POST)
    // POST http://localhost:8080/api/lista-interes/add/1/3
    @PostMapping("/add/{usuarioId}/{proyectoId}")
    public ResponseEntity<?> agregarALista(
            @PathVariable Long usuarioId,
            @PathVariable Long proyectoId) {

        // --- Validación 1: Verificar el Límite ---
        if (listaInteresRepository.findByUsuarioId(usuarioId).size() >= LIMITE_PROYECTOS) {
            return new ResponseEntity<>("Límite de proyectos alcanzado. Solo se permiten " + LIMITE_PROYECTOS + " en la lista.", HttpStatus.BAD_REQUEST);
        }

        // --- Validación 2: Verificar Stock ---
        boolean disponible = proyectoRepository.findById(proyectoId)
                .map(p -> p.isDisponibleParaPatrocinio())
                .orElse(false);

        if (!disponible) {
            return new ResponseEntity<>("El proyecto no está disponible para patrocinio (Stock agotado).", HttpStatus.BAD_REQUEST);
        }

        // --- Validación 3: Ya existe en la lista ---
        if (listaInteresRepository.findByUsuarioIdAndProyectoId(usuarioId, proyectoId).isPresent()) {
            return new ResponseEntity<>("Este proyecto ya se encuentra en tu Lista de Interés.", HttpStatus.BAD_REQUEST);
        }

        // Creación y Guardado
        ListaInteres nuevoItem = new ListaInteres();
        nuevoItem.setUsuarioId(usuarioId);

        proyectoRepository.findById(proyectoId).ifPresent(nuevoItem::setProyecto);

        listaInteresRepository.save(nuevoItem);
        return new ResponseEntity<>(nuevoItem, HttpStatus.CREATED);
    }
    
    // 🚨 3. Simulación de Compra / Petición de Contacto Formal (CHECKOUT)
    // POST http://localhost:8080/api/lista-interes/checkout/1
    @PostMapping("/checkout/{usuarioId}")
    public ResponseEntity<?> simularContacto(@PathVariable Long usuarioId) {

        List<ListaInteres> lista = listaInteresRepository.findByUsuarioId(usuarioId);

        if (lista.isEmpty()) {
            return new ResponseEntity<>("La lista de interés está vacía. No hay proyectos para contactar.", HttpStatus.BAD_REQUEST);
        }

        // 1. Lógica de Reducción de Stock (Inventario): Poner proyectos como NO disponibles
        for (ListaInteres item : lista) {
            // Se asume que al hacer checkout, el proyecto es 'adquirido' o 'reservado'
            item.getProyecto().setDisponibleParaPatrocinio(false); // Stock se reduce
            proyectoRepository.save(item.getProyecto());
        }

        // 2. Vaciar la Lista de Interés (Carrito vacío)
        listaInteresRepository.deleteAll(lista);

        return new ResponseEntity<>("Petición de contacto enviada con éxito. Los proyectos han sido reservados y tu lista ha sido vaciada.", HttpStatus.OK);
    }

    // 4. Opcional: Añadir un DELETE para remover items de la lista (Lógica de Carrito)
    // DELETE http://localhost:8080/api/lista-interes/remove/itemId
    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Void> removerDeLista(@PathVariable Long itemId) {
        listaInteresRepository.deleteById(itemId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}