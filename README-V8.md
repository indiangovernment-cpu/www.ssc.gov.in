# SSC Candidate Portal v8

This package fixes the candidate registration/login flow and adds robust bridges for the existing login screen.

Files are additive; keep the existing site's config.js. The portal expects `SSC_CONFIG.SUPABASE_URL` and `SSC_CONFIG.SUPABASE_ANON_KEY` from that existing config.

Candidate flow:
Registration Number + Password -> Login -> Dashboard
New User? Register Now -> Candidate registration -> Login
Forgot Password -> secure email reset

To wire the existing page's visible Candidate/Register buttons, load `candidate-portal-bridge.js` on the existing index page (after the existing scripts). This bridge only redirects candidate buttons to candidate-portal.html and does not alter notices/admin logic.
