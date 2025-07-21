package library.bookservice.repository;

import library.bookservice.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CateRepo extends JpaRepository<Category,Integer> {
}
