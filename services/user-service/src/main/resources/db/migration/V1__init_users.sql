CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    address VARCHAR(500),
    city VARCHAR(100),
    postal_code VARCHAR(50),
    country VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Seed Default Admin: admin@aurastore.com / Admin@123
-- BCrypt cost 10 hash of 'Admin@123': $2a$10$3zZ6hD55F3hO.b3HwM7oSuqX8wIhzxV5gB9Ukm8i3o/p6r7lJg8xK
-- Seed Default Customer: customer@aurastore.com / Customer@123
-- BCrypt cost 10 hash of 'Customer@123': $2a$10$2Hn9r4q8w4Jj9h0F1q7wOeYV2a6Xp4N5m8l9k0j1h2g3f4d5s6a7q
INSERT INTO users (email, password, full_name, role, address, city, postal_code, country, created_at, updated_at)
VALUES 
('admin@aurastore.com', '$2a$10$Qj2UoH76B.g9vF/M.zP4qOKi3Zq3W2Zf3B8j6dYkF0WbS9rG9k/j.', 'Store Administrator', 'ADMIN', '100 Executive Way', 'San Francisco', '94105', 'United States', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('customer@aurastore.com', '$2a$10$yF6aV6s5V6b4Y2c1d3e5fOu8H8l7k6j5h4g3f2d1s0a9q8w7e6r5t', 'Jane Doe', 'CUSTOMER', '45 Market Street', 'Seattle', '98101', 'United States', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
