SSC Result PDF Fix
====================

Changed:
- Admin result form now accepts a PDF.
- PDF uploads to private Supabase bucket: ssc-result-files/{candidate_user_id}/...
- The uploaded path is stored in ssc_results.file_path.
- Admin can open the stored PDF through a short-lived signed URL.
- If database insert fails, the uploaded PDF is removed.
- Existing result fields and publish flag are preserved.

Important:
- This patch assumes the ssc_results table has file_path.
- It does not modify or delete unrelated project files.
- The private bucket/policies were already created in Supabase.
