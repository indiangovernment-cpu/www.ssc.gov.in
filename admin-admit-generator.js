(()=>{'use strict';
const cfg=window.SSC_CONFIG||{},db=cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&window.supabase?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null,$=id=>document.getElementById(id),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function loadCards(){
 const box=$("acExisting");if(!box||!db)return;
 const q=await db.from('ssc_admit_cards').select('id,candidate_id,exam_name,post_name,exam_date,exam_city,venue,published,created_at').order('created_at',{ascending:false});
 if(q.error){box.innerHTML='<p>Could not load existing Admit Cards.</p>';return}
 const names={};const c=await db.from('ssc_candidates').select('user_id,full_name,registration_no,roll_no');(c.data||[]).forEach(x=>names[x.user_id]=x);
 const rows=q.data||[];if(!rows.length){box.innerHTML='<p>No Admit Cards generated yet.</p>';return}
 box.innerHTML=rows.map(a=>{const n=names[a.candidate_id]||{};return '<div class="item" style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin:8px 0"><div><b>'+esc(n.full_name||'Candidate')+'</b> — Reg: '+esc(n.registration_no||'')+' — Roll: '+esc(n.roll_no||'')+'<br><span>'+esc(a.exam_name||'')+' · '+esc(a.post_name||'')+' · '+esc(a.exam_city||'')+'</span></div><button type="button" class="danger" data-delete-admit="'+esc(a.id)+'">Delete</button></div>'}).join('');
 box.querySelectorAll('[data-delete-admit]').forEach(btn=>btn.onclick=async()=>{if(!confirm('Delete this Admit Card? It will also disappear from the candidate portal.'))return;btn.disabled=true;const x=await db.from('ssc_admit_cards').delete().eq('id',btn.dataset.deleteAdmit);if(x.error){btn.disabled=false;alert('Delete failed: '+x.error.message)}else loadCards()});
}
async function init(){
 if(!db)return;
 const s=await db.auth.getSession();if(!s.data?.session)return;
 const r=await db.from('ssc_candidates').select('user_id,registration_no,roll_no,full_name').order('full_name');
 if(r.error)return;
 const sec=document.createElement('section');sec.id='admitManager';sec.className='panel';
 sec.innerHTML='<h2>Admit Card</h2><div class="row"><select id="acCandidate"><option value="">Select Candidate</option>'+((r.data||[]).map(c=>'<option value="'+esc(c.user_id)+'">'+esc(c.full_name)+' — Reg: '+esc(c.registration_no||'Not assigned')+' — Roll: '+esc(c.roll_no||'Not assigned')+'</option>').join(''))+'</select><input id="acExam" placeholder="Exam Name"><input id="acPost" placeholder="Post / Grade"><input id="acDate" type="date"><input id="acTime" type="time"><input id="acReport" type="time"><input id="acCity" placeholder="Centre City"><input id="acVenue" placeholder="Examination Venue"></div><button id="acPublish">Save & Publish Admit Card</button><p id="acMsg"></p><hr><h3>Published Admit Cards</h3><div id="acExisting"><p>Loading...</p></div>';
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
   if(!x.error)loadCards();
 };
 loadCards();
}
window.addEventListener('DOMContentLoaded',()=>setTimeout(init,700));
})();