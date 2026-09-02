(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  function showSection(name){
    document.querySelectorAll('.view').forEach(v => { v.hidden = v.id !== name; });
    document.querySelectorAll('[data-section]').forEach(b => b.classList.toggle('active', b.dataset.section === name));
    const target = $(name);
    if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function fillDashboard(){
    const copy = (from,to) => { const a=$(from),b=$(to); if(a&&b) b.textContent = a.value || a.textContent || '—'; };
    const w=$('welcome'),dn=$('dashName');
    if(w&&dn){ const n=(w.textContent||'').replace(/^Welcome,?\s*/,'').trim(); if(n) dn.textContent=n; }
    const av=$('avatarInitial');
    if(av&&dn){ const n=dn.textContent.trim(); av.textContent=(n[0]||'C').toUpperCase(); }
    const c=window.__sscCandidateDashboardTimer;
    copy('pFather','dashFather'); copy('pMother','dashMother'); copy('pPhone','dashPhone'); copy('pEmail','dashEmail'); copy('pAddress','dashAddress');
    const r=$('assignedReg'),rr=$('dashReg'); if(r&&rr) rr.textContent='Reg. No.: '+(r.textContent||'Not assigned');
    const ro=$('assignedRoll'),dro=$('dashRoll'); if(ro&&dro) dro.textContent='Roll No.: '+(ro.textContent||'Not assigned');
    const portal=$('portal'); if(portal&&!portal.hidden&&c) clearInterval(c);
  }
  function init(){
    document.querySelectorAll('[data-section]').forEach(btn => btn.addEventListener('click',()=>showSection(btn.dataset.section)));
    const list=$('applicationList'),history=$('historyList');
    if(list&&history){
      const sync=()=>{ if(list.innerHTML.trim()) history.innerHTML=list.innerHTML; };
      new MutationObserver(sync).observe(list,{childList:true,subtree:true});
      sync();
    }
    let tries=0;
    const timer=setInterval(()=>{fillDashboard();if(++tries>30)clearInterval(timer)},500);
    window.__sscCandidateDashboardTimer=timer;
    showSection('live');
  }
  window.addEventListener('DOMContentLoaded',init);
})();
