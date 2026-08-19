# SSC Mobile Reference + Supabase Ready Build

This package keeps the compact SSC-style mobile layout and includes working navigation/modals, notice board, candidate services, exam resources, search, FAQ, calendar, login/register UI, and Supabase-backed shared notices/files.

## Supabase already configured
`config.js` contains the supplied project URL and publishable/anon key. Do not replace it with a service_role/secret key.

## One-time Supabase setup
Run `supabase.sql` in the Supabase SQL Editor. Then create your admin user in Authentication > Users.

## Admin
Open `admin.html`, sign in with the Supabase admin user, upload a PDF/file, enter the notice details, and click **Save Notice**. The notice then appears on the public home page for all visitors.

## Deployment
Static hosting is enough. Publish the folder containing `index.html` at the repository root.
