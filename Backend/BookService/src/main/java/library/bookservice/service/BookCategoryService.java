package library.bookservice.service;

import library.bookservice.model.Book_Cate;
import library.bookservice.repository.Book_CateRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookCategoryService {
    @Autowired
    private Book_CateRepo book_cateRepo;

    public List<Book_Cate> getAllBookCate() {
        return book_cateRepo.findAll();
    }

    public Book_Cate getBookCateById(int id) {
        return book_cateRepo.findById(id).get();
    }

    //tim sach theo the loai
    public List<Book_Cate> getBookCateByCategory(int categoryId) {
        return book_cateRepo.findBook_CatesByCategory_CategoryId(categoryId);
    }

    //tim cac the loai cua sach
    public List<Book_Cate> getBookCateByBook(int bookId) {
        return book_cateRepo.findBook_CatesByBook_BookId(bookId);
    }

    public Book_Cate addBookCate(Book_Cate bookCate) {
        return book_cateRepo.save(bookCate);
    }

    public Book_Cate updateBookCate(Book_Cate bookCate) {
        return book_cateRepo.save(bookCate);
    }

    public void deleteBookCateById(int id) {
        book_cateRepo.deleteById(id);
    }

}
