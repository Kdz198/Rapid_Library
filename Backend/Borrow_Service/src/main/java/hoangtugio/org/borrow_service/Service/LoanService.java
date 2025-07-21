package hoangtugio.org.borrow_service.Service;


import hoangtugio.org.borrow_service.Model.Loan;
import hoangtugio.org.borrow_service.Repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class LoanService {

    @Autowired
    LoanRepository loanRepository;

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }


    public void borrowBook(int userId, Map<Integer, Integer> books, LocalDate dueDate) {
        System.out.println( "Borrowing books for user ID: " + userId);
        // Create a new loan record
        Loan loan = new Loan();
        loan.setUserId(userId);
        loan.setBooks(books);
        loan.setDueDate(dueDate);

        // Save the loan record to the database
        loanRepository.save(loan);

    }

    public void returnBook(int loanId) {
        Loan loan = loanRepository.findById(loanId).orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setReturnDate(LocalDate.now());
        loan.setStatus("RETURNED");

        loanRepository.save(loan);
    }
}

