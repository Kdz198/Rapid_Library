package hoangtugio.org.borrow_service.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    private int userId;

    @ElementCollection
    @CollectionTable(name = "loan_items", joinColumns = @JoinColumn(name = "loan_id"))
    @MapKeyColumn(name = "book_id")
    @Column(name = "quantity")
    private Map<Integer, Integer> books = new HashMap<>();

    @CreationTimestamp
    private LocalDate borrowDate;

    private LocalDate dueDate;

    private LocalDate returnDate;

    private String status = "BORROWED"; // Default status is BORROWED

}
