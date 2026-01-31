# RevSwift Waitlist - Technical Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    index.html                           │    │
│  │  ┌──────────────────────────────────────────────┐      │    │
│  │  │  Waitlist Form (6 Fields)                    │      │    │
│  │  │  • First Name                                │      │    │
│  │  │  • Last Name                                 │      │    │
│  │  │  • Work Email                                │      │    │
│  │  │  • Job Title                                 │      │    │
│  │  │  • Phone Number                              │      │    │
│  │  │  • Country                                   │      │    │
│  │  └──────────────────────────────────────────────┘      │    │
│  │                         │                               │    │
│  │                         │ Submit                        │    │
│  │                         ▼                               │    │
│  │  ┌──────────────────────────────────────────────┐      │    │
│  │  │           app.js (JavaScript)                │      │    │
│  │  │  • Client-side validation                    │      │    │
│  │  │  • Form data collection                      │      │    │
│  │  │  • CSRF token handling                       │      │    │
│  │  │  • Success message display                   │      │    │
│  │  └──────────────────────────────────────────────┘      │    │
│  │                         │                               │    │
│  │                         │ POST /api.php                 │    │
│  │                         │ (JSON payload)                │    │
│  └─────────────────────────┼───────────────────────────────┘    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                            │ HTTPS
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                      WEB SERVER                                 │
│                   (Shared Hosting)                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                   api.php (PHP)                       │      │
│  │  ┌────────────────────────────────────────────┐      │      │
│  │  │  Security Layer                            │      │      │
│  │  │  • CSRF token validation                   │      │      │
│  │  │  • Rate limiting (5 req/min per IP)        │      │      │
│  │  │  • Input sanitization                      │      │      │
│  │  └────────────────────────────────────────────┘      │      │
│  │                         │                             │      │
│  │                         ▼                             │      │
│  │  ┌────────────────────────────────────────────┐      │      │
│  │  │  Business Logic                            │      │      │
│  │  │  • Field validation (6 fields)             │      │      │
│  │  │  • Email format check                      │      │      │
│  │  │  • Duplicate email detection               │      │      │
│  │  │  • Referral code generation                │      │      │
│  │  │  • Position calculation                    │      │      │
│  │  └────────────────────────────────────────────┘      │      │
│  │                         │                             │      │
│  │                         ▼                             │      │
│  │  ┌────────────────────────────────────────────┐      │      │
│  │  │  Database Layer (PDO)                      │      │      │
│  │  │  • Prepared statements                     │      │      │
│  │  │  • SQL injection prevention                │      │      │
│  │  │  • Transaction handling                    │      │      │
│  │  └────────────────────────────────────────────┘      │      │
│  └──────────────────────────┼───────────────────────────┘      │
└───────────────────────────┼────────────────────────────────────┘
                            │
                            │ MySQL Connection
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                    MySQL DATABASE                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              waitlist Table                           │      │
│  │  ┌────────────────────────────────────────────┐      │      │
│  │  │  Columns:                                  │      │      │
│  │  │  • id (PRIMARY KEY)                        │      │      │
│  │  │  • first_name                              │      │      │
│  │  │  • last_name                               │      │      │
│  │  │  • email (UNIQUE)                          │      │      │
│  │  │  • job_title                               │      │      │
│  │  │  • phone_number                            │      │      │
│  │  │  • country                                 │      │      │
│  │  │  • referral_code (UNIQUE)                  │      │      │
│  │  │  • referred_by                             │      │      │
│  │  │  • position                                │      │      │
│  │  │  • referral_count                          │      │      │
│  │  │  • created_at                              │      │      │
│  │  └────────────────────────────────────────────┘      │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

### 1. User Submission
```
User fills form → Client validation → POST request to api.php
```

**Payload Example:**
```json
{
  "action": "join",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "job_title": "Product Manager",
  "phone_number": "+44 20 1234 5678",
  "country": "GB",
  "referred_by": null,
  "csrf_token": "abc123..."
}
```

### 2. Server Processing
```
CSRF validation → Rate limit check → Field validation → 
Duplicate check → Generate referral code → Calculate position → 
Insert to database
```

### 3. Database Storage
```sql
INSERT INTO waitlist (
  first_name, last_name, email, job_title, 
  phone_number, country, referral_code, position
) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
```

### 4. Response to User
```
Success response → Display confirmation → 
Redirect to dashboard (3s delay)
```

**Response Example:**
```json
{
  "success": true,
  "position": 2405,
  "referral_code": "A1B2C3",
  "referral_count": 0,
  "first_name": "John"
}
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JS | User interface and form handling |
| **Backend** | PHP 7.4+ | Server-side logic and validation |
| **Database** | MySQL 5.7+ | Data persistence |
| **Security** | CSRF tokens, Rate limiting, PDO | Protection against attacks |
| **Hosting** | Shared hosting | Static files + PHP execution |

## Security Features

1. **CSRF Protection**: Token validation on all POST requests
2. **Rate Limiting**: 5 requests per minute per IP address
3. **SQL Injection Prevention**: PDO prepared statements
4. **Input Sanitization**: Server-side validation of all fields
5. **Email Validation**: Format checking using PHP filter_var
6. **Duplicate Prevention**: UNIQUE constraint on email column

## Key Files

- `index.html` - Waitlist form UI
- `app.js` - Client-side form handling
- `api.php` - Backend API endpoint
- `config.php` - Database credentials
- `db.sql` - Database schema
- `styles.css` - UI styling
