package library.bookservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
public class Book_Cate {
    @Id
    @Column(name = "Book_CateId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Book_Cate;

    @JoinColumn(name = "BookId")
    @ManyToOne(fetch = FetchType.EAGER)
    private Book book;

    @JoinColumn(name = "CateId")
    @ManyToOne(fetch = FetchType.EAGER)
    private Category category;

    public Book_Cate(Book book, Category category) {
        this.book = book;
        this.category = category;
    }
}
