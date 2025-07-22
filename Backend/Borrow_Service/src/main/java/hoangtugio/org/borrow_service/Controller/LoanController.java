package hoangtugio.org.borrow_service.Controller;


import hoangtugio.org.borrow_service.Model.Loan;
import hoangtugio.org.borrow_service.Service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
public class LoanController {
    @Autowired
    private LoanService loanService;

    @GetMapping
    public List<Loan> getLoans() {
        return loanService.getAllLoans();
    }

    public record  LoanRequest(String userEmail, Map<Integer, Integer> books, LocalDate dueDate) {}

    @PostMapping
    public boolean borrowBook( @RequestBody LoanRequest loanRequest) {
       return loanService.borrowBook(loanRequest.userEmail, loanRequest.books, loanRequest.dueDate);
    }

    @PostMapping("/return")
    public boolean returnBook(@RequestParam int loanId) {
        return loanService.returnBook(loanId);}
}



