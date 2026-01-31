# RevSwift Landing Page

Static HTML/CSS/JS landing page with PHP/MySQL backend for waitlist management.

## Deployment

Upload the contents of the `/static` directory to your shared hosting:

1. Upload all files from `/static` to your web root (e.g., `public_html/`)
2. Create MySQL database using `db.sql`
3. Update database credentials in `config.php`
4. Ensure PHP 7.4+ is enabled on your hosting

## Files

- `index.html` - Landing page
- `dashboard.html` - Referral dashboard
- `styles.css` - All styles
- `app.js` - Form handling
- `dashboard.js` - Dashboard logic
- `api.php` - Backend API
- `config.php` - Database configuration
- `db.sql` - Database schema

## Features

- Email waitlist signup
- Referral tracking system
- Position tracking
- Duplicate email detection
- Responsive design
