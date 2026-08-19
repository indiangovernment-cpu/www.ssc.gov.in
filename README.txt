SSC website replacement package

Reference structure: official SSC homepage (ssc.gov.in).

Upload all files to the GitHub repository root. Keep your existing assets folder beside app.js/site.css if you already have the SSC images.

Files:
index.html, app.js, site.css, config.js, admin.html, admin.js, admin.css, supabase_policies.sql

Important:
1. Keep your existing assets folder and images.
2. If admin upload says "row-level security policy" run supabase_policies.sql in Supabase SQL Editor.
3. Create bucket named ssc-files and make it public for public PDF opening/download.
4. Admin account must exist in Supabase Authentication.
