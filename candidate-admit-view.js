(()=>{'use strict';
const cfg=window.SSC_CONFIG||{};
const db=cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&window.supabase?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}}):null;
const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
async function render(){
 const el=document.getElementById('admitList');if(!el||!db)return;
 const s=await db.auth.getSession();const u=s.data?.session?.user;if(!u)return;
 const r=await db.from('ssc_admit_cards').select('*').eq('candidate_id',u.id).eq('published',true).order('exam_date',{ascending:false});
 if(r.error)return;
 const rows=r.data||[];
 if(!rows.length){el.innerHTML='<div class="item">No admit card has been published by Admin.</div>';return;}
 el.innerHTML=rows.map(a=>`<article class="candidateAdmitCard"><div class="candidateAdmitHead"><div><b>Admission Certificate</b><span>${esc(a.exam_name||'Examination')}</span></div><div class="candidateAdmitActions"><a class="outline" target="_blank" rel="noopener" href="admit-card.html?admit_id=${encodeURIComponent(a.id)}">View Full Admit Card</a><button type="button" class="primary" data-print-admit="${esc(a.id)}">Print / Save PDF</button></div></div><div class="candidateAdmitFrame"><iframe title="SSC e-Admission Certificate" loading="lazy" src="admit-card.html?admit_id=${encodeURIComponent(a.id)}"></iframe></div></article>`).join('');
 el.querySelectorAll('[data-print-admit]').forEach(b=>b.addEventListener('click',()=>window.open('admit-card.html?admit_id='+encodeURIComponent(b.dataset.printAdmit),'_blank','noopener')));
}
window.addEventListener('DOMContentLoaded',()=>setTimeout(render,1000));
})();