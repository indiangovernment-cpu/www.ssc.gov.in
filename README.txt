SSC COMPLETE PACKAGE — RESULT PDF UPLOAD FIX

Included:
- index.html / site.css / app.js : public SSC website
- admin.html / admin.css / admin.js : admin login + PDF upload + notice publishing + result publishing
- candidate.html / candidate.css / candidate.js : candidate portal files
- config.js : current Supabase URL + publishable key
- supabase_setup.sql : REQUIRED for public notices/results and ssc-files bucket

What is fixed:
1. Admin uploads a PDF.
2. Admin selects a Result Category.
3. Admin enters Result Title and Date.
4. Admin clicks Publish Result.
5. Public website Result button loads records from Supabase by category.
6. Clicking PDF opens the uploaded PDF.

IMPORTANT:
Run supabase_setup.sql in Supabase SQL Editor before testing.
Do not put a service_role/secret key in config.js.

Upload these files to the same project root. Keep the existing assets/ folder unchanged because the website references the existing images.

Candidate portal database setup was kept separate from this public-result setup because both older project versions used different ssc_results table structures.
