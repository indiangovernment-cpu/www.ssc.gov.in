# SSC Candidate Portal Add-on

This add-on is designed to be added beside the existing SSC website without replacing the current homepage, notices, PDFs, or admin files.

## Roles
- **Admin:** full management of candidates, profiles, applications, results/marks/selection, payment/challan records, messages and candidate emails.
- **Candidate:** can register or be created by admin, log in, reset password, manage only their own profile/application/documents, and permanently view information published to their own dashboard.

## Pages
- `candidate-portal.html` — candidate registration/login/dashboard
- `candidate-admin.html` — admin candidate manager

## Existing config
Both pages expect the same `config.js` used by the existing site (`SSC_CONFIG.SUPABASE_URL` and `SSC_CONFIG.SUPABASE_ANON_KEY`).

## Supabase
The candidate tables/RLS and candidate storage bucket are separate from the existing `ssc_notices` / `ssc-files` system. The existing notice/PDF workflow is not replaced.

## Email
The Edge Function `ssc-send-candidate-email` is deployed and requires your own verified sender/provider credentials (for example Resend) as secrets. Do not use or impersonate `ssc.gov.in` unless you are officially authorized to send from that government domain.


Login update: Candidate login uses Registration Number + Password through the deployed ssc-candidate-login-by-registration Edge Function. Register Now opens the registration form. Forgot Password accepts Registration Number and sends reset to the registered email.
