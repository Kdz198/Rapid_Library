package library.bookservice.controller;

import library.bookservice.model.Book_Cate;
import library.bookservice.service.BookCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/book-categories")
public class BookCategoryController {
    @Autowired
    private BookCategoryService bookCategoryService;

    @GetMapping
    public List<Book_Cate> getBookCategories() {
        return bookCategoryService.getAllBookCate();
    }
    @GetMapping("/{id}")
    public Book_Cate getBookCategory(@PathVariable int id) {
        return bookCategoryService.getBookCateById(id);
    }

    @GetMapping("/category/{id}")
    public List<Book_Cate> getBookCategoriesByCategoryId(@PathVariable int id) {
        return bookCategoryService.getBookCateByCategory(id);
    }

    @GetMapping("/book/{id}")
    public List<Book_Cate> getBookCategoriesByBookId(@PathVariable int id) {
        return bookCategoryService.getBookCateByBook(id);
    }

    @PostMapping
    public Book_Cate addBookCategory(@RequestBody Book_Cate bookCategory) {
        return bookCategoryService.addBookCate(bookCategory);
    }

    @PutMapping
    public Book_Cate updateBookCategory(@RequestBody Book_Cate bookCategory) {
        return bookCategoryService.updateBookCate(bookCategory);
    }
    @DeleteMapping("/{id}")
    public void deleteBookCategory(@PathVariable int id) {
        bookCategoryService.deleteBookCateById(id);
    }
}
