package library.bookservice.service;

import library.bookservice.exception.CustomException;
import library.bookservice.model.Book;
import library.bookservice.model.BookDto;
import library.bookservice.repository.BookRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookRepo bookRepo;

    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    public Book getBookById(int id) {
        if(bookRepo.existsById(id)) {
            return bookRepo.findById(id).get();
        }
       else throw new CustomException("Book does not exist !!", HttpStatus.NOT_FOUND);
    }

    public Book addBook(Book book) {
        if(bookRepo.existsByTitle(book.getTitle())) {
            throw new CustomException("Book already exists !!", HttpStatus.CONFLICT);
        }
        return bookRepo.save(book);
    }

    public Book updateBook(Book book) {
        if(bookRepo.existsByTitleAndBookIdNot(book.getTitle(),book.getBookId())) {
            throw new CustomException("Book already exists !!", HttpStatus.CONFLICT);
        }
        return bookRepo.save(book);
    }

    public void setStatus(int id) {
        if(bookRepo.existsById(id)) {
            Book book = bookRepo.findById(id).get();
            if(book.isStatus())
            {
            book.setStatus(false);
            }
            else{
                book.setStatus(true);
            }
            bookRepo.save(book);
        }
        else throw new CustomException("Book does not exist !!", HttpStatus.NOT_FOUND);
    }

    public void borrowBook(List<BookDto> listBorrowedBook) {
        for(BookDto bookDto : listBorrowedBook) {
            Book book = getBookById(bookDto.getId());
            if(book.isStatus() && book.getAvailable()>bookDto.getQuantity()) {
                book.setAvailable(book.getAvailable()-bookDto.getQuantity());
                bookRepo.save(book);
            }
            else{
                throw new CustomException("Book is not available !!", HttpStatus.CONFLICT);
            }
        }
    }

    public void returnBook(List<BookDto> listReturnedBook) {
        for(BookDto bookDto : listReturnedBook) {
            Book book = getBookById(bookDto.getId());
            book.setAvailable(book.getAvailable()+bookDto.getQuantity());
            bookRepo.save(book);
        }
    }
}
