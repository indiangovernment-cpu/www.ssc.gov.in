(()=>{'use strict';
const cfg=window.SSC_CONFIG||{},db=cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&window.supabase?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null,$=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function init(){
 if(!db)return;
 const s=await db.auth.getSession();if(!s.data?.session)return;
 const r=await db.from('ssc_candidates').select('user_id,registration_no,roll_no,full_name').order('full_name');
 if(r.error)return;
 const sec=document.createElement('section');sec.id='admitManager';sec.className='panel';
 sec.innerHTML='<h2>Admit Card</h2><div class="row"><select id="acCandidate"><option value="">Select Candidate</option>'+((r.data||[]).map(c=>'<option value="'+esc(c.user_id)+'">'+esc(c.full_name)+' — Reg: '+esc(c.registration_no||'Not assigned')+' — Roll: '+esc(c.roll_no||'Not assigned')+'</option>').join(''))+'</select><input id="acExam" placeholder="Exam Name"><input id="acPost" placeholder="Post / Grade"><input id="acDate" type="date"><input id="acTime" type="time"><input id="acReport" type="time"><input id="acCity" placeholder="Centre City"><input id="acVenue" placeholder="Examination Venue"></div><button id="acPublish">Save & Publish Admit Card</button><p id="acMsg"></p>';
 const m=$("manager");m?.insertBefore(sec,m.firstElementChild);
 $("acPublish").onclick=async()=>{
   const c=(r.data||[]).find(x=>x.user_id===$("acCandidate").value);
   if(!c)return $("acMsg").textContent='Select candidate.';
   if(!c.registration_no||!c.roll_no)return $("acMsg").textContent='Candidate must have Registration No. and Roll No. assigned by Admin first.';
   const exam=$("acExam").value.trim();if(!exam)return $("acMsg").textContent='Exam name is required.';
   $("acMsg").textContent='Generating Admit Card...';
   const app=await db.from('ssc_applications').select('id').eq('candidate_id',c.user_id).order('created_at',{ascending:false}).limit(1).maybeSingle();
   const p={candidate_id:c.user_id,application_id:app.data?.id||null,exam_name:exam,post_name:$("acPost").value.trim()||null,exam_date:$("acDate").value||null,exam_time:$("acTime").value||null,reporting_time:$("acReport").value||null,venue:$("acVenue").value.trim()||null,exam_city:$("acCity").value.trim()||null,published:true};
   const x=await db.from('ssc_admit_cards').insert(p);
   $("acMsg").textContent=x.error?('Could not generate Admit Card: '+x.error.message):'Admit Card generated and published successfully. Registration No. '+c.registration_no+' | Roll No. '+c.roll_no;
 };
}
window.addEventListener('DOMContentLoaded',()=>setTimeout(init,700));
})();