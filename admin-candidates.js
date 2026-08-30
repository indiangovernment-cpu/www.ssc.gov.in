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
      <p>Create candidate accounts, assign Registration/Roll No., review submitted details and documents, and publish candidate-specific admit cards/results.</p>
      <h3>Create Candidate Account</h3>
      <div class="row"><input id="cmNewName" placeholder="Full Name"><input id="cmNewEmail" type="email" placeholder="Email"><input id="cmNewPassword" type="password" placeholder="Initial Password (8+ chars)"></div>
      <div class="row"><input id="cmNewReg" placeholder="Registration No. (Admin)"><input id="cmNewRoll" placeholder="Roll No. (Admin)"><input id="cmNewPhone" placeholder="Mobile"></div>
      <button id="cmCreate" type="button">Create Candidate</button><p id="cmCreateMsg"></p>
      <hr>
      <h3>Find Candidate</h3>
      <div class="row"><input id="cmSearch" placeholder="Name, email or Registration No."><button id="cmSearchBtn" type="button">Search</button></div>
      <div id="cmList"></div>
      <div id="cmEditor" hidden style="margin-top:15px">
        <hr><h3 id="cmName">Candidate</h3>
        <div class="row"><input id="cmReg" placeholder="Registration No. (Admin)"><input id="cmRoll" placeholder="Roll No. (Admin)"><button id="cmSave" type="button">Save Assignment</button></div>
        <p id="cmMsg"></p>
        <h4>Candidate Details</h4><div id="cmDetails" class="admin-file-row"></div>
        <h4>Submitted Documents</h4><div id="cmDocs"></div>
        <h4>Candidate Result</h4>
        <div class="row"><input id="cmResultExam" placeholder="Exam Name"><input id="cmResultPost" placeholder="Post Name"><input id="cmResultMarks" type="number" step="0.01" placeholder="Marks"><input id="cmResultMax" type="number" step="0.01" placeholder="Max Marks"></div>
        <div class="row"><input id="cmResultRank" placeholder="Rank"><input id="cmResultStatus" placeholder="Selection Status"><input id="cmResultDate" type="date"></div>
        <input id="cmResultRemarks" placeholder="Remarks" style="width:100%;margin:6px 0"><button id="cmResultSave" type="button">Publish Candidate Result</button><p id="cmResultMsg"></p><div id="cmResults"></div>
        <h4>Admit Card PDF</h4>
        <div class="row"><input id="cmAdmitExam" placeholder="Exam Name"><input id="cmAdmitPost" placeholder="Post Name"><input id="cmAdmitDate" type="date"></div>
        <div class="row"><input id="cmAdmitFile" type="file" accept="application/pdf"><button id="cmAdmitUpload" type="button">Upload & Publish</button></div>
        <p id="cmAdmitMsg"></p><div id="cmAdmitList"></div>
      </div>`;

    // Keep Candidate Management near the top of the manager, immediately before
    // the public Result publisher, instead of leaving it at the very bottom.
    const resultHeading = Array.from(manager.querySelectorAll('h2')).find(h => h.textContent.trim() === 'Publish Result');
    const resultPanel = resultHeading ? resultHeading.closest('.panel') : null;
    manager.insertBefore(panel, resultPanel || manager.firstElementChild || null);

    $('cmCreate').onclick = createCandidate;
    $('cmSearchBtn').onclick = search;
    $('cmSearch').addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
    $('cmSave').onclick = saveAssignment;
    $('cmResultSave').onclick = saveCandidateResult;
    $('cmAdmitUpload').onclick = uploadAdmit;
  }

  async function createCandidate() {
    const body = {
      full_name: $('cmNewName').value.trim(), email: $('cmNewEmail').value.trim(), password: $('cmNewPassword').value,
      registration_no: $('cmNewReg').value.trim(), roll_no: $('cmNewRoll').value.trim() || null, phone: $('cmNewPhone').value.trim() || null
    };
    if (!body.full_name || !body.email || !body.password || !body.registration_no) return $('cmCreateMsg').textContent = 'Name, email, password and Registration No. are required.';
    $('cmCreateMsg').textContent = 'Creating candidate...';
    const { data: s } = await db.auth.getSession();
    const token = s?.session?.access_token;
    if (!token) return $('cmCreateMsg').textContent = 'Admin session expired. Login again.';
    const rr = await fetch(`${c.SUPABASE_URL}/functions/v1/ssc-admin-create-candidate`, {method:'POST', headers:{'Content-Type':'application/json', apikey:c.SUPABASE_ANON_KEY, Authorization:`Bearer ${token}`}, body:JSON.stringify(body)});
    const out = await rr.json().catch(() => ({}));
    if (!rr.ok) return $('cmCreateMsg').textContent = out.error || 'Candidate creation failed.';
    $('cmCreateMsg').textContent = `Candidate created. Registration No.: ${out.registration_no}`;
    ['cmNewName','cmNewEmail','cmNewPassword','cmNewReg','cmNewRoll','cmNewPhone'].forEach(id => { if ($(id)) $(id).value = ''; });
    await search();
  }

  async function search() {
    const q = $('cmSearch').value.trim();
    $('cmList').textContent = 'Searching...';
    let query = db.from('ssc_candidates').select('*').order('created_at', {ascending:false}).limit(50);
    if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,registration_no.ilike.%${q}%`);
    const {data, error} = await query;
    if (error) return $('cmList').textContent = error.message;
    $('cmList').innerHTML = (data || []).map(x => `<article class="admin-file-row"><div class="file-info"><b>${esc(x.full_name || 'Candidate')}</b><small>${esc(x.email)} · Reg: ${esc(x.registration_no || 'NOT ASSIGNED')} · Roll: ${esc(x.roll_no || 'NOT ASSIGNED')} · ${esc(x.status || '')}</small></div><button type="button" data-cm-id="${esc(x.user_id)}">Open</button></article>`).join('') || '<p>No candidates found.</p>';
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
    $('cmDetails').innerHTML = `<div><b>Personal:</b> ${esc(data.full_name)} · ${esc(data.phone || '')} · DOB ${esc(data.dob || '')} · Category ${esc(data.category || '')}</div><div><b>Address:</b> ${esc(data.address || '')}, ${esc(data.city || '')}, ${esc(data.state || '')} ${esc(data.pincode || '')}</div><div><b>Education:</b> ${esc(JSON.stringify(data.education_details || {}))}</div>`;
    await Promise.all([loadDocuments(), loadResults(), loadAdmits()]);
  }

  async function saveAssignment() {
    if (!selected) return;
    const reg = $('cmReg').value.trim(), roll = $('cmRoll').value.trim();
    if (!reg || !roll) return $('cmMsg').textContent = 'Registration No. and Roll No. are required.';
    const {data,error} = await db.from('ssc_candidates').update({registration_no:reg, roll_no:roll, updated_at:new Date().toISOString()}).eq('user_id', selected.user_id).select().single();
    if (error) return $('cmMsg').textContent = error.message;
    selected = {...selected,...data}; $('cmMsg').textContent = `Saved. Registration No.: ${data.registration_no} | Roll No.: ${data.roll_no}`; await search();
  }

  async function loadDocuments() {
    const el = $('cmDocs');
    const {data,error} = await db.from('ssc_candidate_documents').select('*').eq('candidate_id', selected.user_id).order('created_at',{ascending:false});
    if (error) return el.textContent = error.message;
    el.innerHTML = (data || []).map(x => `<article class="admin-file-row"><div class="file-info"><b>${esc(x.title || x.document_type)}</b><small>${esc(x.document_type)} · ${x.verified ? 'Verified' : 'Pending'}</small></div><div><a target="_blank" rel="noopener" href="${esc(db.storage.from('ssc-candidate-files').getPublicUrl(x.file_path).data.publicUrl)}">Open</a> <button type="button" data-doc-verify="${esc(x.id)}">${x.verified ? 'Unverify' : 'Verify'}</button></div></article>`).join('') || '<p>No documents submitted.</p>';
    document.querySelectorAll('[data-doc-verify]').forEach(b => b.onclick = async () => { const r = await db.from('ssc_candidate_documents').update({verified:b.textContent === 'Verify'}).eq('id',b.dataset.docVerify); if (r.error) return alert(r.error.message); await loadDocuments(); });
  }

  async function saveCandidateResult() {
    if (!selected) return;
    const exam = $('cmResultExam').value.trim(); if (!exam) return $('cmResultMsg').textContent = 'Exam name is required.';
    $('cmResultMsg').textContent = 'Publishing...';
    const {error} = await db.from('ssc_results').insert({candidate_id:selected.user_id, exam_name:exam, post_name:$('cmResultPost').value.trim() || null, marks:$('cmResultMarks').value || null, max_marks:$('cmResultMax').value || null, rank:$('cmResultRank').value.trim() || null, selection_status:$('cmResultStatus').value.trim() || 'Published', result_date:$('cmResultDate').value || null, remarks:$('cmResultRemarks').value.trim() || null, published:true});
    if (error) return $('cmResultMsg').textContent = error.message;
    $('cmResultMsg').textContent = 'Candidate result published.';
    ['cmResultExam','cmResultPost','cmResultMarks','cmResultMax','cmResultRank','cmResultStatus','cmResultDate','cmResultRemarks'].forEach(id => { if ($(id)) $(id).value = ''; });
    await loadResults();
  }

  async function loadResults() {
    const el = $('cmResults');
    const {data,error} = await db.from('ssc_results').select('*').eq('candidate_id',selected.user_id).order('created_at',{ascending:false});
    if (error) return el.textContent = error.message;
    el.innerHTML = (data || []).map(x => `<article class="admin-file-row"><div class="file-info"><b>${esc(x.exam_name || x.title || 'Result')}</b><small>${esc(x.post_name || '')} · ${esc(x.marks ?? '')}/${esc(x.max_marks ?? '')} · ${esc(x.selection_status || '')} · ${esc(x.published ? 'Published' : 'Hidden')}</small></div></article>`).join('') || '<p>No candidate-specific results.</p>';
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
    const ins = await db.from('ssc_admit_cards').insert({candidate_id:selected.user_id, exam_name:exam, post_name:$('cmAdmitPost').value.trim() || null, exam_date:$('cmAdmitDate').value || null, file_path:path, published:true});
    if (ins.error) { await db.storage.from('ssc-files').remove([path]); return $('cmAdmitMsg').textContent = ins.error.message; }
    $('cmAdmitMsg').textContent = 'Admit Card uploaded and published.'; $('cmAdmitFile').value = ''; await loadAdmits();
  }

  async function loadAdmits() {
    if (!selected) return;
    const {data,error} = await db.from('ssc_admit_cards').select('*').eq('candidate_id', selected.user_id).order('created_at',{ascending:false});
    if (error) return $('cmAdmitList').textContent = error.message;
    $('cmAdmitList').innerHTML = (data || []).map(x => `<article class="admin-file-row"><div class="file-info"><b>${esc(x.exam_name)}</b><small>${esc(x.post_name || '')} · ${x.published ? 'Published' : 'Hidden'}</small></div>${x.file_path ? `<a target="_blank" rel="noopener" href="${esc(db.storage.from('ssc-files').getPublicUrl(x.file_path).data.publicUrl)}">Open PDF</a>` : ''}</article>`).join('') || '<p>No Admit Card uploaded.</p>';
  }

  window.addEventListener('DOMContentLoaded', inject);
})();