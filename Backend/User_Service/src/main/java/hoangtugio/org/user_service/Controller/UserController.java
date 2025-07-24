package hoangtugio.org.user_service.Controller;



import hoangtugio.org.user_service.Model.User;
import hoangtugio.org.user_service.Repository.UserRepository;
import hoangtugio.org.user_service.Service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return  userRepository.findByEmail(auth.getName()).orElse(null);
    }

    @PostMapping("/register")
    public User createUser( @RequestBody User user) {
        return userService.save(user);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{email}")
    public User updateUser(@PathVariable String email,  @RequestBody User user) {
        User existingUser = userRepository.findByEmail(email).orElse(null);
        if (existingUser == null) {
            throw new RuntimeException("User with email " + email + " not found");
        }
        if (user.getPassword() == null)
        {
            user.setPassword(existingUser.getPassword()); // Preserve the existing password if not provided
        }
        if ( user.getRole() == null)
        {
            user.setRole(existingUser.getRole()); // Preserve the existing role if not provided
        }
        if ( user.getStatus() == null)
        {
            user.setStatus(existingUser.getStatus()); // Preserve the existing status if not provided
        }
        // Update the user details
        return userService.update(user);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{email}")
    public void deleteUser(@PathVariable String email) throws Exception {
        userService.delete(email);
    }
}
