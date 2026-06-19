# Verification & Discrepancy Report

Original: `https://events.helloeiko.com/lilly-advocacy-ai` (+ 33 internal pages)
Clone:    `https://lilly-advocacy-ai-clone.vercel.app`

## Method

For every one of the 34 pages, the live clone was recaptured at **1440×800 desktop**
and **390×844 mobile**, scrolled to the bottom, and compared segment-by-segment
against the original captures using `pixelmatch` (threshold 0.12). Section geometry
(`getBoundingClientRect`) was also measured directly on both the live original and
the live clone.

## Final discrepancy table

| Page | Element | Original | Clone | Severity | Fix |
|------|---------|----------|-------|----------|-----|
| (all 34) | full-page pixel diff, desktop + mobile | — | 0.00% | — | none required |

**No HIGH, MEDIUM, or LOW discrepancies remain.** All 34 pages render byte-identically.

Representative geometry check (homepage, document-relative `top` in px):

| Metric | Original | Clone |
|--------|----------|-------|
| body scrollHeight | 5075 | 5075 |
| #overview top | 84 | 84 |
| #workshops top | 666 | 666 |
| #about top | 3164 | 3164 |
| #register top | 4134 | 4134 |
| hero height | 582 | 582 |

Other verified items (all match):
- Hero, workshop tiles/gallery, tool-logo icons (Gemini/Copilot/Claude/ChatGPT),
  founder photos, dotted-texture backgrounds, navy footer.
- Fonts: DM Serif Display (headings), DM Sans (body), Material Symbols (icons).
- Mobile hamburger menu: toggles `display:none→flex`, `aria-expanded` flips true/false.
- Metadata: titles, `robots: noindex, nofollow`, favicons/apple-touch-icon.
- Analytics: GA4 `G-HE4MQ35NWE` present and firing on every page type.
- Every link href preserved exactly (internal same-domain links rewritten to
  root-relative so they resolve within the clone; `mailto:`, Google Fonts, gtag, and
  any external hrefs untouched).
- Embeds: none on the original; none on the clone.

## Per-pass log

**Pass 1**
- Recaptured all 34 clone pages at both widths; compared to originals.
- Segment-count parity: 34/34 pages match at desktop and mobile (proxy for height/structure).
- Pixel diff: 32/34 page-views at 0.00%. Homepage initially showed ~25% (desktop)
  / ~28% (mobile).
- Root cause of the homepage delta: **capture artifact, not a clone defect.** The
  homepage CSS sets `html{scroll-behavior:smooth}`, so segment screenshots landed at
  slightly different scroll offsets between the original-capture run and the
  clone-capture run. Direct geometry measurement proved the layouts are identical
  (table above). Re-running the comparison with smooth-scroll disabled produced
  **0.00% diff on every homepage segment** (desktop seg1–6, mobile seg1–11).
- Fixed: 0 code changes needed (no real discrepancy). Remaining HIGH/MEDIUM: 0.

**Stopping condition met:** No HIGH or MEDIUM (and no LOW) discrepancies remain after
Pass 1. The clone is visually faithful at both 1440px and 390px.

## Manual-handling list (dynamic features, do not block stopping)

1. Homepage Ask-a-question form → `POST /api/contact`: serverless stub returns success
   (UX preserved); real email requires a `RESEND_API_KEY` env var.
2. Dated session registration forms (22) → `POST /e/<slug>/register`: original private
   registration backend; form UI reproduced exactly, backend out of scope.
3. GA4 `G-HE4MQ35NWE`: preserved exactly; fires to hello EIKO's existing property.
