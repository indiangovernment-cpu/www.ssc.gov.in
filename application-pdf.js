(() => {
  'use strict';
  let capturedDb=null;
  const originalCreateClient=window.supabase?.createClient;
  if(originalCreateClient&&!window.__sscPdfClientHooked){window.__sscPdfClientHooked=true;window.supabase.createClient=function(...args){capturedDb=originalCreateClient.apply(this,args);window.__sscPdfDb=capturedDb;return capturedDb;};}
  const safe=v=>String(v??'').replace(/[^a-zA-Z0-9_-]/g,'_');
  async function context(){const db=capturedDb||window.__sscPdfDb;if(!db)return null;const s=await db.auth.getSession();const user=s.data?.session?.user;if(!user)return null;const r=await db.from('ssc_candidates').select('*').eq('user_id',user.id).maybeSingle();return{db,user,candidate:r.data||{}};}
  async function imageData(url){try{const r=await fetch(url,{mode:'cors'});if(!r.ok)return null;const b=await r.blob();return await new Promise(ok=>{const f=new FileReader();f.onload=()=>ok(f.result);f.onerror=()=>ok(null);f.readAsDataURL(b);});}catch(_){return null;}}
  async function documentImage(db,userId,type){try{const r=await db.from('ssc_candidate_documents').select('file_path,created_at').eq('candidate_id',userId).eq('document_type',type).order('created_at',{ascending:false}).limit(1);const p=r.data?.[0]?.file_path;if(!p)return null;const s=await db.storage.from('ssc-candidate-files').createSignedUrl(p,600);return s.data?.signedUrl?await imageData(s.data.signedUrl):null;}catch(_){return null;}}
  function cell(doc,label,value,x,y,w,h=7.4){doc.setDrawColor(145,145,145);doc.rect(x,y,w,h);doc.setFont('helvetica','bold');doc.setFontSize(5.7);doc.text(label.toUpperCase(),x+1.8,y+2.6,{maxWidth:w-3.6});doc.setFont('helvetica','normal');doc.setFontSize(7.1);doc.text(String(value||'—'),x+1.8,y+5.6,{maxWidth:w-3.6});}
  function heading(doc,text,y){doc.setFillColor(239,239,239);doc.setDrawColor(100,100,100);doc.rect(12,y,186,6,'FD');doc.setFont('helvetica','bold');doc.setFontSize(7.2);doc.text(text,15,y+4.1);return y+7.5;}
  async function qrData(text){try{return await imageData('https://api.qrserver.com/v1/create-qr-code/?size=160x160&data='+encodeURIComponent(text));}catch(_){return null;}}
  async function makeApplicationPdf(app){
    if(!window.jspdf?.jsPDF)throw new Error('PDF library is not loaded.');
    const ctx=await context();if(!ctx)throw new Error('Please login again.');
    const {db,user,candidate}=ctx,edu=candidate.education_details||{},fd=app.form_data||{};
    const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4',compress:true});
    doc.setDrawColor(90,90,90);doc.setLineWidth(.45);doc.rect(9,8,192,281);
    const photo=await documentImage(db,user.id,'PHOTO');const signature=await documentImage(db,user.id,'SIGNATURE');const qr=await qrData('SSC|'+(candidate.registration_no||'NA')+'|'+(app.application_no||app.id||'NA'));
    if(qr){try{doc.addImage(qr,'PNG',13,11,27,27,'qr','FAST');}catch(_) {}}
    if(photo){try{doc.addImage(photo,'JPEG',169,11,27,31,'photo','FAST');}catch(_) {}}
    doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text('STAFF SELECTION COMMISSION',105,14,{align:'center'});doc.setFontSize(6.8);doc.text('Government of India',105,18,{align:'center'});doc.setFontSize(8.2);doc.text(app.exam_name||'APPLICATION FORM',105,23,{align:'center'});doc.setFontSize(6.5);doc.text('Online Application / Confirmation',105,27,{align:'center'});
    doc.setFont('helvetica','bold');doc.setFontSize(6.5);doc.text('REGISTRATION NO.: '+(candidate.registration_no||'Not assigned'),45,34);doc.text('APPLICATION NO.: '+(app.application_no||app.id||'—'),155,34,{align:'center'});
    let y=39;
    y=heading(doc,'1. CANDIDATE / PERSONAL DETAILS',y);
    cell(doc,'1. Candidate Name',candidate.full_name,12,y,62);cell(doc,"2. Father's Name",candidate.father_name,74,y,62);cell(doc,"3. Mother's Name",136,y,62);doc.setFont('helvetica','normal');doc.setFontSize(7);doc.text(String(candidate.mother_name||'—'),138,y+5.6,{maxWidth:58});y+=7.4;
    cell(doc,'4. Date of Birth',candidate.dob,12,y,46);cell(doc,'5. Gender',candidate.gender||'—',58,y,42);cell(doc,'6. Category',candidate.category,100,y,42);cell(doc,'7. Mobile',candidate.phone,142,y,56);y+=7.4;
    cell(doc,'8. Email',candidate.email,12,y,93);cell(doc,'9. Address',candidate.address,105,y,93,9);y+=9;
    cell(doc,'10. City',candidate.city,12,y,46);cell(doc,'11. State',candidate.state,58,y,46);cell(doc,'12. PIN Code',104,y,46);cell(doc,'13. Application Status',app.status||'Submitted',150,y,48);y+=9;
    y=heading(doc,'2. EXAMINATION / APPLICATION DETAILS',y);
    cell(doc,'14. Examination',app.exam_name,12,y,93);cell(doc,'15. Post',app.post_name,105,y,93);y+=7.4;
    cell(doc,'16. Exam Centre / City',fd.centre,12,y,186);y+=7.4;
    cell(doc,'17. Registration No.',candidate.registration_no,12,y,62);cell(doc,'18. Application No.',candidate.registration_no?app.application_no||app.id:'—',74,y,62);cell(doc,'19. Submitted On',app.submitted_at?new Date(app.submitted_at).toLocaleString():'—',136,y,62);y+=9;
    y=heading(doc,'3. EDUCATIONAL DETAILS',y);
    cell(doc,'20. 10th Board',edu.tenth_board,12,y,62);cell(doc,'21. 10th Year',edu.tenth_year,74,y,62);cell(doc,'22. 10th Marks / %',edu.tenth_marks,136,y,62);y+=7.4;
    cell(doc,'23. 12th Board',edu.twelfth_board,12,y,62);cell(doc,'24. 12th Year',edu.twelfth_year,74,y,62);cell(doc,'25. 12th Marks / %',edu.twelfth_marks,136,y,62);y+=7.4;
    cell(doc,'26. Graduation University',edu.graduation_university,12,y,93);cell(doc,'27. Graduation Year',edu.graduation_year,105,y,46);cell(doc,'28. Graduation Marks / %',edu.graduation_marks,151,y,47);y+=9;
    y=heading(doc,'4. DECLARATION',y);doc.setDrawColor(145,145,145);doc.rect(12,y,186,25);doc.setFont('helvetica','normal');doc.setFontSize(6.6);const d='I hereby declare that the information furnished by me in this application is true and correct to the best of my knowledge and belief. I understand that furnishing false information may lead to cancellation of my candidature and action as per applicable rules.';doc.text(doc.splitTextToSize(d,178),15,y+6,{lineHeightFactor:1.35});y+=28;
    cell(doc,'29. Photo / Signature',photo?'Photo uploaded':'Not uploaded',12,y,62);cell(doc,'30. Signature',signature?'Signature uploaded':'Not uploaded',74,y,62);cell(doc,'31. Payment / Challan Status','See Challan / Payment section',136,y,62);y+=9;
    doc.setFont('helvetica','bold');doc.setFontSize(7);doc.text('Candidate Signature',172,y+7,{align:'center'});if(signature){try{doc.addImage(signature,'JPEG',150,y-1,44,16,'sig','FAST');}catch(_) {}}
    doc.setFont('helvetica','normal');doc.setFontSize(6);doc.text('System generated application. Please retain this application for future reference.',12,282);doc.text('Page 1 of 1',198,282,{align:'right'});
    doc.save('SSC_Application_'+safe(candidate.registration_no||app.application_no||app.id)+'.pdf');
  }
  window.sscGenerateApplicationPdf=makeApplicationPdf;
  async function latest(){const c=await context();if(!c)return null;const r=await c.db.from('ssc_applications').select('*').eq('candidate_id',c.user.id).order('created_at',{ascending:false}).limit(1);return r.data?.[0]||null;}
  function hook(){const form=document.getElementById('applicationForm');if(!form||form.dataset.pdfHooked)return;form.dataset.pdfHooked='1';form.addEventListener('submit',()=>setTimeout(async()=>{try{const app=await latest();if(app)await makeApplicationPdf(app);}catch(e){console.error('Application PDF',e);}},1400));}
  window.addEventListener('DOMContentLoaded',()=>setTimeout(hook,900));
  setInterval(()=>{if((capturedDb||window.__sscPdfDb)&&document.getElementById('applicationForm'))hook();},700);
})();
