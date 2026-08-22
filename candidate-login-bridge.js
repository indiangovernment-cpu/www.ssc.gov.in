/*
  Additive bridge: keeps the existing SSC site intact.
  It only redirects the existing Candidate Login / Forgot Password / Register
  controls to the new secure Candidate Portal.
*/
(function(){
  function wire(){
    const login=document.getElementById('candidateLogin');
    if(login && !login.dataset.portalWired){
      login.dataset.portalWired='1';
      login.onclick=function(){location.href='candidate-portal.html'};
    }
    document.querySelectorAll('.forgot').forEach(a=>{
      if(!a.dataset.portalWired){a.dataset.portalWired='1';a.onclick=e=>{e.preventDefault();location.href='candidate-portal.html'};}
    });
    document.querySelectorAll('.loginlinks a').forEach(a=>{
      if(!a.dataset.portalWired){a.dataset.portalWired='1';a.onclick=e=>{e.preventDefault();location.href='candidate-portal.html'};}
    });
  }
  new MutationObserver(wire).observe(document.documentElement,{subtree:true,childList:true});
  wire();
})();