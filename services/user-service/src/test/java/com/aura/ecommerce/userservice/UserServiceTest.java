package com.aura.ecommerce.userservice;

import com.aura.ecommerce.userservice.dto.AuthResponse;
import com.aura.ecommerce.userservice.dto.LoginRequest;
import com.aura.ecommerce.userservice.dto.RegisterRequest;
import com.aura.ecommerce.userservice.dto.UserProfileDto;
import com.aura.ecommerce.userservice.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    @DisplayName("Should successfully register a new customer and return JWT")
    void shouldRegisterNewCustomer() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("tester.registration@example.com");
        req.setPassword("SecretPass123");
        req.setFullName("Test User");
        req.setCity("Austin");

        AuthResponse res = userService.register(req);

        assertNotNull(res);
        assertNotNull(res.getToken());
        assertEquals("tester.registration@example.com", res.getEmail());
        assertEquals("CUSTOMER", res.getRole());
        assertEquals("Test User", res.getFullName());
    }

    @Test
    @DisplayName("Should reject duplicate email registration")
    void shouldRejectDuplicateEmail() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("duplicate@example.com");
        req.setPassword("SecretPass123");
        req.setFullName("Duplicate User");

        userService.register(req);

        assertThrows(ResponseStatusException.class, () -> userService.register(req));
    }

    @Test
    @DisplayName("Should login registered customer with correct credentials")
    void shouldLoginWithValidCredentials() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("login.user@example.com");
        req.setPassword("ValidPassword123");
        req.setFullName("Login User");
        userService.register(req);

        LoginRequest loginReq = new LoginRequest("login.user@example.com", "ValidPassword123");
        AuthResponse loginRes = userService.login(loginReq);

        assertNotNull(loginRes);
        assertNotNull(loginRes.getToken());
        assertEquals("login.user@example.com", loginRes.getEmail());
    }

    @Test
    @DisplayName("Should reject login with invalid password")
    void shouldRejectInvalidPassword() {
        LoginRequest loginReq = new LoginRequest("admin@aurastore.com", "WrongPassword");
        assertThrows(ResponseStatusException.class, () -> userService.login(loginReq));
    }

    @Test
    @DisplayName("Should retrieve user profile without exposing password")
    void shouldRetrieveUserProfileSafely() {
        UserProfileDto profile = userService.getCurrentUser("admin@aurastore.com");
        assertNotNull(profile);
        assertEquals("admin@aurastore.com", profile.getEmail());
        assertEquals("ADMIN", profile.getRole());
    }
}
