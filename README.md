# SSC Final Reference Build

This is a static, mobile-first SSC portal recreation based on the supplied 49846.mp4 reference recording. It reproduces the visible structure and interaction patterns: header/nav dropdowns, hero building, notice board, quick links, calendar, Browse by Examinations, image/promo carousel area, FAQs, initiatives, footer, result modal, candidate/admin login modal, search, and dedicated calendar/tender/exam views.

## Upload to GitHub
Keep this structure exactly:
- index.html
- site.css
- app.js
- admin.html
- admin.css
- admin.js
- config.js
- config.example.js
- supabase.sql
- assets/ (do not move the images)

## Render
Use a Static Site. Build command can be empty. Publish directory is the repository root.

## Shared admin/file uploads
A static website cannot make a browser-local upload visible to every visitor by itself. For shared publishing, create a Supabase project, put its URL + publishable/anon key in `config.js`, create the `ssc-files` Storage bucket, and run `supabase.sql`. The admin page is then the place to connect the authenticated upload workflow.
