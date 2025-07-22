package library.bookservice.controller;

import jakarta.validation.Valid;
import library.bookservice.model.Book;
import library.bookservice.model.BookDto;
import library.bookservice.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/books")
public class BookController {
    @Autowired
    private BookService bookService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable int id) {
        return bookService.getBookById(id);
    }

    @PostMapping
    public Book addBook(@Valid @RequestBody Book book) {
        return bookService.addBook(book);
    }

    @PutMapping
    public Book updateBook(@Valid @RequestBody Book book) {
        return bookService.updateBook(book);
    }

    @GetMapping("/set-status/{id}")
    public void setBookStatus(@PathVariable int id) {
         bookService.setStatus(id);
    }

    @GetMapping("/borrow")
    public boolean borrowBook(@RequestBody List<BookDto> dto) {
        return bookService.borrowBook(dto);
    }

    @GetMapping("/return")
    public boolean returnBook(@RequestBody List<BookDto> dto) {
        return bookService.returnBook(dto);
    }
}
