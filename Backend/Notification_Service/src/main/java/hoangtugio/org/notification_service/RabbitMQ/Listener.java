package hoangtugio.org.notification_service.RabbitMQ;

import hoangtugio.org.notification_service.Email.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import java.time.LocalDate;
import java.util.List;

@Component
public class Listener {

    @Autowired
    EmailService emailService;

    public record message (String userEmail, LocalDate borrowDate, LocalDate dueDate) {}


    @RabbitListener(queues = "email.queue")
    public void confirmPayment(message msg) {
        System.out.println(msg);
        try {
            emailService.sendOverdueBookReminderEmail(msg.userEmail, msg.borrowDate, msg.dueDate);
        } catch (MessagingException e) {
            e.printStackTrace();

        }
    }



}
