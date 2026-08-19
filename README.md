# SSC Video-Match Build

This build uses the supplied 50288.mp4 recording as the primary reference for the mobile layout and interaction flow.

## Includes
- Mobile-first SSC-style header/navigation
- English/Hindi switch
- For Candidates, Tender, RTI and About Us dropdowns
- Chairman's Message, Tender and Login pages
- Result / Admit Card / Answer Key modal workflows
- Notice Board with pagination and Supabase-backed notices
- Quick Links
- SSC Calendar
- Browse by Examinations with auto/interactive carousel dots
- Auto-rotating promotional image carousel
- Auto-rotating Other Initiatives carousel
- FAQ accordion
- Supabase admin login, file upload, notice publishing, listing and deletion

## Setup
1. Keep the assets folder unchanged.
2. Run supabase.sql once in the Supabase SQL editor.
3. Create an admin user in Supabase Authentication → Users.
4. Open admin.html to upload/publish notices.
5. Deploy the folder as a static site on Render/Netlify/Vercel/GitHub Pages.

The browser-side key in config.js is the publishable/anon key only; never put a service_role key in a browser package.
