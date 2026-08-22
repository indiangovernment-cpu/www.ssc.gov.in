# SSC Candidate Portal Add-on

This is an additive upgrade. The existing homepage, notices, images, and current admin notice workflow are not replaced.

## Included
- candidate-portal.html / candidate-portal.js / candidate-portal.css
- candidate-admin.html / candidate-admin.js / candidate-admin.css
- candidate-login-bridge.js
- supabase_candidate_portal.sql (reference)
- Existing Supabase project was upgraded with candidate tables, RLS and a private candidate file bucket.
- Edge Function `ssc-admin-create-candidate` securely creates candidate Auth accounts from the admin panel.

## Connect to current website
Add this one line after `app.js` in `index.html`:
<script src="candidate-login-bridge.js"></script>

This only redirects Candidate Login, Forgot Password and Register Now to candidate-portal.html. The existing site UI and notice system remain intact.

## Admin
Open `candidate-admin.html` and use the same Supabase admin account already used for the existing admin page.

Admin can:
- create candidate accounts
- set registration/roll number and profile details
- search candidates
- edit candidate details
- publish marks, selection status, rank and remarks
- publish candidate-specific messages

## Candidate
Candidate can:
- login
- forgot password by email
- see only their own profile/applications/payments/documents
- complete/save an application form
- upload documents
- see only published marks/results/messages
- see challan/payment status

## Important
Use a real, authorized administrator account and do not present this private portal as the official Government of India/SSC website unless you have authorization. The current public site is kept unchanged by this add-on.


## Email notifications
The `ssc-send-candidate-email` Supabase Edge Function is deployed and protected by admin authentication. To actually send notification emails, configure these Edge Function secrets in Supabase: `RESEND_API_KEY` and `SSC_FROM_EMAIL`. Use a domain/email address that you own and have verified with your email provider. Do not use `ssc.gov.in` unless you are formally authorized to send mail from that government domain. Candidate password reset continues to use Supabase Auth email settings.
