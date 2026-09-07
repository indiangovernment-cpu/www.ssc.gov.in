(() => {
  'use strict';
  const c = window.SSC_CONFIG || {};
  if (!window.supabase || !c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) return;
  const db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[x]));

  function inject() {
    if ($('directAdmitPanel')) return;
    const manager = $('manager');
    if (!manager) return setTimeout(inject, 300);
    const panel = document.createElement('section');
    panel.className = 'panel';
    panel.id = 'directAdmitPanel';
    panel.innerHTML = `
      <h2>Admit Card Upload</h2>
      <p>Admin can upload a PDF directly for a specific candidate. The uploaded PDF will be published to that candidate's portal.</p>
      <div class="row">
        <input id="directAdmitReg" placeholder="Candidate Registration No." autocomplete="off">
        <input id="directAdmitRoll" placeholder="Candidate Roll No." autocomplete="off">
        <button id="directAdmitFind" type="button">Find Candidate</button>
      </div>
      <p id="directAdmitCandidate"></p>
      <div id="directAdmitForm" hidden>
        <div class="row">
          <input id="directAdmitExam" placeholder="Exam Name">
          <input id="directAdmitPost" placeholder="Post Name">
          <input id="directAdmitDate" type="date">
        </div>
        <div class="row">
          <input id="directAdmitFile" type="file" accept="application/pdf">
          <button id="directAdmitUpload" type="button">Upload & Publish Admit Card</button>
        </div>
      </div>
      <p id="directAdmitMsg"></p>`;
    manager.insertBefore(panel, manager.firstElementChild || null);
    $('directAdmitFind').onclick = findCandidate;
    $('directAdmitRoll').addEventListener('keydown', e => { if (e.key === 'Enter') findCandidate(); });
    $('directAdmitReg').addEventListener('keydown', e => { if (e.key === 'Enter') findCandidate(); });
    $('directAdmitUpload').onclick = upload;
  }

  async function findCandidate() {
    const reg = $('directAdmitReg').value.trim();
    const roll = $('directAdmitRoll').value.trim();
    const msg = $('directAdmitMsg');
    if (!reg && !roll) return msg.textContent = 'Enter Registration No. or Roll No.';
    msg.textContent = 'Finding candidate...';
    let q = db.from('ssc_candidates').select('user_id,full_name,email,registration_no,roll_no');
    if (reg) q = q.eq('registration_no', reg);
    else q = q.eq('roll_no', roll);
    const { data, error } = await q.maybeSingle();
    if (error) return msg.textContent = error.message;
    if (!data) { $('directAdmitForm').hidden = true; $('directAdmitCandidate').textContent = ''; return msg.textContent = 'Candidate not found.'; }
    $('directAdmitCandidate').innerHTML = `<b>Selected Candidate:</b> ${esc(data.full_name)} · ${esc(data.email)} · Reg: ${esc(data.registration_no || '')} · Roll: ${esc(data.roll_no || '')}`;
    $('directAdmitCandidate').dataset.userId = data.user_id;
    $('directAdmitForm').hidden = false;
    msg.textContent = 'Candidate found. Select the PDF and upload.';
  }

  async function upload() {
    const candidateId = $('directAdmitCandidate').dataset.userId;
    const file = $('directAdmitFile').files[0];
    const exam = $('directAdmitExam').value.trim();
    const msg = $('directAdmitMsg');
    if (!candidateId) return msg.textContent = 'Find a candidate first.';
    if (!file || !exam) return msg.textContent = 'Exam Name and PDF are required.';
    if (file.type !== 'application/pdf') return msg.textContent = 'Only PDF files are allowed.';
    msg.textContent = 'Uploading and publishing...';
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `admit-cards/${candidateId}/${Date.now()}-${safe}`;
    const up = await db.storage.from('ssc-files').upload(path, file, {upsert:false, contentType:'application/pdf'});
    if (up.error) return msg.textContent = up.error.message;
    const ins = await db.from('ssc_admit_cards').insert({candidate_id:candidateId, exam_name:exam, post_name:$('directAdmitPost').value.trim() || null, exam_date:$('directAdmitDate').value || null, file_path:path, published:true});
    if (ins.error) { await db.storage.from('ssc-files').remove([path]); return msg.textContent = ins.error.message; }
    msg.textContent = 'Admit Card uploaded and published successfully. Candidate can now see this PDF.';
    $('directAdmitFile').value = '';
    $('directAdmitExam').value = '';
    $('directAdmitPost').value = '';
    $('directAdmitDate').value = '';
  }

  window.addEventListener('DOMContentLoaded', inject);
})();