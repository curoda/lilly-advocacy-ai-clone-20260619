# Lilly Advocacy AI — Site Clone

A faithful, pixel-accurate clone of **https://events.helloeiko.com/lilly-advocacy-ai**
(the "Advocacy AI Training Series" event microsite, brought to you by Eli Lilly,
delivered by hello EIKO).

- **Live clone:** https://lilly-advocacy-ai-clone.vercel.app/lilly-advocacy-ai
  (the site root `/` 307-redirects here)
- **Pages cloned:** 34 (1 landing + 10 workshop hubs + 22 dated session/registration
  pages + 1 privacy policy)

## How it was built

The original is a set of self-contained static HTML pages (inline `<style>`,
inline `<script>`, root-absolute asset paths, Google Fonts + Material Symbols via
CDN, and Google Analytics 4 `G-HE4MQ35NWE`). Each page was captured with a real
headless Chromium (Playwright) after running its JavaScript and scrolling to the
bottom, then rebuilt from the rendered DOM.

The only transformation applied to the captured HTML is rewriting same-domain
absolute links (`https://events.helloeiko.com/...`) to root-relative (`/...`) so
navigation stays inside the clone. Every other byte — markup, CSS, scripts,
metadata, analytics, link hrefs — is preserved exactly.

## Repository layout

```
capture/                 Per-page capture spec (one folder per page slug)
  <slug>/
    page.html            Fully rendered HTML after JS
    styles.json          Computed styles for every visible element
    assets.txt           Every media URL (img/srcset/source/bg-image/icons)
    assets/              Downloaded copies of those assets
    fonts.txt            Font families + sources
    embeds.txt           iframes/embeds (none on this site)
    meta.txt             title, meta, OG/Twitter, robots, analytics IDs
    links.txt            Every link with exact href, marked INTERNAL/EXTERNAL
    screenshot-desktop-*.png / screenshot-mobile-*.png   bounded segment captures
build.js                 Generator: capture/<slug>/page.html -> site/<route>/index.html
site/                    Deployable static site (Vercel root)
  lilly-advocacy-ai/index.html
  e/<workshop>/index.html              (10 hubs)
  e/<workshop>-<date>/index.html       (22 sessions)
  privacy/index.html
  index.html                           (root -> /lilly-advocacy-ai redirect)
  <root assets>, tool-logos/*.svg, favicons
  api/contact.js                       serverless endpoint for the Ask form
  vercel.json
DISCREPANCIES.md         Final comparison table, pass log, manual-handling list
```

## Rebuild

```
node build.js            # regenerate site/ from capture/
cd site && vercel --prod # deploy
```

## Manual-handling items (dynamic backends — not reproducible statically)

1. **Homepage "Ask a question" form** → `POST /api/contact`. A serverless function
   is included that accepts the submission and returns success (preserving the
   original UX). It will additionally email the question via Resend if a
   `RESEND_API_KEY` env var is configured; otherwise no email is sent.
2. **Dated session registration forms** (22 pages) → `POST /e/<slug>/register`.
   The original posts to a private registration backend (stores the registrant and
   sends a calendar invite / Zoom link). The form UI is reproduced exactly; wiring a
   real backend is out of scope for a static clone.
3. **Google Analytics 4** (`G-HE4MQ35NWE`) is preserved exactly as in the original
   markup and fires on the clone, reporting to hello EIKO's existing GA4 property.
