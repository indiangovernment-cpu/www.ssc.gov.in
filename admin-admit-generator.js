(() => {
  'use strict';
  const c = window.SSC_CONFIG || {};
  if (!window.supabase || !c.SUPABASE_URL || !c.SUPABASE_ANON_KEY) return;
  const db = window.supabase.createClient(c.SUPABASE_URL, c.SUPABASE_ANON_KEY);
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>\"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[x]));
  const categories = ['CGL','STENOGRAPHER','CHSL','JEN','CAPF','CTGD','CHT','MTS','DPHM','RHQ','DPCE','DPCD','DPHCT','CEDP','DEPARTMENTAL EXAMS','OTHERS'];

  function inject() {
    if ($('directAdmitGenerator')) return;
    const manager = $('manager');
    if (!manager) return setTimeout(inject, 400);
    const panel = document.createElement('section');
    panel.className = 'panel';
    panel.id = 'directAdmitGenerator';
    panel.innerHTML = `
      <h2>Direct Admit Card Generator</h2>
      <p>Generate a candidate-specific PDF in an SSC-style admission-certificate layout. The PDF is saved to the candidate record and can be downloaded immediately.</p>
      <div class="row">
        <select id="agExamCategory">${categories.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select>
        <input id="agExamName" placeholder="Exam Name (e.g. Combined Graduate Level Examination)">
        <input id="agPostName" placeholder="Post / Grade">
      </div>
      <div class="row">
        <input id="agExamDate" type="date" placeholder="Exam Date">
        <input id="agExamTime" placeholder="Exam Time">
        <input id="agReporting" placeholder="Reporting Time">
        <input id="agClosing" placeholder="Entry Closing Time">
      </div>
      <div class="row">
        <input id="agVenue" placeholder="Examination Venue / Centre">
        <input id="agSubject" placeholder="Subject / Paper">
        <input id="agQuestions" type="number" placeholder="No. of Questions">
        <input id="agMaxMarks" type="number" placeholder="Maximum Marks">
      </div>
      <div class="row">
        <input id="agDuration" placeholder="Total Duration (e.g. 60 Minutes)">
        <input id="agCity" placeholder="Centre City">
        <input id="agApplicationNo" placeholder="Application No. (optional)">
      </div>
      <textarea id="agInstructions" rows="5" placeholder="Special instructions for the candidate"></textarea>
      <button id="agGenerate" type="button">Generate & Publish Admit Card PDF</button>
      <p id="agMsg"></p>
      <div id="agPreview"></div>`;
    const candidatePanel = $('candidateManagerPanel');
    manager.insertBefore(panel, candidatePanel || manager.firstChild);
    $('agGenerate').onclick = generate;
  }

  function getSelectedEmail() {
    const title = $('cmName')?.textContent || '';
    const m = title.match(/[—-]\s*([^\s]+@[^\s]+)/);
    return m ? m[1].trim() : '';
  }

  async function getCandidate() {
    const email = getSelectedEmail();
    if (!email) throw new Error('Open a candidate in Candidate Management first.');
    const {data, error} = await db.from('ssc_candidates').select('*').eq('email', email).single();
    if (error) throw new Error(error.message);
    return data;
  }

  async function getPhotoUrl(candidate) {
    let path = candidate.photo_path || '';
    if (!path) {
      const {data} = await db.from('ssc_candidate_documents').select('file_path,document_type,created_at').eq('candidate_id',candidate.user_id).ilike('document_type','%photo%').order('created_at',{ascending:false}).limit(1).maybeSingle();
      path = data?.file_path || '';
    }
    if (!path) return '';
    return db.storage.from('ssc-candidate-files').getPublicUrl(path).data.publicUrl || '';
  }

  async function imageData(url) {
    if (!url) return null;
    try {
      const r = await fetch(url, {mode:'cors'});
      if (!r.ok) return null;
      const b = await r.blob();
      return await new Promise(resolve => { const fr = new FileReader(); fr.onload = () => resolve(fr.result); fr.onerror = () => resolve(null); fr.readAsDataURL(b); });
    } catch (_) { return null; }
  }

  function line(doc, x1, y, x2) { doc.line(x1,y,x2,y); }
  function field(doc, label, value, x, y, w) {
    doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.text(label, x, y);
    doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.text(String(value || '—'), x, y+5, {maxWidth:w});
  }

  async function generate() {
    const msg = $('agMsg');
    try {
      if (!window.jspdf?.jsPDF) throw new Error('PDF generator is still loading. Refresh once and try again.');
      const candidate = await getCandidate();
      const exam = $('agExamName').value.trim();
      if (!exam) throw new Error('Exam Name is required.');
      if (!$('agExamDate').value) throw new Error('Exam Date is required.');
      if (!$('agVenue').value.trim()) throw new Error('Examination Venue is required.');
      msg.textContent = 'Generating PDF...';

      const {jsPDF} = window.jspdf;
      const doc = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
      const W = 210, H = 297, M = 10;
      doc.setLineWidth(0.6); doc.rect(M,M,W-2*M,H-2*M);
      doc.setLineWidth(0.25); doc.rect(M+2,M+2,W-2*M-4,H-2*M-4);

      // Header modeled on the supplied reference: commission name, regional office, emblem and certificate title.
      doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.text('STAFF SELECTION COMMISSION',105,18,{align:'center'});
      doc.setFontSize(7); doc.text('Government of India',105,23,{align:'center'});
      doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.text('Staff Selection Commission — Admission Certificate',105,27,{align:'center'});
      doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.text('e-ADMISSION CERTIFICATE',105,35,{align:'center'});
      doc.setFontSize(8); doc.text(`${$('agExamCategory').value} — ${exam}`,105,40,{align:'center',maxWidth:175});
      doc.setLineWidth(0.4); line(doc,15,44,195);

      // Emblem from the site's existing asset. If unavailable, the document remains valid without it.
      try { const er = await fetch('assets/emblem-header.jpg'); if (er.ok) { const eb = await er.blob(); const ed = await new Promise(res=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.readAsDataURL(eb)}); doc.addImage(ed,'JPEG',95,12,20,14); } } catch (_) {}

      const photo = await imageData(await getPhotoUrl(candidate));
      if (photo) doc.addImage(photo,'JPEG',165,48,28,34);
      doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.text('CANDIDATE DETAILS',15,51);
      field(doc,'Applicant Name',candidate.full_name,15,58,65);
      field(doc,'Registration No.',candidate.registration_no,82,58,70);
      field(doc,'Roll No.',15,72,65);
      field(doc,'Category',candidate.category,82,72,70);
      field(doc,'Date of Birth',candidate.dob,15,86,65);
      field(doc,'Father / Mother',`${candidate.father_name || ''} / ${candidate.mother_name || ''}`,82,86,70);
      field(doc,'Email',candidate.email,15,100,65);
      field(doc,'Mobile',candidate.phone,82,100,70);
      field(doc,'Address',`${candidate.address || ''}, ${candidate.city || ''}, ${candidate.state || ''} ${candidate.pincode || ''}`,15,114,137);
      line(doc,15,123,195);

      doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.text('EXAMINATION DETAILS',15,130);
      field(doc,'Exam / Category',$('agExamCategory').value,15,137,55);
      field(doc,'Post / Grade',$('agPostName').value,75,137,55);
      field(doc,'Application No.',$('agApplicationNo').value || '—',135,137,55);
      field(doc,'Exam Date',$('agExamDate').value,15,151,55);
      field(doc,'Exam Time',$('agExamTime').value,75,151,55);
      field(doc,'Reporting Time',$('agReporting').value,135,151,55);
      field(doc,'Entry Closing Time',$('agClosing').value,15,165,55);
      field(doc,'Examination Venue',$('agVenue').value,75,165,120);
      field(doc,'Centre City',$('agCity').value,15,179,55);
      field(doc,'Subject / Paper',$('agSubject').value,75,179,55);
      field(doc,'Duration',$('agDuration').value,135,179,55);

      doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.text('PAPER / MARKS DETAILS',15,193);
      doc.setLineWidth(0.25); doc.rect(15,197,180,18);
      doc.setFontSize(7); doc.text('Subject / Paper',18,203); doc.text('No. of Questions',92,203); doc.text('Maximum Marks',145,203);
      line(doc,15,207,195); doc.setFont('helvetica','normal'); doc.setFontSize(8);
      doc.text($('agSubject').value || '—',18,212); doc.text($('agQuestions').value || '—',99,212); doc.text($('agMaxMarks').value || '—',151,212);

      doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.text('SPECIAL INSTRUCTIONS FOR THE CANDIDATE',15,225);
      const instructions = $('agInstructions').value.trim() || 'Carry a valid original photo identity document. Follow the examination centre instructions and arrive before the reporting time.';
      doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
      const wrapped = doc.splitTextToSize(instructions,175); doc.text(wrapped,18,232,{maxWidth:175});
      let y = Math.min(272,232 + wrapped.length*4.2 + 5);
      const defaults = ['Bring this Admission Certificate to the examination centre.','Do not carry prohibited electronic devices or material.','Candidate details must match the submitted application and identity document.'];
      defaults.forEach((t,i)=>{ if(y < 276){ doc.text(`${i+1}. ${t}`,18,y); y += 5; }});
      doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.text('This is a computer-generated admission certificate.',105,285,{align:'center'});
      doc.setFont('helvetica','normal'); doc.setFontSize(6); doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`,105,290,{align:'center'});

      const safeName = `${candidate.registration_no || candidate.user_id}-${$('agExamCategory').value}-admit-card.pdf`.replace(/[^a-zA-Z0-9._-]/g,'_');
      const blob = doc.output('blob');
      const path = `admit-cards/${candidate.user_id}/${Date.now()}-${safeName}`;
      const up = await db.storage.from('ssc-files').upload(path, blob, {upsert:false,contentType:'application/pdf'});
      if (up.error) throw new Error(`PDF generated but upload failed: ${up.error.message}`);
      const ins = await db.from('ssc_admit_cards').insert({candidate_id:candidate.user_id,exam_name:exam,post_name:$('agPostName').value.trim() || null,exam_date:$('agExamDate').value || null,exam_time:$('agExamTime').value.trim() || null,reporting_time:$('agReporting').value.trim() || null,venue:$('agVenue').value.trim(),instructions:instructions,file_path:path,published:true});
      if (ins.error) { await db.storage.from('ssc-files').remove([path]); throw new Error(`PDF generated but record save failed: ${ins.error.message}`); }
      const url = db.storage.from('ssc-files').getPublicUrl(path).data.publicUrl;
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = safeName; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
      msg.textContent = 'Admit Card generated, published and downloaded successfully.';
      $('agPreview').innerHTML = `<p><a target="_blank" rel="noopener" href="${esc(url)}">Open published Admit Card PDF</a></p>`;
      if ($('cmAdmitList')) $('cmAdmitList').insertAdjacentHTML('afterbegin', `<article class="admin-file-row"><div class="file-info"><b>${esc(exam)}</b><small>${esc($('agExamCategory').value)} · Generated & Published</small></div><a target="_blank" rel="noopener" href="${esc(url)}">Open PDF</a></article>`);
    } catch (e) { msg.textContent = e?.message || 'Admit Card generation failed.'; }
  }

  window.addEventListener('DOMContentLoaded', inject);
})();
