SSC FINAL CLEAN PROJECT
=======================

This package consolidates the SSC website + candidate portal + admin tools into one uploadable static project.

Main:
- index.html / app.js / site.css / config.js
- assets/

Admin content manager:
- admin.html / admin.js / admin.css

Candidate portal:
- candidate.html / candidate.js / candidate.css
- candidate-admin.html / candidate-admin.js / candidate-admin.css
- candidate_setup.sql

Database:
- supabase_setup.sql

Important:
- config.js contains only the browser-safe publishable/anon key.
- No service_role key is included.
- Result PDFs use the private ssc-result-files bucket and signed URLs.
- Do not delete the existing GitHub repository until this package has been uploaded and Render has been verified.
