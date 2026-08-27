# SSC Portal — Clean Working Release

This package consolidates the existing project into one root structure and removes duplicate numbered/fixed variants.

## Important fixes
- Homepage uses `app.js` + `site.css` + `config.js` consistently.
- Public Result modal reads from `ssc_public_results` (the table where the existing CGL/Stenographer PDFs are stored).
- Result categories filter correctly, and stored PDFs open from the public `ssc-files` bucket.
- Candidate portal reads published candidate results from `ssc_results`.
- Candidate-specific result PDFs use the private `ssc-candidate-files` bucket and short-lived signed URLs.
- Candidate Admin can upload a result PDF and save its path with the candidate result.
- Main Admin HTML/JS element IDs are aligned so login/upload/publish controls work together.
- Compatibility entrypoints redirect old candidate-login/portal URLs to the unified `candidate.html`.

## Verified Supabase objects
Project: `ssc.gov.in` / ref `zbkwyxkvsnwqwdbfqvxb`
Tables used by this release include `ssc_notices`, `ssc_public_results`, `ssc_results`, `ssc_candidates`, `ssc_applications`, `ssc_candidate_documents`, `ssc_candidate_messages`, `ssc_payments`, `ssc_pdf_library`, and `ssc_admins`.
Storage buckets verified: `ssc-files` (public), `ssc-candidate-files` (private), `ssc-result-files` (private).

## Deployment
Upload the contents of this package to the repository root so `index.html` is at the root. Keep the existing Render service connected to the repository. Do not upload secrets or a service-role key.

## Branding note
The package includes a clearly marked demo/unofficial banner and a neutral demo emblem placeholder rather than an official government insignia, so the portal is not presented as an official government site.
