SSC CANDIDATE SECTION - FIXED PACKAGE

ROOT CAUSE FIXED
----------------
The SSC homepage's candidate-login route was opening a demo/generic login page instead of the real candidate portal. The old candidate login button also only displayed a placeholder message.

This package changes both paths to open candidate.html directly.

FILES TO UPLOAD
---------------
1. candidate.html
2. candidate.css
3. candidate.js
4. candidate-portal.html
5. candidate-login.html
6. candidate-admin.html
7. candidate_setup.sql
8. config.js
9. app.js
10. app-fixed.js

IMPORTANT
---------
- Replace the website's existing app.js with the app.js in this package if your index.html loads app.js.
- If your index.html loads app-fixed.js, replace that file instead.
- Keep index.html, site.css and the assets folder.
- candidate.html is the actual candidate portal.
- candidate-login.html and candidate-portal.html are direct aliases to candidate.html.

SUPABASE
--------
The browser config uses only the supplied publishable key.
Candidate data is protected with per-user RLS policies in candidate_setup.sql.
Candidate documents use a private Storage bucket and signed URLs.

If the database already contains the policies from the previous setup, candidate_setup.sql is safe to run because it only removes/recreates policies beginning with ssc_portal_.
