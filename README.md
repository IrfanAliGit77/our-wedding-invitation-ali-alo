![Made with Love](https://img.shields.io/badge/Made%20with-Love-ff69b4?style=for-the-badge) ![Free](https://img.shields.io/badge/Cost-Rp%200-brightgreen?style=for-the-badge) ![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?style=for-the-badge) ![Google Sheets](https://img.shields.io/badge/Backend-Google%20Sheets-34A853?style=for-the-badge)

# 💌 Ali & Alo — Wedding Invitation

> *A modern, elegant, fully-featured digital wedding invitation — built from scratch with pure HTML, CSS, and JavaScript. Zero frameworks. Zero cost. Infinite love.*

[🌐 Live Demo](https://irfanaligit77.github.io/my-wedding-ali-alo-invitation/?to=Tamu+Undangan) · [✨ Features](#-features) · [🚀 Setup Guide](#-getting-started) · [💕 Dedication](#-for-alodia)

---

## 🎯 Overview

This is a **fully self-hosted, open-source** digital wedding invitation website for the marriage of **Muh. Irfan Ali** and **Alodia Kinanti Faruqa** on **December 25, 2026** at **Bukit Daun Hotel & Resort, Kediri, East Java, Indonesia**.

Every guest receives a **personalized link** (e.g., `?to=John+Doe`) — their name appears on the cover, RSVP form, wishes form, and playlist request, just like premium invitation platforms like undangankitaaja.com — but **completely free**.

The backend runs entirely on **Google Sheets + Google Apps Script** — no server, no database fees, no monthly subscriptions. Just deploy to GitHub Pages and you're done.

> **Try it live:** [irfanaligit77.github.io/my-wedding-ali-alo-invitation/?to=Your+Name](https://irfanaligit77.github.io/my-wedding-ali-alo-invitation/?to=Your+Name)

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 👤 | **Personalized Guest Name** | Each guest gets a unique URL with `?to=Name`. Their name appears throughout the invitation. |
| 📖 | **Quran Opening** | Bismillah + QS. Ar-Rum:21 in Arabic with Indonesian translation. |
| 💑 | **Bride & Groom Profile** | Photos, full names, and parents' names in an elegant circular layout. |
| ⏱️ | **Countdown Timer** | Live countdown to the wedding day, updating every second. |
| 💕 | **Our Love Journey** | Beautiful vertical timeline with the couple's love story milestones. |
| 📸 | **Photo Gallery** | Prewedding photos in a masonry grid with lightbox zoom. |
| 🎬 | **Video Section** | Embedded YouTube video (supports regular videos and Shorts). |
| 📍 | **Venue & Dress Code** | Venue details for both Akad and Reception, Google Maps embed, and color-swatch dress code. |
| 📋 | **RSVP** | Attendance confirmation (Hadir / Tidak Hadir / Masih Ragu) with guest count. Saved to Google Sheets. |
| 💰 | **Bank Transfer / Digital Envelope** | Bank account numbers with one-tap copy button. |
| 🎁 | **Gift Registry with E-Commerce Links** | Guests browse desired gifts, click to open the shop link (Tokopedia/Shopee), then confirm checkout. Claimed gifts are greyed out to prevent duplicates. All tracked in Google Sheets. |
| 💬 | **Wedding Wishes** | Guestbook where visitors leave messages and prayers. Real-time display. |
| 🎵 | **Playlist Request** | Guests can request songs to be played at the reception. |
| 🎶 | **Background Music** | Auto-plays when the invitation is opened, with a floating toggle button. |
| 🎨 | **Animations** | Smooth scroll animations (AOS), cover opening transition, floating music button with spin effect. |
| 📱 | **Mobile-First Responsive** | Fully optimized for smartphones — where 95% of guests will view it. |
| 🔗 | **Bottom Navigation** | Fixed bottom navbar for quick access to key sections. |
| ✉️ | **Envelope Cover** | "Buka Undangan" (Open Invitation) splash screen with elegant entry animation. |

---

### 🎁 How the Gift Registry Works

This is the standout feature — a **claimable gift registry with e-commerce integration** that no other open-source Indonesian wedding template offers.

```
Guest clicks "Berikan Hadiah" (Give Gift)
    │
    ├── Has shop link? ──► Opens Tokopedia/Shopee in new tab
    │                           │
    │                     Guest returns to invitation
    │                           │
    │                     Popup: "Have you completed checkout?"
    │                           │
    │                    ┌──────┴──────┐
    │                    │             │
    │                   YES           NO
    │                    │             │
    │              Mark claimed    Stay available
    │              Grey out card   (can claim later)
    │
    └── No shop link? ──► Direct confirmation dialog
                              │
                         Mark claimed
```

All claim data is stored in Google Sheets. Other guests will see claimed items as greyed out and unclickable — **preventing duplicate gifts**.

> This uses a trust-based confirmation system (same approach as Zola, The Knot, and other major wedding registries).

---

## 🛠️ Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | HTML + CSS + Vanilla JavaScript | Free |
| Fonts | Google Fonts (Cormorant Garamond, Jost, Amiri) | Free |
| Icons | Lucide Icons | Free |
| Animations | AOS (Animate on Scroll) | Free |
| Backend / Database | Google Sheets + Google Apps Script | Free |
| Hosting | GitHub Pages | Free |

**Total cost: $0 / Rp 0,-**

No frameworks. No build tools. No npm. No dependencies to manage. Just one HTML file and pure JavaScript.

---

## 🚀 Getting Started

### Prerequisites

- A GitHub account
- A Google account (for Google Sheets + Apps Script)
- Your wedding photos and an MP3 music file

### Step 1: Fork & Clone

```bash
# Fork this repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/my-wedding-ali-alo-invitation.git
cd my-wedding-ali-alo-invitation
```

### Step 2: Set Up Google Sheets Backend

**2a.** Create a new Google Spreadsheet and name it `Database Undangan`

**2b.** Create **4 tabs** with these exact names:

**Tab: `wishes`**

| name | message | date |
|------|---------|------|
| *(auto-filled)* | | |

**Tab: `rsvp`**

| name | attend | jumlah | date |
|------|--------|--------|------|
| *(auto-filled)* | | | |

**Tab: `gifts`** ← Fill in your desired gifts!

| id | nama | gambar | harga | status | diklaim_oleh | waktu_klaim | link |
|----|------|--------|-------|--------|--------------|-------------|------|
| 1 | Rice Cooker | https://image-url | Rp 500.000 | available | | | https://tokopedia.com/... |
| 2 | Blender | https://image-url | Rp 350.000 | available | | | https://shopee.co.id/... |

> 💡 The `link` column (H) is for e-commerce URLs. When a guest clicks "Berikan Hadiah", it opens the shop link first before confirming.

**Tab: `playlist`**

| name | song | date |
|------|------|------|
| *(auto-filled)* | | |

**2c.** Go to **Extensions → Apps Script**

**2d.** Delete all default code and paste the contents of `google-apps-script-v2.js`

**2e.** Click **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**

**2f.** **Authorize** when prompted (click "Advanced" → "Go to ... (unsafe)" → "Allow")

**2g.** Copy the deployment URL

> ⚠️ **Important:** Every time you edit the Apps Script code, you must create a **New Deployment** (not edit the existing one) for changes to take effect.

### Step 3: Configure Your Invitation

Open `index.html` and update the `CONFIG` object:

```javascript
const CONFIG = {
    groomName: 'Ali',
    brideName: 'Alo',
    weddingDate: '2026-12-25T09:00:00',
    apiBase: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    defaultGifts: [
        { id: 1, nama: 'Item', gambar: '', harga: 'Rp. 500.000', status: 'available', diklaim_oleh: '', link: 'https://tokopedia.com/...' },
    ]
};
```

### Step 4: Customize Content

Search for `<!-- GANTI: -->` comments in `index.html` to find all customizable sections:

| What to change | Where |
|----------------|-------|
| 🖼️ Couple photos | `assets/images/` — replace `irfan.jpeg` and `alodia.jpeg` |
| 📸 Prewedding gallery | `assets/images/1.jpeg` through `6.jpeg` |
| 🎵 Background music | `assets/music/sound-kita.mp3` |
| 👫 Couple info | Names, titles, parents in the Mempelai section |
| 💕 Love story | Timeline dates, titles, and descriptions |
| 📍 Venue | Location name, address, date, time, Google Maps embed |
| 🎨 Dress code | Color hex values in `.color-swatch` elements |
| 💰 Bank accounts | Account numbers and holder names |
| 📦 Shipping address | For physical gift deliveries |
| 🎬 Video | YouTube embed URL (supports regular videos and Shorts) |
| 📅 Calendar | Google Calendar event link |

### Step 5: Deploy to GitHub Pages

```bash
git add .
git commit -m "setup: personalized wedding invitation"
git push origin main
```

1. Go to your repository on GitHub
2. Click **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: **main**, folder: **/ (root)**
5. Click **Save**
6. Wait 1-2 minutes — your site will be live at:

```
https://YOUR_USERNAME.github.io/my-wedding-ali-alo-invitation/
```

### Step 6: Share Personalized Links

Generate unique links for each guest:

```
https://YOUR_USERNAME.github.io/my-wedding-ali-alo-invitation/?to=Ahmad+Fauzi
https://YOUR_USERNAME.github.io/my-wedding-ali-alo-invitation/?to=Keluarga+Besar+Hasan
https://YOUR_USERNAME.github.io/my-wedding-ali-alo-invitation/?to=Alodia+Kinanti+Faruqa
```

---

## 🎨 Customization

### Color Scheme

The default palette uses **Sage Green & Gold**. Change it by modifying CSS variables in `:root`:

```css
:root {
    --sage: #8B9D77;        /* Primary green */
    --sage-light: #A8B89A;  /* Light accent */
    --sage-dark: #6B7D5A;   /* Dark accent */
    --cream: #FAF6F0;       /* Background */
    --gold: #C9A96E;        /* Gold accent */
    --charcoal: #3A3A3A;    /* Text color */
}
```

### Typography

Three carefully paired fonts:
- **Cormorant Garamond** — elegant serif for headings
- **Jost** — clean sans-serif for body text
- **Amiri** — authentic Arabic script for Quran verses

### YouTube Shorts

YouTube Shorts work too! Just use the embed format:

```
Short URL:  https://youtube.com/shorts/4VscQXeUUVs
Embed URL:  https://www.youtube.com/embed/4VscQXeUUVs?rel=0
```

---

## 📁 Project Structure

```
my-wedding-ali-alo-invitation/
├── index.html                  ← The entire invitation (single file)
├── google-apps-script-v2.js    ← Backend code for Google Apps Script
├── assets/
│   ├── music/
│   │   └── sound-kita.mp3      ← Background music
│   └── images/
│       ├── irfan.jpeg           ← Groom photo
│       ├── alodia.jpeg          ← Bride photo
│       └── 1.jpeg ... 6.jpeg    ← Prewedding gallery
└── README.md                    ← You are here
```

---

## 🍴 Want to Use This for Your Wedding?

Fork this repository and make it yours! Quick checklist:

- [ ] Fork the repository
- [ ] Replace all photos in `assets/images/`
- [ ] Replace music in `assets/music/`
- [ ] Update couple names, parents, venue, dates in `index.html`
- [ ] Write your own love story timeline
- [ ] Set up Google Sheets with 4 tabs (wishes, rsvp, gifts, playlist)
- [ ] Deploy Apps Script and paste URL into `CONFIG.apiBase`
- [ ] Fill in gift items with shop links in Google Sheets
- [ ] Deploy to GitHub Pages
- [ ] Generate personalized `?to=` links for every guest
- [ ] Send and celebrate! 🎉

---

## ❓ FAQ

**Is this really free?**
Yes. GitHub Pages, Google Sheets, and Google Apps Script are all free. Zero cost.

**Can I use a custom domain?**
Yes! Go to Settings → Pages → Custom domain. Configure DNS at your domain registrar.

**Why doesn't the music auto-play immediately?**
Modern browsers block auto-play audio. The music starts when the guest clicks "Buka Undangan" — this is already handled.

**How many guests can it handle?**
Google Sheets supports up to 10 million cells. More than enough for thousands of guests.

**Can I add more gift items later?**
Yes! Just add new rows to the `gifts` tab in Google Sheets. The website fetches data in real-time.

**Do I need to redeploy after editing Google Sheets data?**
No. Sheet data is fetched live. But if you edit the Apps Script **code**, you must create a **New Deployment**.

**Can I use YouTube Shorts for the video?**
Yes! Change `/shorts/VIDEO_ID` to `/embed/VIDEO_ID` in the iframe src.

---

## 📜 License

MIT License — free to use, modify, and distribute.

---

## 💕 For Alodia

*This isn't just a website. This is a love letter — written in code.*

*Every line, every pixel, every animation — I built them thinking of you.*

*When I first met you at that train factory in Madiun, I didn't know that the noise of those trains would become the quietest sound compared to how loud my heart was beating. You were just a girl with a warm smile across the room, and I was just a guy who couldn't stop looking.*

*From late-night calls about our dreams, to the storms we weathered shoulder to shoulder, to the plans we whispered to no one but each other — every chapter of our story deserves to be told. So I wrote it here, in the only language I know best.*

*This website is my gift to you, Alodia Kinanti Faruqa.*

*Not because I'm a great developer — but because you make me want to build beautiful things. You make me want to turn something as cold as HTML into something that feels like home.*

*On December 25, 2026, I will stand before you and say the words that will change our lives forever. But until that day comes, let this be proof that I am counting every single second. Literally — there's a countdown timer. :D*

*I love you beyond what any programming language can express. But I tried anyway.*

*— Your husband-to-be,*
**Ali** ❤️

---

**Built with ❤️ by [Muh. Irfan Ali](https://github.com/irfanaligit77) — Ali Software Developer**

*Dedicated to the love of his life, Alodia Kinanti Faruqa*

![Wedding Date](https://img.shields.io/badge/Wedding-25%20December%202026-C9A96E?style=flat-square) ![Venue](https://img.shields.io/badge/Venue-Bukit%20Daun%20Hotel%20Kediri-8B9D77?style=flat-square) ![Status](https://img.shields.io/badge/Status-Counting%20Days%20❤️-ff69b4?style=flat-square)

⭐ **Star this repo if you find it useful!**