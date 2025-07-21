package library.bookservice.repository;

import library.bookservice.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepo extends JpaRepository<Book, Integer> {
    boolean existsByTitle(String title);
    boolean existsByTitleAndBookIdNot(String title, int id);
}
