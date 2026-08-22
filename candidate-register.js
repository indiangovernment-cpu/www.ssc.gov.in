const cfg=window.SSC_CONFIG||{};
const db=(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&window.supabase)?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
const $=id=>document.getElementById(id);
$('doRegister')?.addEventListener('click',async()=>{
  const body={email:$('regEmail').value.trim(),password:$('regPassword').value,registration_no:$('regNo').value.trim(),full_name:$('regName').value.trim()};
  if(!body.email||body.password.length<8||!body.registration_no||!body.full_name){$('regMsg').textContent='Email, password (8+), registration number and name are required.';return;}
  $('regMsg').textContent='Creating account…';
  try{
    const r=await fetch((cfg.SUPABASE_URL||'').replace(/\/$/,'')+'/functions/v1/ssc-candidate-register',{method:'POST',headers:{'Content-Type':'application/json','apikey':cfg.SUPABASE_ANON_KEY||''},body:JSON.stringify(body)});
    const out=await r.json().catch(()=>({}));
    if(!r.ok){$('regMsg').textContent=out.error||'Registration failed.';return;}
    $('regMsg').textContent='Registration successful. You can now login with your Registration Number and password.';
    $('regNo').value=''; $('regName').value=''; $('regEmail').value=''; $('regPassword').value='';
  }catch(e){$('regMsg').textContent='Registration failed. Check internet connection.';}
});
