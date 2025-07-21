package hoangtugio.org.user_service.Service;


import hoangtugio.org.user_service.Model.User;
import hoangtugio.org.user_service.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User save (User user) {


        return userRepository.save(user);
    }

    public User findById(int id) {
        return userRepository.findById(id).orElseThrow();
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User update(User user) {
        User u = userRepository.findByEmail(user.getEmail()).orElse(null);
        if (u == null) {
            throw new RuntimeException("User with email " + user.getEmail() + " not found");
        }

        return userRepository.save(user);
    }


    public void delete(String email) throws Exception {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            throw new Exception("User with email " + email + " not found");
        }
        userRepository.delete(user);
    }

}
