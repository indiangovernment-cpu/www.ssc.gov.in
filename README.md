# SSC Final Ready – Working Reference Build

This build preserves the working SSC website interactions and uses the reference-matched mobile layout/assets.

Included:
- Working navigation/dropdowns
- Working notice PDF/view actions
- Working notice pagination
- Working Quick Links
- Working SSC Calendar month controls
- Working examination cards and resource tabs
- Working FAQ expand/collapse
- Working promo/initiative sliders
- Mobile two-screen responsive layout
- Admin panel files and Supabase setup files

Open `index.html` to view the site. Configure `config.js` for Supabase-backed uploads/authentication when needed.


## Final fixes in this package
- Notice Board pagination is completely hidden when 5 or fewer notices are displayed (so a 2-notice board shows no 1/2/3/4 pagination).
- Quick Links retain colored SVG icons and remain clickable.
- Chairman's Message uses the supplied chairman photo at `assets/chairman.jpg`.
- Existing navigation, modals, calendar, FAQ, sliders, admin/Supabase files and reference assets are preserved.
