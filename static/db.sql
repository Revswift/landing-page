CREATE DATABASE IF NOT EXISTS revswift;

USE revswift;

CREATE TABLE IF NOT EXISTS waitlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    job_title VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL,
    referral_code VARCHAR(10) NOT NULL UNIQUE,
    referred_by VARCHAR(10) DEFAULT NULL,
    position INT NOT NULL,
    referral_count INT DEFAULT 0,
    is_test BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_referral_code (referral_code),
    INDEX idx_referred_by (referred_by),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin: username=admin, password=revswift2024
-- Note: In production, passwords should be hashed
