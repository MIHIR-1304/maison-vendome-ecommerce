package com.aura.ecommerce.userservice.config;

import com.aura.ecommerce.userservice.entity.Role;
import com.aura.ecommerce.userservice.entity.User;
import com.aura.ecommerce.userservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        ensureUser("admin@aurastore.com", "Admin@123", "Store Administrator", Role.ADMIN, "100 Executive Way", "San Francisco", "94105", "United States");
        ensureUser("customer@aurastore.com", "Customer@123", "Jane Doe", Role.CUSTOMER, "45 Market Street", "Seattle", "98101", "United States");
    }

    private void ensureUser(String email, String rawPassword, String fullName, Role role, String address, String city, String postalCode, String country) {
        userRepository.findByEmail(email).ifPresentOrElse(
                user -> {
                    // Update password to ensure valid BCrypt
                    user.setPassword(passwordEncoder.encode(rawPassword));
                    user.setFullName(fullName);
                    user.setRole(role);
                    userRepository.save(user);
                    log.info("Verified seed user: {}", email);
                },
                () -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setPassword(passwordEncoder.encode(rawPassword));
                    newUser.setFullName(fullName);
                    newUser.setRole(role);
                    newUser.setAddress(address);
                    newUser.setCity(city);
                    newUser.setPostalCode(postalCode);
                    newUser.setCountry(country);
                    userRepository.save(newUser);
                    log.info("Created seed user: {}", email);
                }
        );
    }
}
