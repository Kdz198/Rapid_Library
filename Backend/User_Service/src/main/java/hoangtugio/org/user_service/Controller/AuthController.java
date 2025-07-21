package hoangtugio.org.user_service.Controller;



import hoangtugio.org.user_service.Model.User;
import hoangtugio.org.user_service.Repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final String jwtSecret;
    private final long jwtExpirationMs = 86400000; // 1 ngày

    public AuthController(UserRepository userRepository, @Value("${jwt.secret}") String jwtSecret) {
        this.userRepository = userRepository;
        this.jwtSecret = jwtSecret;
    }

    @GetMapping("/test")
    public String test() {
        System.out.println("Đã đưọc gọi endpoint lúc :" + LocalDateTime.now());
        return "THIS IS A PUBLIC ENDPOINT";
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        User dbUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!password.equals(dbUser.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = Jwts.builder()
                .setSubject(dbUser.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        return ResponseEntity.ok(token);
    }
}
