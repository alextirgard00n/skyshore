# Skyshore Recordings

Website for **Skyshore Recordings**, a mixing and mastering studio in Honolulu, Hawaii, specializing in metal, rock, and pop.

**Live site:** [www.skyshorerecordings.com](https://www.skyshorerecordings.com)

![Skyshore Recordings](media/share-image.jpg)

## About

A single-page site built with plain HTML, CSS, and JavaScript. It has no frameworks and no build step. It's hosted on GitHub Pages with a custom domain.

### Sections

- **Home**: hero with a looping background video and a "Request a Quote" button
- **Services**: mixing and mastering
- **My Work**: self-hosted music player with a portfolio of mixes
- **About**: bio
- **Contact**: project inquiry form that sends email through EmailJS

## Project structure

```
├── index.html          # The whole page
├── style.css           # Site styles
├── app.js              # Mobile menu and service card heights
├── scroll.js           # Smooth scrolling, header, back-to-top button
├── music-player.js     # Music player
├── music-player.css    # Music player styles
├── contact-form.js     # Contact form (EmailJS)
├── CNAME               # Custom domain for GitHub Pages
└── media/
    ├── audio/          # Portfolio tracks (.mp3)
    ├── covers/         # Cover art for each track (.jpg)
    ├── backgrounds/    # Hero video, poster, and section backgrounds
    ├── fonts/          # Gilroy (.woff2)
    ├── logo/           # Logos and favicon
    ├── svgs/ pngs/     # Icons
    └── share-image.jpg # Link preview image (1200×630)
```

## Running locally

No install needed. Serve the folder with any local web server:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Adding a track to the music player

1. Put the audio file in `media/audio/` (MP3, 320 kbps works well).
2. Put the cover art in `media/covers/` (square JPG, around 500–1000px).
3. Add an entry to the track list in `index.html`, inside the "My Work" section:

```json
{ "title": "Song Name", "artist": "Reamped, Mixed, Mastered",
  "src": "media/audio/song-name.mp3", "cover": "media/covers/song-name.jpg" }
```

Tracks play in the order listed. File names are case-sensitive on GitHub Pages, so the paths must match exactly.

## Contact form

The form sends through [EmailJS](https://www.emailjs.com/). The service ID, template ID, and public key are at the top of `contact-form.js`. The form sends three fields: `name`, `email`, and `message`.

Spam protection uses a hidden field plus a minimum fill time, so there's no CAPTCHA.

## Deploying

Merging into `main` publishes the site automatically through GitHub Pages, usually within a minute or two.

### Cache-busting

The CSS and JS links in `index.html` end with a version number, like `style.css?v=3`. When you change one of those files, bump its number so returning visitors get the new version right away instead of a cached copy.

## Credits

- Fonts: Gilroy
- Back-to-top icon: [Font Awesome Free](https://fontawesome.com) (CC BY 4.0)

© Skyshore Recordings. All rights reserved.
