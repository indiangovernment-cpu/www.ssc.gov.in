SSC replacement package.
Replace the matching root code files. KEEP your existing assets folder/images.
Run supabase_setup.sql once in Supabase SQL Editor before testing uploads.
This adds the Storage INSERT policy that fixes the RLS upload error.
Do not put a Supabase service_role/secret key in config.js; use the publishable/anon key only.