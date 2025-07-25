package hoangtugio.org.borrow_service.RabbitMQ;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class Producer {

    @Autowired
    RabbitTemplate rabbitTemplate;

    public record message (String userEmail, LocalDate borrowDate, LocalDate dueDate) {}


    public void sendMessage(String userEmail, LocalDate borrowDate, LocalDate dueDate) {
        message msg = new message(userEmail, borrowDate, dueDate);
        System.out.println("Sending message: " + msg);
        rabbitTemplate.convertAndSend("borrow.exchange", "borrow.lated", msg);
    }
}
