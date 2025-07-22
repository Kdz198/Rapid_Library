package library.bookservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;
import org.hibernate.annotations.Nationalized;

@Entity
@Data
@NoArgsConstructor
@Getter
@Setter
public class Category {
    @Id
    @Column(name = "CategoryId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int categoryId;

    @NotNull
    @Column(name = "Name")
    @Nationalized
    private String name;

    @Column(name = "Description")
    @Nationalized
    private String description;

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }
}
