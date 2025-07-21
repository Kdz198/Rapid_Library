package library.bookservice.repository;

import library.bookservice.model.Book_Cate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface Book_CateRepo extends JpaRepository<Book_Cate, Integer> {
}
