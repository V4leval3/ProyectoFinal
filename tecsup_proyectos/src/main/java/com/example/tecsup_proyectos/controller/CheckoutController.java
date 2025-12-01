package com.example.tecsup_proyectos.controller;

import com.example.tecsup_proyectos.model.Proyecto;
import com.example.tecsup_proyectos.repository.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import com.example.tecsup_proyectos.model.Reclutamiento;
import com.example.tecsup_proyectos.repository.ReclutamientoRepository;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

	@Autowired
	private ProyectoRepository proyectoRepository;

	@Autowired
	private ReclutamientoRepository reclutamientoRepository;

	// Número de WhatsApp final solicitado por el usuario (sin +, formato WA)
	private static final String WHATSAPP_PHONE = "51976421323"; // +51 976 421 323

	public static class DonacionRequest {
		public Double monto;
		public Long proyectoId;
		public String cuentaDestino;
	}

	public static class InversionRequest {
		public Long proyectoId;
		public String nombre;
		public String email;
		public String telefono;
		public String monto;
		public String experiencia;
		public String motivo;
	}

	public static class ContactoRequest {
		public Long proyectoId;
		public String nombre;
		public String telefono;
		public String mensaje;
	}

	public static class ContactoReclutamientoRequest {
		public String nombre;
		public String empresa;
		public String email;
		public String telefono;
		public String industria;
		public String perfiles;
	}

	@PostMapping("/donar")
	public ResponseEntity<?> donar(@RequestBody DonacionRequest request) {
		// Implementación minimal: genera un transactionId y devuelve un mensaje.
		String tx = UUID.randomUUID().toString();
		Map<String, Object> resp = new HashMap<>();
		resp.put("transactionId", tx);
		resp.put("monto", request.monto);
		resp.put("proyectoId", request.proyectoId);
		resp.put("mensaje", "Donación registrada (simulada) - integrar pasarela para producción");
		return new ResponseEntity<>(resp, HttpStatus.OK);
	}

	@PostMapping("/contacto")
	public ResponseEntity<?> contacto(@RequestBody ContactoRequest request) {
		String texto = String.format("Hola, necesito información sobre el proyecto ID %s. Nombre: %s, Teléfono: %s. Mensaje: %s",
				Optional.ofNullable(request.proyectoId).map(Object::toString).orElse("-"),
				Optional.ofNullable(request.nombre).orElse("-"),
				Optional.ofNullable(request.telefono).orElse("-"),
				Optional.ofNullable(request.mensaje).orElse("-"));

		String encoded = URLEncoder.encode(texto, StandardCharsets.UTF_8);
		String enlace = "https://wa.me/" + WHATSAPP_PHONE + "?text=" + encoded;

		Map<String, String> resp = new HashMap<>();
		resp.put("enlaceWhatsApp", enlace);
		resp.put("mensaje", "Enlace de contacto generado");
		return new ResponseEntity<>(resp, HttpStatus.OK);
	}

	@PostMapping("/contacto-reclutamiento")
	public ResponseEntity<?> contactoReclutamiento(@RequestBody ContactoReclutamientoRequest request) {
		// Guardar la petición en la base de datos para que el admin la revise
		Reclutamiento r = new Reclutamiento();
		r.setNombre(request.nombre);
		r.setEmpresa(request.empresa);
		r.setEmail(request.email);
		r.setTelefono(request.telefono);
		r.setIndustria(request.industria);
		r.setPerfiles(request.perfiles);

		reclutamientoRepository.save(r);

		Map<String, Object> resp = new HashMap<>();
		resp.put("id", r.getId());
		resp.put("mensaje", "Petición de contacto para reclutamiento registrada exitosamente. Pendiente revisión.");
		resp.put("estado", r.getEstado());
		return new ResponseEntity<>(resp, HttpStatus.CREATED);
	}

	@GetMapping("/reclutamientos")
	public ResponseEntity<?> listarReclutamientos(@RequestHeader(value = "X-Is-Admin", required = false) String isAdmin) {
		// Allow access either by legacy X-Is-Admin header or by ROLE_ADMIN granted via JWT
		boolean ok = "true".equals(isAdmin);
		try {
			var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
			if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
				ok = true;
			}
		} catch (Exception e) {
			// ignore
		}

		if (!ok) {
			return new ResponseEntity<>(Map.of("error", "Acceso denegado"), HttpStatus.FORBIDDEN);
		}
		return new ResponseEntity<>(reclutamientoRepository.findAll(), HttpStatus.OK);
	}

	@PutMapping("/reclutamientos/{id}/status")
	public ResponseEntity<?> actualizarEstadoReclutamiento(@PathVariable Long id, @RequestBody Map<String, String> body, @RequestHeader(value = "X-Is-Admin", required = false) String isAdmin) {
		boolean ok = "true".equals(isAdmin);
		try {
			var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
			if (auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
				ok = true;
			}
		} catch (Exception e) {
			// ignore
		}
		if (!ok) {
			return new ResponseEntity<>(Map.of("error", "Acceso denegado"), HttpStatus.FORBIDDEN);
		}
		Optional<Reclutamiento> opt = reclutamientoRepository.findById(id);
		if (opt.isEmpty()) return new ResponseEntity<>(Map.of("error", "No encontrado"), HttpStatus.NOT_FOUND);
		Reclutamiento r = opt.get();
		String estado = body.getOrDefault("status", "PENDIENTE").toUpperCase();
		if (!estado.equals("CONFIRMADO") && !estado.equals("RECHAZADO") && !estado.equals("PENDIENTE")) {
			return new ResponseEntity<>(Map.of("error", "Estado inválido"), HttpStatus.BAD_REQUEST);
		}
		r.setEstado(estado);
		reclutamientoRepository.save(r);
		return new ResponseEntity<>(Map.of("id", r.getId(), "estado", r.getEstado()), HttpStatus.OK);
	}

	@PostMapping("/create-payment-intent")
	public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> body) {
		// Espera { monto: number, proyectoId: number, currency: "pen" }
		Double monto = body.get("monto") instanceof Number ? ((Number) body.get("monto")).doubleValue() : null;
		String currency = body.getOrDefault("currency", "pen").toString();
		if (monto == null || monto <= 0) {
			return new ResponseEntity<>(Map.of("error", "Monto inválido"), HttpStatus.BAD_REQUEST);
		}

		String secretKey = System.getenv("STRIPE_SECRET_KEY");
		if (secretKey == null || secretKey.isBlank()) {
			return new ResponseEntity<>(Map.of("error", "Stripe no está configurado en el servidor"), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		Stripe.apiKey = secretKey;

		long amountInCents = Math.round(monto * 100);

		try {
			PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
				.setAmount(amountInCents)
				.setCurrency(currency)
				.setDescription("Donación al proyecto")
				.build();

			PaymentIntent intent = PaymentIntent.create(params);
			Map<String, Object> resp = new HashMap<>();
			resp.put("clientSecret", intent.getClientSecret());
			resp.put("id", intent.getId());
			return new ResponseEntity<>(resp, HttpStatus.OK);
		} catch (StripeException e) {
			return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	@PostMapping("/invertir")
	public ResponseEntity<?> invertir(@RequestBody InversionRequest request) {
		if (request.proyectoId == null) {
			return new ResponseEntity<>("proyectoId es requerido", HttpStatus.BAD_REQUEST);
		}

		Optional<Proyecto> opt = proyectoRepository.findById(request.proyectoId);
		if (opt.isEmpty()) {
			return new ResponseEntity<>("Proyecto no encontrado", HttpStatus.NOT_FOUND);
		}

		Proyecto proyecto = opt.get();

		if (!proyecto.isDisponibleParaPatrocinio() || proyecto.getMiembrosDisponibles() == null || proyecto.getMiembrosDisponibles() <= 0) {
			return new ResponseEntity<>("Proyecto no disponible para inversión", HttpStatus.BAD_REQUEST);
		}

		// Decrementar miembrosDisponibles y actualizar disponibilidad
		int actuales = proyecto.getMiembrosDisponibles();
		proyecto.setMiembrosDisponibles(actuales - 1);
		if (proyecto.getMiembrosDisponibles() <= 0) {
			proyecto.setDisponibleParaPatrocinio(false);
		}
		proyectoRepository.save(proyecto);

		// Generar enlace WhatsApp con la información del inversor
		String texto = String.format("Hola, tengo interés en invertir en el proyecto ID %s. Nombre: %s. Email: %s. Tel: %s. Monto aproximado: %s. Experiencia: %s. Motivo: %s",
				proyecto.getId(),
				Optional.ofNullable(request.nombre).orElse("-"),
				Optional.ofNullable(request.email).orElse("-"),
				Optional.ofNullable(request.telefono).orElse("-"),
				Optional.ofNullable(request.monto).orElse("-"),
				Optional.ofNullable(request.experiencia).orElse("-"),
				Optional.ofNullable(request.motivo).orElse("-"));

		String encoded = URLEncoder.encode(texto, StandardCharsets.UTF_8);
		String enlace = "https://wa.me/" + WHATSAPP_PHONE + "?text=" + encoded;

		Map<String, Object> resp = new HashMap<>();
		resp.put("enlaceWhatsApp", enlace);
		resp.put("mensaje", "Solicitud de inversión generada y proyecto actualizado");
		resp.put("miembrosDisponibles", proyecto.getMiembrosDisponibles());

		return new ResponseEntity<>(resp, HttpStatus.OK);
	}
}
