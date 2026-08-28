SSC RESULT LIVE FIX

Replace ONLY these 2 files in the ROOT of the GitHub repository:
1. app.js
2. index.html

DO NOT delete or replace:
- config.js
- assets/
- site.css
- admin files
- candidate files

What this fix does:
- Reads live rows from Supabase public.ssc_results.
- Shows ALL uploaded result files in Result > ALL.
- Shows CGL files only in CGL.
- Shows STENOGRAPHER files only in STENOGRAPHER.
- Opens the correct PDF from the existing ssc-files storage bucket.
- Supports both Storage paths and already-saved full public URLs.
- Adds a cache version to app.js so mobile browsers load the new code after deployment.

After uploading, commit the changes and wait for Render's automatic deploy to finish.
Then open the site and tap Result. Test ALL, CGL and STENOGRAPHER.
