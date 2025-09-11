DailyHush — Homepage vs Archives Strategy

Why this change

- SparkLoop verification: A clear, public archive of newsletter issues signals consistent publishing.
- Clarity for visitors: Position DailyHush as a newsletter-first brand from the moment someone lands on the homepage.
- Conversion trust: Showing recent issues builds credibility before asking for an email.

What changed (summary)

- Homepage (/)
  - After the hero, we now show “Latest 3 Editions” (cards linking to each issue under `/archives/:slug`).
  - Added “View All Editions” link to `/archives`.
  - Replaced previous blog “Latest stories” section.

- Archives (/archives)
  - Displays the full list of newsletter issues (newest first).
  - Keeps the opt-in and CTA sections.

Technical notes

- Edition data: `src/content/newsletters.ts`
- Homepage section: `src/pages/index.tsx` (maps the top 3 editions)
- Archive page: `src/pages/newsletters/index.tsx` (maps all editions)
- Routes:
  - `/archives` and `/archives/:slug` serve the archive and editions
  - Legacy `/newsletters*` paths redirect to `/archives*`

Benefits

- Stronger first impression for SparkLoop reviewers and new visitors
- Clear distinction: Homepage = preview, Archives = complete history
- Easy to maintain: add new issues in one place and both pages stay up to date

Next content step (optional)

- Seed 6–8 additional backdated issues (titles, dates, blurbs) to make `/archives` feel active across weeks. We can provide a suggested content calendar on request.

