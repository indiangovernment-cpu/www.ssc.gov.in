(() => {
  'use strict';
  const cfg = window.SSC_CONFIG || {};
  const db = (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase)
    ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } })
    : null;
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  async function loadUploadedAdmitCards() {
    const el = $('admitList');
    if (!el || !db) return;
    const { data: sessionData } = await db.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) return;

    el.innerHTML = '<div class="item">Loading Admit Card…</div>';
    const { data: cards, error } = await db.from('ssc_admit_cards')
      .select('*')
      .eq('candidate_id', user.id)
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      el.innerHTML = `<div class="item">${esc(error.message)}</div>`;
      return;
    }
    if (!cards?.length) {
      el.innerHTML = '<div class="item"><h3>Admit Card not published yet</h3><p class="meta">Your Admit Card will appear here as soon as Admin uploads and publishes it.</p></div>';
      return;
    }

    const parts = [];
    for (const card of cards) {
      let url = '';
      if (card.file_path) {
        const signed = await db.storage.from('ssc-files').createSignedUrl(card.file_path, 600);
        if (!signed.error) url = signed.data?.signedUrl || '';
      }
      const date = card.exam_date ? new Date(card.exam_date + 'T00:00:00').toLocaleDateString('en-GB') : '';
      parts.push(`<article class="item admit-uploaded-card">
        <div class="itemhead"><div><h3>${esc(card.exam_name || 'Admit Card')}</h3>
        <div class="meta">${esc(card.post_name || '')}${date ? ' · Exam Date: ' + esc(date) : ''}${card.exam_city ? ' · Centre: ' + esc(card.exam_city) : ''}</div></div>
        <span class="pill">Published</span></div>
        ${url ? `<div style="margin-top:12px"><iframe title="${esc(card.exam_name || 'Admit Card')}" src="${esc(url)}" style="width:100%;height:720px;border:1px solid #d9dee8;border-radius:8px;background:#fff"></iframe></div>
        <div class="actions" style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><a class="primary" href="${esc(url)}" target="_blank" rel="noopener">Open / View PDF</a><a class="outline" href="${esc(url)}" target="_blank" rel="noopener" download>Download Admit Card</a></div>`
        : '<p class="meta">Admit Card file is unavailable. Please contact Admin.</p>'}
      </article>`);
    }
    el.innerHTML = parts.join('');
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadUploadedAdmitCards();
    document.addEventListener('click', e => {
      const button = e.target.closest('[data-section="admit"]');
      if (button) setTimeout(loadUploadedAdmitCards, 50);
    });
  });
})();
