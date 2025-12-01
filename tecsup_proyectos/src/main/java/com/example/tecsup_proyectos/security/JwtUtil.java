package com.example.tecsup_proyectos.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Date;
import java.util.List;

public class JwtUtil {

    private static final String ENV_SECRET = "JWT_SECRET";
    private static final long EXPIRATION_MS = 1000L * 60 * 60 * 6; // 6 hours

    private static Algorithm getAlgorithm() {
        String secret = System.getenv(ENV_SECRET);
        if (secret == null || secret.isBlank()) {
            secret = "change-this-secret-in-prod"; // fallback for dev
        }
        return Algorithm.HMAC256(secret.getBytes());
    }

    public static String generateToken(String username, List<String> roles) {
        Algorithm alg = getAlgorithm();
        Date now = new Date();
        Date exp = new Date(now.getTime() + EXPIRATION_MS);

        return JWT.create()
                .withSubject(username)
                .withArrayClaim("roles", roles.toArray(new String[0]))
                .withIssuedAt(now)
                .withExpiresAt(exp)
                .sign(alg);
    }

    public static DecodedJWT verifyToken(String token) {
        return JWT.require(getAlgorithm()).build().verify(token);
    }
}
