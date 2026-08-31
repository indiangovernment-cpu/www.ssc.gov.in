(() => {
  'use strict';
  const c=window.SSC_CONFIG||{};
  if(!window.supabase||!c.SUPABASE_URL||!c.SUPABASE_ANON_KEY)return;
  const db=window.supabase.createClient(c.SUPABASE_URL,c.SUPABASE_ANON_KEY,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});
  const $=id=>document.getElementById(id); const esc=v=>String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  let user=null;
  function inject(){
    if($('officialLettersSection'))return;
    const content=document.querySelector('.content');if(!content)return setTimeout(inject,300);
    const sec=document.createElement('section');sec.className='section';sec.id='officialLettersSection';sec.hidden=true;
    sec.innerHTML='<div class="item"><div class="itemhead"><div><h2>Appointment / Joining Letters</h2><div class="meta">Official letters published by Admin for your account.</div></div></div><div id="officialLettersList"><div class="item">Loading…</div></div></div>';
    content.appendChild(sec);
    const side=document.querySelector('[data-section="messages"]');
    if(side){const b=document.createElement('button');b.type='button';b.className='sidebtn';b.dataset.section='officialLetters';b.textContent='Appointment / Joining';side.parentElement.insertBefore(b,side.nextSibling);b.addEventListener('click',()=>show());}
    window.addEventListener('ssc:officialLetters',show);
  }
  async function getUser(){if(user)return user;const r=await db.auth.getSession();user=r.data?.session?.user||null;return user;}
  async function show(){
    const u=await getUser();if(!u)return;
    document.querySelectorAll('.content > section').forEach(s=>{if(s.id!=='officialLettersSection')s.hidden=true});
    const sec=$('officialLettersSection');if(!sec)return;sec.hidden=false;document.querySelectorAll('.sidebtn').forEach(b=>b.classList.toggle('active',b.dataset.section==='officialLetters'));await load(u.id);
  }
  async function load(uid){
    const el=$('officialLettersList');if(!el)return;el.innerHTML='<div class="item">Loading letters…</div>';
    const r=await db.from('ssc_candidate_deliveries').select('*').eq('candidate_id',uid).eq('published',true).order('created_at',{ascending:false});
    if(r.error)return el.innerHTML=`<div class="item">${esc(r.error.message)}</div>`;
    el.innerHTML=(r.data||[]).map(x=>`<article class="item"><div class="itemhead"><div><h3>${esc(x.title)}</h3><div class="meta">${esc(x.letter_type==='JOINING'?'Joining Letter':'Appointment Letter')} · Issue Date: ${esc(x.issue_date||'—')} · Ref: ${esc(x.reference_no||'—')}</div></div><span class="pill">Published</span></div><div class="meta">Post: ${esc(x.post_name||'—')} · Joining: ${esc(x.joining_date||'—')} ${esc(x.joining_time||'')}</div><div class="actions" style="margin-top:10px"><button type="button" class="outline" data-letter-path="${esc(x.file_path||'')}">Download PDF</button></div></article>`).join('')||'<div class="item">No appointment or joining letter has been published for you.</div>';
    document.querySelectorAll('[data-letter-path]').forEach(b=>b.onclick=async()=>{const path=b.dataset.letterPath;if(!path)return;const x=await db.storage.from('ssc-candidate-deliveries').createSignedUrl(path,600);if(x.error)return alert(x.error.message);window.open(x.data.signedUrl,'_blank','noopener');});
  }
  window.sscRefreshOfficialLetters=()=>getUser().then(u=>u&&load(u.id));
  window.addEventListener('DOMContentLoaded',()=>setTimeout(inject,500));
})();