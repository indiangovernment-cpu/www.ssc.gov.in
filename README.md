# SSC Final Reference Build

Mobile-first SSC-style website rebuilt against the supplied 50341/50396 video and screenshot references.

## Included
- Video-reference header, hero, maroon information band, notice board, quick links, calendar, browse-by-examinations, promotional carousel, FAQ, initiatives carousel and footer.
- English/Hindi switch.
- Working navigation/dropdowns, search, notice pagination, notice PDF opening, calendar month controls, examination carousel, promotional/initiative rotation, FAQ accordion.
- Result, Admit Card and Answer Key interactive modals.
- Candidate login UI and Admin login link.
- Supabase notice board and admin upload/publish/delete workflow.

## Supabase
`config.js` is preconfigured with the supplied browser-safe publishable key. Run `supabase.sql` once in the Supabase SQL editor, create an admin user in Authentication, then open `admin.html`.

The browser-side key is intended for client use. Never add a service-role/secret key to `config.js` or GitHub.
