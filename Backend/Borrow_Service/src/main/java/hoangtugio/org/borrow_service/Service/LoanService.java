package hoangtugio.org.borrow_service.Service;


import hoangtugio.org.borrow_service.Model.Loan;
import hoangtugio.org.borrow_service.RabbitMQ.Producer;
import hoangtugio.org.borrow_service.Repository.LoanRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class LoanService {

    @Autowired
    LoanRepository loanRepository;
    @Autowired
    RestTemplate restTemplate;
    @Autowired
    Producer producer;

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public record BookDTO (int id, int quantity) {}


    public boolean borrowBook(String userEmail, Map<Integer, Integer> books, LocalDate dueDate) {
        List<BookDTO> bookList = books.entrySet().stream()
                .map(entry -> new BookDTO(entry.getKey(), entry.getValue()))
                .toList();
        System.out.println(bookList);
        System.out.println( "Borrowing books for user Email: " + userEmail);
        boolean result = Boolean.TRUE.equals(restTemplate.postForObject("http://BOOK-SERVICE/api/books/borrow", bookList, Boolean.class));
        System.out.println(result);
        if ( result) {
            Loan loan = new Loan();
            loan.setUserEmail(userEmail);
            loan.setBooks(books);
            loan.setDueDate(dueDate);


            loanRepository.save(loan);
            return true;
        }
        return false;

    }

    public boolean returnBook(int loanId) {
        Loan loan = loanRepository.findById(loanId).orElseThrow(() -> new RuntimeException("Loan not found"));

        List<BookDTO> bookList = loan.getBooks().entrySet().stream()
                .map(entry -> new BookDTO(entry.getKey(), entry.getValue()))
                .toList();
        loan.setReturnDate(LocalDate.now());

        System.out.println(bookList);
        System.out.println( "Borrowing books for user Email: " + loan.getUserEmail());
        boolean result = Boolean.TRUE.equals(restTemplate.postForObject("http://BOOK-SERVICE/api/books/return", bookList, Boolean.class));
        if ( result) {
            loan.setStatus("RETURNED");
            loanRepository.save(loan);
            return true;

        }

        return false;
    }

    @Scheduled(fixedRate = 24 * 60 * 60 * 1000)
    @Transactional
    public void remind()
    {
        List<Loan> loans = loanRepository.findAll();
        LocalDate today = LocalDate.now();
        for (Loan loan : loans) {
            if (loan.getDueDate().isBefore(today) && !loan.getStatus().equals("RETURNED")) {
                // Logic to send reminder notification
                producer.sendMessage( loan.getUserEmail(), loan.getBorrowDate(), loan.getDueDate());
                System.out.println("Reminder: Loan with ID " + loan.getId() + " is overdue.");
                loan.setStatus("OVERDUE");
                loanRepository.save(loan);
            }
        }
    }
}

