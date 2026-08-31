(() => {
  'use strict';
  const c = window.SSC_CONFIG || {};
  if (!window.supabase || !c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) return;
  const db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  let selected = null;
  function inject() {
    if ($('officialLetterPanel')) return;
    const manager = $('manager'); if (!manager) return setTimeout(inject, 300);
    const panel = document.createElement('section'); panel.className='panel'; panel.id='officialLetterPanel';
    panel.innerHTML = `<h2>Appointment / Joining Letter</h2>
      <p>Admin can generate an official candidate-specific PDF directly. The generated PDF is stored privately and becomes downloadable only by that candidate.</p>
      <div class="row"><input id="olSearch" placeholder="Candidate name, email or Registration No."><button id="olSearchBtn" type="button">Search</button></div>
      <div id="olCandidates"></div>
      <div id="olEditor" hidden style="margin-top:12px"><hr><h3 id="olCandidateName">Candidate</h3>
      <div class="row"><select id="olType"><option value="APPOINTMENT">Appointment Letter</option><option value="JOINING">Joining Letter</option></select><input id="olTitle" placeholder="Letter Title"></div>
      <div class="row"><input id="olDepartment" placeholder="Department / Ministry"><input id="olOffice" placeholder="Office / Establishment"><input id="olPost" placeholder="Post / Designation"></div>
      <div class="row"><input id="olRef" placeholder="Reference No."><input id="olIssueDate" type="date"><input id="olJoiningDate" type="date"></div>
      <div class="row"><input id="olJoiningTime" placeholder="Joining Time"><input id="olLocation" placeholder="Joining Location"></div>
      <input id="olSubject" placeholder="Subject" style="width:100%;margin:6px 0">
      <textarea id="olBody" rows="7" placeholder="Letter body / terms / instructions" style="width:100%;box-sizing:border-box"></textarea>
      <button id="olGenerate" type="button">Generate & Publish PDF</button><p id="olMsg"></p><div id="olList"></div></div>`;
    const resultHeading = Array.from(manager.querySelectorAll('h2')).find(h => h.textContent.trim() === 'Publish Result');
    const resultPanel = resultHeading ? resultHeading.closest('.panel') : null;
    manager.insertBefore(panel, resultPanel || manager.firstElementChild || null);
    $('olSearchBtn').onclick = search; $('olSearch').addEventListener('keydown',e=>{if(e.key==='Enter')search()}); $('olGenerate').onclick=generate;
  }
  async function search(){
    const q=$('olSearch').value.trim(); $('olCandidates').textContent='Searching...';
    let query=db.from('ssc_candidates').select('*').order('created_at',{ascending:false}).limit(50);
    if(q) query=query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,registration_no.ilike.%${q}%`);
    const r=await query; if(r.error)return $('olCandidates').textContent=r.error.message;
    $('olCandidates').innerHTML=(r.data||[]).map(x=>`<article class="admin-file-row"><div class="file-info"><b>${esc(x.full_name)}</b><small>${esc(x.email)} · Reg: ${esc(x.registration_no||'NOT ASSIGNED')} · Roll: ${esc(x.roll_no||'NOT ASSIGNED')}</small></div><button type="button" data-ol-id="${esc(x.user_id)}">Select</button></article>`).join('')||'<p>No candidates found.</p>';
    document.querySelectorAll('[data-ol-id]').forEach(b=>b.onclick=()=>selectCandidate(b.dataset.olId));
  }
  async function selectCandidate(id){
    const r=await db.from('ssc_candidates').select('*').eq('user_id',id).single(); if(r.error)return $('olMsg').textContent=r.error.message;
    selected=r.data; $('olEditor').hidden=false; $('olCandidateName').textContent=`${selected.full_name||'Candidate'} — Reg: ${selected.registration_no||'Not assigned'} · Roll: ${selected.roll_no||'Not assigned'}`;
    $('olTitle').value=$('olType').value==='JOINING'?'Joining Letter':'Appointment Letter'; $('olDepartment').value='Staff Selection Commission'; $('olOffice').value=''; $('olPost').value=''; $('olRef').value=''; $('olIssueDate').value=new Date().toISOString().slice(0,10); $('olJoiningDate').value=''; $('olJoiningTime').value=''; $('olLocation').value=''; $('olSubject').value=''; $('olBody').value=''; $('olMsg').textContent=''; await loadLetters();
  }
  function wrap(doc,text,x,y,maxWidth,line=5){const lines=doc.splitTextToSize(String(text||''),maxWidth);doc.text(lines,x,y,{lineHeightFactor:1.45});return y+Math.max(lines.length,1)*line;}
  function safe(v){return String(v||'candidate').replace(/[^a-zA-Z0-9_-]/g,'_')}
  async function generate(){
    if(!selected)return $('olMsg').textContent='Select a candidate first.';
    if(!window.jspdf?.jsPDF)return $('olMsg').textContent='PDF library is not loaded.';
    const type=$('olType').value,title=$('olTitle').value.trim()||(type==='JOINING'?'Joining Letter':'Appointment Letter'),body=$('olBody').value.trim();
    if(!body)return $('olMsg').textContent='Letter body is required.';
    $('olMsg').textContent='Generating PDF...';
    const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'}); doc.setDrawColor(70);doc.setLineWidth(.5);doc.rect(10,10,190,277);
    doc.setFont('helvetica','bold');doc.setFontSize(15);doc.text('STAFF SELECTION COMMISSION',105,24,{align:'center'});doc.setFontSize(9);doc.text('Government of India',105,30,{align:'center'});
    doc.setFontSize(14);doc.text(title.toUpperCase(),105,45,{align:'center'});doc.setLineWidth(.3);doc.line(22,49,188,49);
    doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text(`Reference No.: ${$('olRef').value.trim()||'—'}`,22,59);doc.text(`Issue Date: ${$('olIssueDate').value||'—'}`,188,59,{align:'right'});
    let y=72;doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('To,',22,y);y+=7;doc.setFont('helvetica','normal');doc.setFontSize(10);y=wrap(doc,selected.full_name,22,y,166,5);y+=2;y=wrap(doc,`Registration No.: ${selected.registration_no||'—'}   |   Roll No.: ${selected.roll_no||'—'}`,22,y,166,5);y+=5;
    const meta=[['Department / Ministry',$('olDepartment').value],['Office / Establishment',$('olOffice').value],['Post / Designation',$('olPost').value],['Joining Date',$('olJoiningDate').value],['Joining Time',$('olJoiningTime').value],['Joining Location',$('olLocation').value]];
    meta.forEach(([k,v])=>{if(v){doc.setFont('helvetica','bold');doc.text(k+':',22,y);doc.setFont('helvetica','normal');y=wrap(doc,v,65,y,123,5);y+=2}});y+=5;
    if($('olSubject').value.trim()){doc.setFont('helvetica','bold');doc.text('Subject:',22,y);doc.setFont('helvetica','normal');y=wrap(doc,$('olSubject').value.trim(),42,y,146,5);y+=6}
    doc.setFont('helvetica','normal');y=wrap(doc,body,22,y,166,5.3);y+=10;
    const declaration=type==='APPOINTMENT'?'This appointment is subject to the applicable recruitment rules, verification of eligibility and documents, and the terms and conditions prescribed by the Commission / appointing authority.':'The candidate is directed to report at the above office/location on the specified date and time and complete joining formalities as prescribed by the appointing authority.';
    y=wrap(doc,declaration,22,y,166,5.3);y=Math.min(y,255);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text('Authorised Signatory',188,262,{align:'right'});doc.setFont('helvetica','normal');doc.text('Staff Selection Commission',188,268,{align:'right'});doc.setFontSize(6.5);doc.text('This is a computer-generated candidate-specific letter.',22,282);
    const blob=doc.output('blob'); const path=`${selected.user_id}/official-letters/${Date.now()}-${type}-${safe(selected.registration_no)}.pdf`;
    const up=await db.storage.from('ssc-candidate-deliveries').upload(path,blob,{contentType:'application/pdf',upsert:false});
    if(up.error)return $('olMsg').textContent=up.error.message;
    const ins=await db.from('ssc_candidate_deliveries').insert({candidate_id:selected.user_id,letter_type:type,title,department:$('olDepartment').value.trim()||null,post_name:$('olPost').value.trim()||null,office_name:$('olOffice').value.trim()||null,issue_date:$('olIssueDate').value||null,joining_date:$('olJoiningDate').value||null,joining_time:$('olJoiningTime').value.trim()||null,joining_location:$('olLocation').value.trim()||null,reference_no:$('olRef').value.trim()||null,subject:$('olSubject').value.trim()||null,body,file_path:path,published:true});
    if(ins.error){await db.storage.from('ssc-candidate-deliveries').remove([path]);return $('olMsg').textContent=ins.error.message;}
    $('olMsg').textContent=`${type==='APPOINTMENT'?'Appointment':'Joining'} letter generated and published successfully.`;await loadLetters();
  }
  async function loadLetters(){
    if(!selected||!$('olList'))return;const r=await db.from('ssc_candidate_deliveries').select('*').eq('candidate_id',selected.user_id).order('created_at',{ascending:false});if(r.error)return $('olList').textContent=r.error.message;
    $('olList').innerHTML=(r.data||[]).map(x=>`<article class="admin-file-row"><div class="file-info"><b>${esc(x.title)}</b><small>${esc(x.letter_type)} · ${esc(x.issue_date||'')} · ${x.published?'Published':'Hidden'}</small></div>${x.file_path?`<a target="_blank" rel="noopener" href="${esc(db.storage.from('ssc-candidate-deliveries').getPublicUrl(x.file_path).data.publicUrl)}">Open PDF</a>`:''}</article>`).join('')||'<p>No appointment/joining letters yet.</p>';
  }
  window.addEventListener('DOMContentLoaded',inject);
})();