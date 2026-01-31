CREATE DATABASE IF NOT EXISTS revswift;

USE revswift;

CREATE TABLE IF NOT EXISTS waitlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    referral_code VARCHAR(10) NOT NULL UNIQUE,
    referred_by VARCHAR(10) DEFAULT NULL,
    position INT NOT NULL,
    referral_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_referral_code (referral_code),
    INDEX idx_referred_by (referred_by),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
