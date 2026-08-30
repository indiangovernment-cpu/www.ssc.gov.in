(() => {
  'use strict';
  let capturedDb = null;
  const originalCreateClient = window.supabase?.createClient;
  if (originalCreateClient && !window.__sscPdfClientHooked) {
    window.__sscPdfClientHooked = true;
    window.supabase.createClient = function(...args) {
      capturedDb = originalCreateClient.apply(this, args);
      window.__sscPdfDb = capturedDb;
      return capturedDb;
    };
  }
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  async function getContext() {
    const db = capturedDb || window.__sscPdfDb;
    if (!db) return null;
    const sr = await db.auth.getSession();
    const user = sr.data?.session?.user;
    if (!user) return null;
    const cr = await db.from('ssc_candidates').select('*').eq('user_id',user.id).maybeSingle();
    return {db,user,candidate:cr.data||{}};
  }

  async function loadImageData(url) {
    try {
      const r=await fetch(url,{mode:'cors'}); if(!r.ok)return null;
      const b=await r.blob();
      return await new Promise(resolve=>{const rd=new FileReader();rd.onload=()=>resolve(rd.result);rd.onerror=()=>resolve(null);rd.readAsDataURL(b);});
    } catch(_) { return null; }
  }
  async function getDocImage(db,userId,type) {
    try {
      const r=await db.from('ssc_candidate_documents').select('file_path,created_at').eq('candidate_id',userId).eq('document_type',type).order('created_at',{ascending:false}).limit(1);
      const p=r.data?.[0]?.file_path; if(!p)return null;
      const s=await db.storage.from('ssc-candidate-files').createSignedUrl(p,600);
      return s.data?.signedUrl ? await loadImageData(s.data.signedUrl) : null;
    } catch(_) { return null; }
  }
  function section(doc,title,y){doc.setFillColor(242,242,242);doc.setDrawColor(120,120,120);doc.rect(12,y,186,7,'FD');doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.text(title,15,y+4.8);return y+9;}
  function row(doc,label,val,x,y,w,h=8){doc.setDrawColor(150,150,150);doc.rect(x,y,w,h);doc.setFont('helvetica','bold');doc.setFontSize(6.8);doc.text(label,x+2,y+3.1,{maxWidth:w-4});doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text(String(val||'—'),x+2,y+6.2,{maxWidth:w-4});}
  function safe(v){return String(v||'').replace(/[^a-zA-Z0-9_-]/g,'_');}

  async function makeApplicationPdf(app) {
    if(!window.jspdf?.jsPDF) throw new Error('PDF library is not loaded.');
    const ctx=await getContext(); if(!ctx)throw new Error('Please login again.');
    const {db,user,candidate}=ctx, f=app.form_data||{}, edu=candidate.education_details||{};
    const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'}), W=210;
    doc.setDrawColor(70,70,70);doc.setLineWidth(.5);doc.rect(10,10,190,30);
    doc.setFont('helvetica','bold');doc.setFontSize(13);doc.text('STAFF SELECTION COMMISSION',105,17,{align:'center'});
    doc.setFontSize(8.5);doc.text('Government of India',105,22,{align:'center'});
    doc.setFontSize(10);doc.text(app.exam_name||'APPLICATION FORM',105,28,{align:'center'});
    doc.setFont('helvetica','normal');doc.setFontSize(8);doc.text(`Registration No.: ${candidate.registration_no||'Not assigned'}`,14,35);doc.text(`Application No.: ${app.application_no||app.id||'—'}`,196,35,{align:'right'});
    let y=46;
    const photo=await getDocImage(db,user.id,'PHOTO'); const signature=await getDocImage(db,user.id,'SIGNATURE');
    if(photo){try{doc.addImage(photo,'JPEG',165,43,28,34,undefined,'FAST');}catch(_) {}}
    y=section(doc,'1. CANDIDATE DETAILS',y);
    row(doc,'Full Name',candidate.full_name,12,y,92);row(doc,"Father's Name",candidate.father_name,104,y,94);y+=8;
    row(doc,"Mother's Name",candidate.mother_name,12,y,92);row(doc,'Date of Birth',candidate.dob,104,y,94);y+=8;
    row(doc,'Category',candidate.category,12,y,45);row(doc,'Mobile',candidate.phone,57,y,65);row(doc,'Email',candidate.email,122,y,76);y+=8;
    row(doc,'Address',candidate.address,12,y,186,10);y+=10;
    row(doc,'City',candidate.city,12,y,62);row(doc,'State',candidate.state,74,y,62);row(doc,'PIN Code',candidate.pincode,136,y,62);y+=12;
    y=section(doc,'2. APPLICATION / EXAM DETAILS',y);
    row(doc,'Exam Name',app.exam_name,12,y,92);row(doc,'Post Name',app.post_name,104,y,94);y+=8;
    row(doc,'Qualification',f.qualification,12,y,62);row(doc,'Passing Year',f.year,74,y,62);row(doc,'Board / University',f.board,136,y,62);y+=8;
    row(doc,'Percentage / CGPA',f.percentage,12,y,62);row(doc,'Exam Centre',f.centre,74,y,124);y+=8;
    row(doc,'Additional Details',f.additional,12,y,186,14);y+=16;
    y=section(doc,'3. EDUCATIONAL QUALIFICATION',y);
    row(doc,'10th Board',edu.tenth_board,12,y,92);row(doc,'10th Passing Year',edu.tenth_year,104,y,94);y+=8;
    row(doc,'10th Marks / %',edu.tenth_marks,12,y,92);row(doc,'12th Board',edu.twelfth_board,104,y,94);y+=8;
    row(doc,'12th Passing Year',edu.twelfth_year,12,y,92);row(doc,'12th Marks / %',edu.twelfth_marks,104,y,94);y+=8;
    row(doc,'Graduation University',edu.graduation_university,12,y,92);row(doc,'Graduation Year',edu.graduation_year,104,y,94);y+=8;
    row(doc,'Graduation Marks / %',edu.graduation_marks,12,y,92);row(doc,'Other Qualification',edu.other,104,y,94);y+=12;
    y=section(doc,'4. DECLARATION',y);doc.setDrawColor(150,150,150);doc.rect(12,y,186,34);doc.setFont('helvetica','normal');doc.setFontSize(8);
    const declaration='I hereby declare that the information furnished in this application is true and correct to the best of my knowledge and belief. I understand that furnishing false information may lead to cancellation of my candidature and other action as per applicable rules.';
    doc.text(doc.splitTextToSize(declaration,174),16,y+7,{lineHeightFactor:1.45});y+=40;
    row(doc,'Application Status',app.status||'Submitted',12,y,62);row(doc,'Submitted On',app.submitted_at?new Date(app.submitted_at).toLocaleString():new Date().toLocaleString(),74,y,124);y+=12;
    if(signature){try{doc.addImage(signature,'JPEG',153,y,45,18,undefined,'FAST');}catch(_) {}}
    doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('Candidate Signature',175.5,y+22,{align:'center'});
    doc.setFont('helvetica','normal');doc.setFontSize(6.5);doc.text('This is a system-generated application PDF.',12,287);doc.text('Page 1',198,287,{align:'right'});
    doc.save(`SSC_Application_${safe(candidate.registration_no||app.application_no||app.id)}.pdf`);
  }

  async function latestApplication(){const ctx=await getContext();if(!ctx)return null;const r=await ctx.db.from('ssc_applications').select('*').eq('candidate_id',ctx.user.id).order('created_at',{ascending:false}).limit(1);return r.data?.[0]||null;}
  function hook(){const form=$('applicationForm');if(!form||form.dataset.pdfHooked)return;form.dataset.pdfHooked='1';form.addEventListener('submit',()=>setTimeout(async()=>{try{const app=await latestApplication();if(app)await makeApplicationPdf(app);}catch(e){console.error('Application PDF',e);}},1200));}
  window.sscGenerateApplicationPdf=makeApplicationPdf;
  window.addEventListener('DOMContentLoaded',()=>setTimeout(hook,1000));
  const timer=setInterval(()=>{if((capturedDb||window.__sscPdfDb)&&$('applicationForm')){hook();clearInterval(timer);}},500);
})();
