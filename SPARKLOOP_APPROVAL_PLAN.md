SparkLoop Approval — Newsletter Archive Plan

Owner: DailyHush Engineering
Date: 2025‑09‑10

Goal

- Provide public, online‑viewable evidence that DailyHush publishes a recurring newsletter so SparkLoop can verify and approve our Partner Network application.

What SparkLoop Asked For

- Reply with ONE of:
  - A link to an online archive of your newsletter editions; or
  - Links to online‑viewable versions of your three most recent newsletter editions; or
  - Forward your three most recent editions to support@sparkloop.app (will be handled separately).

Deliverables Implemented (Blog)

- Public archive page at: /newsletters
- Three recent editions:
  - /newsletters/sept-9-2025
  - /newsletters/sept-2-2025
  - /newsletters/aug-26-2025
- Footer link to the archive (Navigation → “Archive”).
- Sitemap updated to include the archive and all three editions for easy discovery.

Repo Changes (high‑level)

- src/content/newsletters.ts — central data for editions (slug, title, date, HTML content)
- src/pages/newsletters/index.tsx — archive listing
- src/pages/newsletters/[slug].tsx — individual edition page (renders by slug)
- src/app/routes.tsx — routes added for /newsletters and /newsletters/:slug
- src/components/layout/Footer.tsx — “Archive” link added
- scripts/generate-sitemap.ts — routes for archive + editions added

How This Satisfies SparkLoop

- We can respond with a single link: https://<your-domain>/newsletters (preferred)
- Or list the three edition URLs directly in the email reply (also valid per their instructions)

Content Guidelines We Followed

- Each edition contains:
  - Clear title and publication date
  - Short editor’s note / headline insight
  - Links to on‑site posts (internal) and/or useful resources (external)
  - A simple “Subscribe” call‑to‑action and a link back to the archive

Operational Checklist

1) Build and deploy
   - npm run build
   - Ensure /newsletters and each /newsletters/* URL render on production

2) Verify public access
   - Load pages in an incognito window (no auth required)
   - Confirm no 404s / no console errors

3) Basic QA
   - Mobile viewport renders archive list and article content
   - Links resolve (internal blog links, subscribe page)
   - Footer shows “Archive” link

4) Sitemap and indexing
   - scripts/generate-sitemap.ts now includes the archive + editions
   - Netlify serves dist/sitemap.xml after build (confirm in deploy logs)
   - Optional: update Search Console once deployed (not required for SparkLoop)

5) Hand‑off for the application
   - Reply to SparkLoop with one of the two formats below

Resubmission Email (choose one)

- Option A: Archive link
  Subject: Newsletter archive for DailyHush — Partner Network application
  Body:
  Hi SparkLoop team — here’s the public archive of our newsletter editions:
  https://<your-domain>/newsletters
  Thanks for the review!

- Option B: Three recent editions
  Subject: Three recent newsletter editions — DailyHush
  Body:
  Hi SparkLoop team — here are the three most recent online‑viewable editions:
  https://<your-domain>/newsletters/sept-9-2025
  https://<your-domain>/newsletters/sept-2-2025
  https://<your-domain>/newsletters/aug-26-2025
  Thanks for the review!

Future Enhancements (nice‑to‑have, not required)

- Add Open Graph meta tags for better link previews
- Add pagination once the archive grows
- Migrate newsletter data to a CMS or markdown files if we scale volume
- Track “Read edition” and “Subscribe” clicks via analytics events

