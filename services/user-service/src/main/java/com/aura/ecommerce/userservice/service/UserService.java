package com.aura.ecommerce.userservice.service;

import com.aura.ecommerce.userservice.dto.*;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserProfileDto getCurrentUser(String email);
    UserProfileDto updateProfile(String email, UpdateProfileRequest request);
}
