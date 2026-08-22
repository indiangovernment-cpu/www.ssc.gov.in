FINAL candidate portal integration

Your existing index.html is an SPA shell. To make Candidate -> Login/Register work, add this one line AFTER app.js:
<script src="candidate-portal-bridge.js"></script>

Keep all existing files unchanged. The candidate portal is separate.
Candidate login uses Registration Number + Password.
Register Now opens the candidate registration form.
