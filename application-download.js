(() => {
  'use strict';
  const boot = () => {
    const db = window.__sscPdfDb || null;
    if (!db || window.__sscApplicationDownloadHooked) return;
    window.__sscApplicationDownloadHooked = true;
    document.addEventListener('click', async (event) => {
      const btn = event.target.closest('[data-application-pdf]');
      if (!btn) return;
      const applicationId = btn.getAttribute('data-application-pdf');
      if (!applicationId || typeof window.sscGenerateApplicationPdf !== 'function') {
        alert('Application PDF service is not ready. Please refresh the page.');
        return;
      }
      const old = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Generating PDF…';
      try {
        const session = await db.auth.getSession();
        const user = session.data?.session?.user;
        if (!user) throw new Error('Please login again.');
        const r = await db.from('ssc_applications').select('*').eq('id', applicationId).eq('candidate_id', user.id).maybeSingle();
        if (r.error) throw r.error;
        if (!r.data) throw new Error('Application not found.');
        if (r.data.status !== 'submitted') throw new Error('Application PDF is available after submission.');
        await window.sscGenerateApplicationPdf(r.data);
      } catch (error) {
        console.error('Application PDF download:', error);
        alert(error?.message || 'Unable to generate application PDF.');
      } finally {
        btn.disabled = false;
        btn.textContent = old;
      }
    });
  };
  window.addEventListener('DOMContentLoaded', () => setTimeout(boot, 1200));
  setInterval(boot, 1500);
})();
