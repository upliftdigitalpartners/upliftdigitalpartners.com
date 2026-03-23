# Uplift Digital Partner

Official website for **Uplift Digital Partner** — a digital agency helping small businesses build modern websites, apps, and online presence.

🌐 [upliftdigitalpartner.com](https://upliftdigitalpartner.com)

## Tech Stack

- **HTML5 / CSS3 / Vanilla JS** — No frameworks, fast load times
- **EmailJS** — Automated email notifications for consultation bookings
- **Google Calendar API** — One-click meeting invite creation
- **GitHub Pages** — Free, reliable hosting with custom domain

## Project Structure

```
├── index.html              # Main website
├── 404.html                # Custom 404 page
├── CNAME                   # Custom domain config
├── robots.txt              # Search engine crawling rules
├── sitemap.xml             # SEO sitemap
├── .nojekyll               # Bypass Jekyll processing
├── assets/
│   ├── css/
│   │   └── style.css       # All styles
│   ├── js/
│   │   └── main.js         # Chat flow, calendar, email logic
│   └── images/
│       ├── logo.png         # Full logo
│       ├── logo-nav.png     # Optimized nav logo
│       ├── favicon.png      # Browser tab icon
│       └── og-image.png     # Social media preview image
```

## Setup

### EmailJS Configuration (Required for auto-emails)

1. Sign up at [emailjs.com](https://www.emailjs.com) (free: 200 emails/month)
2. **Email Services** → Add Service → Connect Gmail
3. **Email Templates** → Create two templates:
   - `booking_owner` — notification sent to your team
   - `booking_client` — confirmation sent to the client
4. Open `assets/js/main.js` and replace:
   - `YOUR_PUBLIC_KEY` → your EmailJS public key
   - `YOUR_SERVICE_ID` → your EmailJS service ID

### Template Variables

Use these in your EmailJS templates:

| Variable | Description |
|----------|-------------|
| `{{client_name}}` | Client's name |
| `{{client_email}}` | Client's email |
| `{{client_phone}}` | Client's phone |
| `{{business_name}}` | Their business name |
| `{{service}}` | Service they're interested in |
| `{{details}}` | Project description |
| `{{meeting_type}}` | Video Call or In-Person |
| `{{address}}` | Office address (in-person only) |
| `{{date}}` | Selected date |
| `{{time}}` | Selected time |

### Custom Domain

Update the `CNAME` file with your actual domain name.

## License

© 2026 Uplift Digital Partner. All rights reserved.
