# Deployment Guide — Uplift Digital Partner Website

## What's Included

```
uplift-site/
├── index.html                 ← Main website
├── 404.html                   ← Custom "Page Not Found"
├── CNAME                      ← Custom domain (edit this)
├── robots.txt                 ← SEO crawling rules
├── sitemap.xml                ← SEO sitemap
├── .nojekyll                  ← Tells GitHub to skip Jekyll
├── README.md                  ← Repo documentation
└── assets/
    ├── css/style.css          ← All styles
    ├── js/main.js             ← Chat flow, calendar, emails
    └── images/
        ├── logo.png           ← Full resolution logo
        ├── logo-nav.png       ← Optimized for navbar
        ├── favicon.png        ← Browser tab icon
        └── og-image.png       ← Social media preview
```

---

## Step 1: Create the GitHub Repository

1. Go to **github.com** → Click **"+"** → **"New repository"**
2. Name it: `upliftdigitalpartner.com` (or whatever you prefer)
3. Set it to **Public**
4. Do NOT initialize with README (we already have one)
5. Click **"Create repository"**

---

## Step 2: Upload the Files

### Option A: GitHub Web Upload (Easiest)

1. On your new repo page, click **"uploading an existing file"**
2. Drag the **entire contents** of the `uplift-site` folder into the upload area
   - Make sure to include the hidden `.nojekyll` file
3. Commit message: `Initial website launch`
4. Click **"Commit changes"**

### Option B: Git Command Line

```bash
cd uplift-site
git init
git add -A
git commit -m "Initial website launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/upliftdigitalpartner.com.git
git push -u origin main
```

---

## Step 3: Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages** (left sidebar)
2. Under **Source**, select **"Deploy from a branch"**
3. Branch: **main** / Folder: **/ (root)**
4. Click **Save**
5. Wait 1-2 minutes → your site will be live at:
   `https://YOUR_USERNAME.github.io/upliftdigitalpartner.com/`

---

## Step 4: Connect Your Custom Domain

### In GitHub:
1. Still in **Settings → Pages**
2. Under **Custom domain**, type your domain: `upliftdigitalpartner.com`
3. Click **Save**
4. Check **"Enforce HTTPS"** (may take a few minutes to appear)

### In Your Domain Registrar (GoDaddy, Namecheap, Google Domains, etc.):

Add these **DNS records**:

**For root domain (upliftdigitalpartner.com):**

| Type | Name | Value |
|------|------|-------|
| A    | @    | 185.199.108.153 |
| A    | @    | 185.199.109.153 |
| A    | @    | 185.199.110.153 |
| A    | @    | 185.199.111.153 |

**For www subdomain:**

| Type  | Name | Value |
|-------|------|-------|
| CNAME | www  | YOUR_USERNAME.github.io |

### Verify:
- DNS propagation takes **5 minutes to 48 hours**
- Check status at: https://dnschecker.org
- Once propagated, GitHub will auto-provision an SSL certificate
- Both `upliftdigitalpartner.com` and `www.upliftdigitalpartner.com` will work

---

## Step 5: Update the CNAME File

Open the `CNAME` file and make sure it contains your exact domain:
```
upliftdigitalpartner.com
```

Also update `robots.txt` and `sitemap.xml` if your domain is different.

---

## Step 6: Set Up EmailJS (Auto-Email for Bookings)

This is what sends emails to both you and the client when someone books a consultation.

### 6a. Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com) → Sign up (free: 200 emails/month)

### 6b. Connect Your Gmail
1. Dashboard → **Email Services** → **Add New Service**
2. Choose **Gmail**
3. Connect `upliftdigitalpartners@gmail.com`
4. Copy your **Service ID** (looks like `service_abc123`)

### 6c. Create Email Templates

**Template 1: `booking_owner`** (notification to YOUR team)
- Template ID: `booking_owner`
- To Email: `upliftdigitalpartners@gmail.com`
- Subject: `New Consultation: {{client_name}} — {{business_name}}`
- Body:
```
New consultation booking received!

Client: {{client_name}}
Business: {{business_name}}
Email: {{client_email}}
Phone: {{client_phone}}

Service: {{service}}
Details: {{details}}

Meeting: {{meeting_type}}
Address: {{address}}
Date: {{date}}
Time: {{time}}

Please create a calendar invite and confirm within 24 hours.
```

**Template 2: `booking_client`** (confirmation to the CLIENT)
- Template ID: `booking_client`
- To Email: `{{client_email}}`
- Subject: `Your consultation with Uplift Digital Partner is booked!`
- Body:
```
Hi {{client_name}},

Thanks for booking a consultation with Uplift Digital Partner!

Here are your details:

Service: {{service}}
Meeting: {{meeting_type}}
Date: {{date}}
Time: {{time}}

Our team will reach out within 24 hours to confirm and send
you a calendar invite with a meeting link.

If you have any questions, reply to this email or call us.

Best,
The Uplift Digital Partner Team
upliftdigitalpartners@gmail.com
```

### 6d. Get Your Public Key
1. Dashboard → **Account** → **Public Key**
2. Copy it (looks like `user_Xyz123abc`)

### 6e. Update main.js
Open `assets/js/main.js` and find these lines near the top:

```javascript
var EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
var EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
```

Replace with your actual values:

```javascript
var EMAILJS_PUBLIC_KEY = 'user_Xyz123abc';
var EMAILJS_SERVICE_ID = 'service_abc123';
```

Commit and push the change. Emails will start working immediately.

---

## Step 7: Test Everything

1. Visit your domain
2. Click **"Book a Consultation"**
3. Complete the full chat flow
4. Verify:
   - [x] You receive an email at `upliftdigitalpartners@gmail.com`
   - [x] The test client email receives a confirmation
   - [x] "Create Calendar Invite" opens Google Calendar correctly
   - [x] All nav links scroll to correct sections
   - [x] Mobile view works properly

---

## Updating the Site

To make changes after deployment:

1. Edit files locally or on GitHub directly
2. If using Git:
   ```bash
   git add -A
   git commit -m "Description of changes"
   git push
   ```
3. GitHub Pages auto-deploys within 1-2 minutes

---

## Future Improvements

- [ ] Replace placeholder phone number with real one
- [ ] Add real portfolio projects as you complete them
- [ ] Add real client testimonials
- [ ] Set up Google Analytics for visitor tracking
- [ ] Consider Calendly/Cal.com for fully automated scheduling
- [ ] Upgrade EmailJS plan if you exceed 200 emails/month
