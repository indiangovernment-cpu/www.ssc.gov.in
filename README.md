# SSC Video-Match Functional Website

This build uses the supplied 50288.mp4 as the visual/interaction reference.

## Included
- Video-reference mobile layout and proportions
- Hindi/English toggle
- Home, Chairman's Message, Tender, RTI, About Us
- For Candidates dropdown: Apply Online, Admit Card, Answer Key, Result, Candidate Login, OTR, Correction Window, Exam City/Intimation, Option-cum-Preference
- Notice Board pagination and PDF/view actions
- Quick Links with working modals/pages
- SSC Calendar previous/next month controls
- Browse by Examinations carousel and resource tabs
- Rotating promotional cards and Other Initiatives
- FAQ accordion
- Candidate/Admin login UI
- Supabase-backed notice loading
- Admin upload -> publish -> public Notice Board -> delete workflow

## Supabase
The supplied publishable/anon key is already in config.js. Run supabase.sql in the same Supabase project before using the admin manager.

Open admin.html, sign in with a Supabase Auth user, upload a file, then publish a notice.
