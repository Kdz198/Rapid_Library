package library.bookservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;
import org.hibernate.annotations.Nationalized;


@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
public class Book {
    @Id
    @Column(name = "BookId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bookId;

    @NotNull
    @Column(name ="Title")
    @Nationalized
    private String title;

    @NotNull
    @Column(name ="Author")
    @Nationalized
    private String author;

    @Column(name = "YearOfPublisher")
    private int yearOfPublisher;

    @Min(value = 0,message = "Quantity must be greater than 0 !!")
    @Column(name = "Quantity")
    private int quantity;

    @Min(value = 0,message = "Available must be greater than 0 !!")
    @Column(name = "Available")
    private int available;

    @Column(name = "Status")
    private boolean status;

    @JoinColumn(name = "CateId")
    @ManyToOne
    private Category category;

    public Book(String title, String author, int yearOfPublisher, int quantity, int available, boolean status, Category category) {
        this.title = title;
        this.author = author;
        this.yearOfPublisher = yearOfPublisher;
        this.quantity = quantity;
        this.available = available;
        this.status = status;
        this.category = category;
    }
}
