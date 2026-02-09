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
$password = 'your_strong_password';  // Use strong password in production
```

### 3. Deploy Files

Copy all files to your web server directory (e.g., `public_html/`):
- index.html
- dashboard.html
- styles.css
- app.js
- dashboard.js
- api.php
- config.php
- .htaccess

### 4. Server Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)
- HTTPS enabled (required for production)

### 5. Production Configuration

Update `api.php` CORS settings to your domain:

```php
header('Access-Control-Allow-Origin: https://yourdomain.com');
```

## Security Features

- CSRF token protection
- Rate limiting (5 requests per minute per IP)
- SQL injection prevention (prepared statements)
- XSS protection (input sanitization)
- HTTPS enforcement via .htaccess
- Security headers (X-Frame-Options, X-XSS-Protection, etc.)

## Production Checklist

- [ ] Set strong database password in `config.php`
- [ ] Update CORS origin in `api.php` to your domain
- [ ] Verify HTTPS is working
- [ ] Test rate limiting
- [ ] Test CSRF protection
- [ ] Backup database regularly
- [ ] Change default admin password (default: username: 'admin', password: 'password')

## Admin Access

### Default Credentials
- Username: `admin`
- Password: `password`

**IMPORTANT:** Change these credentials immediately after first login!

### Admin Features
- View all waitlist entries
- Export waitlist to CSV
- Mark entries as test data
- Filter and sort entries
- View statistics (total entries, test entries)

### Accessing Admin Panel
1. Navigate to `/admin-login.html`
2. Login with admin credentials
3. You'll be redirected to the admin dashboard

## Features

- Email waitlist signup
- Referral code generation
- Position tracking
- Referral counting
- Dashboard view with progress
- Admin login and dashboard
- Export waitlist to CSV
- Mark entries as test data
- Responsive design
- Glass morphism UI

## File Structure

```
static/
├── index.html          # Main landing page
├── dashboard.html      # Referral dashboard
├── admin-login.html    # Admin login page
├── admin-dashboard.html # Admin dashboard
├── styles.css          # All styles
├── app.js             # Form handling with CSRF
├── dashboard.js       # Dashboard logic
├── admin-login.js     # Admin login logic
├── admin-dashboard.js # Admin dashboard logic
├── api.php            # Backend API with rate limiting
├── config.php         # Database config
├── db.sql             # Database schema
└── .htaccess          # HTTPS redirect and security headers
```

## API Endpoint

POST to `api.php` with JSON:

```json
{
  "action": "join",
  "email": "user@example.com",
  "referred_by": "ABC123",
  "csrf_token": "token_from_get_csrf"
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
