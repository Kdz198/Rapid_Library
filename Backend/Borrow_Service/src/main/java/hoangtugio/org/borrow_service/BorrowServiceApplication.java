package hoangtugio.org.borrow_service;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@OpenAPIDefinition(
        info = @Info(title = "Borrow Service API", version = "1.0"),
        servers = @Server(url = "http://localhost:8080", description = "API Gateway")
)
@SpringBootApplication
public class BorrowServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BorrowServiceApplication.class, args);
    }

}
