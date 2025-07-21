package hoangtugio.org.user_service.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    private String email;
    private String password;
    private String name;
    private String status;
    private String role;





    public enum role {
        USER, ADMIN
    }
}
