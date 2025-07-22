package library.bookservice.repository;

import library.bookservice.model.Book_Cate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface Book_CateRepo extends JpaRepository<Book_Cate, Integer> {
    List<Book_Cate> findBook_CatesByCategory_CategoryId(int categoryCategoryId);

    List<Book_Cate> findBook_CatesByBook_BookId(int bookBookId);
}
