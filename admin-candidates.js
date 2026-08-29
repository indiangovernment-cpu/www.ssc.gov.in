(() => {
  'use strict';
  const c = window.SSC_CONFIG || {};
  if (!window.supabase || !c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) return;
  const db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  let selected = null;

  function inject() {
    if ($('candidateManagerPanel')) return;
    const manager = $('manager');
    if (!manager) return setTimeout(inject, 300);
    const panel = document.createElement('section');
    panel.className = 'panel';
    panel.id = 'candidateManagerPanel';
    panel.innerHTML = `
      <h2>Candidate Management</h2>
      <p>Admin assigns Registration No. and Roll No. Candidate enters personal, education and document details.</p>
      <div class="row"><input id="cmSearch" placeholder="Search name, email or Registration No."><button id="cmSearchBtn" type="button">Search</button></div>
      <div id="cmList"></div>
      <div id="cmEditor" hidden style="margin-top:15px">
        <hr>
        <h3 id="cmName">Candidate</h3>
        <div class="row"><input id="cmReg" placeholder="Registration No. (Admin)"><input id="cmRoll" placeholder="Roll No. (Admin)"><button id="cmSave" type="button">Save Assignment</button></div>
        <p id="cmMsg"></p>
        <h4>Admit Card PDF</h4>
        <div class="row"><input id="cmAdmitExam" placeholder="Exam Name"><input id="cmAdmitPost" placeholder="Post Name"><input id="cmAdmitDate" type="date"></div>
        <div class="row"><input id="cmAdmitFile" type="file" accept="application/pdf"><button id="cmAdmitUpload" type="button">Upload & Publish</button></div>
        <p id="cmAdmitMsg"></p>
        <div id="cmAdmitList"></div>
      </div>`;
    const sessionPanel = Array.from(manager.children).find(x => x.querySelector && x.querySelector('#logout'));
    manager.insertBefore(panel, sessionPanel || null);
    $('cmSearchBtn').onclick = search;
    $('cmSearch').addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
    $('cmSave').onclick = saveAssignment;
    $('cmAdmitUpload').onclick = uploadAdmit;
  }

  async function search() {
    const q = $('cmSearch').value.trim();
    $('cmList').textContent = 'Searching...';
    let query = db.from('ssc_candidates').select('*').order('created_at', {ascending:false}).limit(50);
    if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,registration_no.ilike.%${q}%`);
    const {data, error} = await query;
    if (error) return $('cmList').textContent = error.message;
    $('cmList').innerHTML = (data || []).map(x => `<article class="admin-file-row"><div class="file-info"><b>${esc(x.full_name || 'Candidate')}</b><small>${esc(x.email)} · Reg: ${esc(x.registration_no || 'NOT ASSIGNED')} · Roll: ${esc(x.roll_no || 'NOT ASSIGNED')}</small></div><button type="button" data-cm-id="${esc(x.user_id)}">Open</button></article>`).join('') || '<p>No candidates found.</p>';
    document.querySelectorAll('[data-cm-id]').forEach(b => b.onclick = () => openCandidate(b.dataset.cmId));
  }

  async function openCandidate(id) {
    const {data, error} = await db.from('ssc_candidates').select('*').eq('user_id', id).single();
    if (error) return $('cmMsg').textContent = error.message;
    selected = data;
    $('cmEditor').hidden = false;
    $('cmName').textContent = `${data.full_name || 'Candidate'} — ${data.email || ''}`;
    $('cmReg').value = data.registration_no || '';
    $('cmRoll').value = data.roll_no || '';
    $('cmMsg').textContent = `Registration: ${data.registration_no || 'NOT ASSIGNED'} | Roll: ${data.roll_no || 'NOT ASSIGNED'}`;
    await loadAdmits();
  }

  async function saveAssignment() {
    if (!selected) return;
    const reg = $('cmReg').value.trim(), roll = $('cmRoll').value.trim();
    if (!reg || !roll) return $('cmMsg').textContent = 'Registration No. and Roll No. are required.';
    const {data,error} = await db.from('ssc_candidates').update({registration_no:reg, roll_no:roll, updated_at:new Date().toISOString()}).eq('user_id', selected.user_id).select().single();
    if (error) return $('cmMsg').textContent = error.message;
    selected = {...selected,...data};
    $('cmMsg').textContent = `Saved. Registration No.: ${data.registration_no} | Roll No.: ${data.roll_no}`;
    search();
  }

  async function uploadAdmit() {
    if (!selected) return $('cmAdmitMsg').textContent = 'Open a candidate first.';
    const file = $('cmAdmitFile').files[0], exam = $('cmAdmitExam').value.trim();
    if (!file || !exam) return $('cmAdmitMsg').textContent = 'Exam name and PDF are required.';
    if (file.type !== 'application/pdf') return $('cmAdmitMsg').textContent = 'Only PDF is allowed.';
    $('cmAdmitMsg').textContent = 'Uploading...';
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `admit-cards/${selected.user_id}/${Date.now()}-${safe}`;
    const up = await db.storage.from('ssc-files').upload(path, file, {upsert:false, contentType:'application/pdf'});
    if (up.error) return $('cmAdmitMsg').textContent = up.error.message;
    const ins = await db.from('ssc_admit_cards').insert({candidate_id:selected.user_id, exam_name:exam, post_name:$('cmAdmitPost').value.trim() || null, exam_date:$('cmAdmitDate').value || null, file_path:path, published:true}).select().single();
    if (ins.error) { await db.storage.from('ssc-files').remove([path]); return $('cmAdmitMsg').textContent = ins.error.message; }
    $('cmAdmitMsg').textContent = 'Admit Card uploaded and published.';
    $('cmAdmitFile').value = '';
    await loadAdmits();
  }

  async function loadAdmits() {
    if (!selected) return;
    const {data,error} = await db.from('ssc_admit_cards').select('*').eq('candidate_id', selected.user_id).order('created_at',{ascending:false});
    if (error) return $('cmAdmitList').textContent = error.message;
    $('cmAdmitList').innerHTML = (data || []).map(x => `<article class="admin-file-row"><div class="file-info"><b>${esc(x.exam_name)}</b><small>${esc(x.post_name || '')} · ${x.published ? 'Published' : 'Hidden'}</small></div>${x.file_path ? `<a target="_blank" rel="noopener" href="${esc(db.storage.from('ssc-files').getPublicUrl(x.file_path).data.publicUrl)}">Open PDF</a>` : ''}</article>`).join('') || '<p>No Admit Card uploaded.</p>';
  }

  window.addEventListener('DOMContentLoaded', inject);
})();
