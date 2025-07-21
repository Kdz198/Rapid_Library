package hoangtugio.org.borrow_service.Repository;

import hoangtugio.org.borrow_service.Model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRepository  extends JpaRepository<Loan, Integer> {
    // Additional query methods can be defined here if needed
}


