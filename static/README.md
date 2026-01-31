# RevSwift Static Landing Page

Static HTML/CSS/JS landing page with PHP/MySQL backend for waitlist management.

## Setup Instructions

### 1. Database Setup

Run the SQL script to create the database and table:

```bash
mysql -u root -p < db.sql
```

Or import via phpMyAdmin.

### 2. Configure Database Connection

Edit `config.php` and update the database credentials:

```php
$host = 'localhost';
$dbname = 'revswift';
$username = 'your_username';
$password = 'your_password';
```

### 3. Deploy Files

Copy all files to your web server directory:
- index.html
- dashboard.html
- styles.css
- app.js
- dashboard.js
- api.php
- config.php

### 4. Server Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)

### 5. Test Locally

Using PHP built-in server:

```bash
cd static
php -S localhost:8000
```

Visit http://localhost:8000

## Features

- Email waitlist signup
- Referral code generation
- Position tracking
- Referral counting
- Dashboard view with progress
- Responsive design
- Glass morphism UI

## File Structure

```
static/
├── index.html          # Main landing page
├── dashboard.html      # Referral dashboard
├── styles.css          # All styles
├── app.js             # Form handling
├── dashboard.js       # Dashboard logic
├── api.php            # Backend API
├── config.php         # Database config
└── db.sql             # Database schema
```

## API Endpoint

POST to `api.php` with JSON:

```json
{
  "action": "join",
  "email": "user@example.com",
  "referred_by": "ABC123"
}
```

Response:

```json
{
  "success": true,
  "position": 2401,
  "referral_code": "XYZ789",
  "referral_count": 0
}
```
