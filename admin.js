const cfg=window.SSC_CONFIG||{};
const has=!!(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&window.supabase);
let client=null,user=null,last=null;
const $=id=>document.getElementById(id), status=$('status');
if(has){client=supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);status.textContent='Supabase configured. Login as your admin user.';}else{status.textContent='Supabase configuration is missing.';$('login').disabled=true;}

$('login').onclick=async()=>{
  if(!client)return;
  const email=$('email').value.trim(),password=$('password').value;
  if(!email||!password){status.textContent='Enter admin email and password.';return;}
  status.textContent='Logging in...';
  const {data,error}=await client.auth.signInWithPassword({email,password});
  if(error){status.textContent=error.message;return;}
  user=data.user;
  $('authPanel').hidden=true;$('manager').hidden=false;$('contentPanel').hidden=false;
  status.textContent='Logged in. You can upload files and publish notices.';
  await loadAll();
};

$('upload').onclick=async()=>{
  if(!client||!user){$('uploadMsg').textContent='Please login first.';return;}
  const f=$('file').files[0], title=$('title').value.trim();
  if(!f){$('uploadMsg').textContent='Choose a file first.';return;}
  if(!title){$('uploadMsg').textContent='Enter a display title.';return;}
  $('uploadMsg').textContent='Uploading...';
  const safe=f.name.replace(/[^a-zA-Z0-9._-]/g,'_');
  const path=`${user.id}/${Date.now()}-${safe}`;
  const {error}=await client.storage.from('ssc-files').upload(path,f,{upsert:false,contentType:f.type||undefined});
  if(error){$('uploadMsg').textContent=error.message;return;}
  const {data}=client.storage.from('ssc-files').getPublicUrl(path);
  last={path,url:data.publicUrl,title,size:size(f.size),name:f.name};
  try{await client.from('ssc_files').insert({title,storage_path:path});}catch(e){}
  $('noticeTitle').value=$('noticeTitle').value||title;
  $('noticeSize').value=$('noticeSize').value||last.size;
  $('uploadMsg').textContent='Uploaded successfully. Click Save Notice to publish it on the website.';
};

$('saveNotice').onclick=async()=>{
  if(!client||!user){status.textContent='Please login first.';return;}
  if(!last){status.textContent='Please upload a file first.';return;}
  const title=$('noticeTitle').value.trim();
  if(!title){status.textContent='Enter a notice title.';return;}
  const {error}=await client.from('ssc_notices').insert({title,notice_date:$('noticeDate').value||null,file_path:last.url,file_size:$('noticeSize').value||last.size});
  if(error){status.textContent=error.message;return;}
  status.textContent='Notice published successfully.';
  $('file').value='';$('title').value='';$('noticeTitle').value='';$('noticeDate').value='';$('noticeSize').value='';$('uploadMsg').textContent='';last=null;
  await loadAll();
};

async function loadAll(){
  if(!client)return;
  const {data,error}=await client.from('ssc_notices').select('*').order('created_at',{ascending:false});
  if(error){$('noticeList').textContent=error.message;return;}
  $('noticeList').innerHTML=(data||[]).map(n=>`<article class="notice"><b>${esc(n.title)}</b><small>${esc(n.notice_date||'')} · ${esc(n.file_size||'')}</small>${n.file_path?`<a target="_blank" rel="noopener" href="${esc(n.file_path)}">Open / Download File</a>`:''}<button class="deleteNotice" data-id="${esc(n.id)}">Delete Notice</button></article>`).join('')||'<p>No notices yet.</p>';
  document.querySelectorAll('.deleteNotice').forEach(b=>b.onclick=()=>deleteNotice(b.dataset.id));
}
async function deleteNotice(id){
  if(!confirm('Delete this notice?'))return;
  const {error}=await client.from('ssc_notices').delete().eq('id',id);
  status.textContent=error?error.message:'Notice deleted.';
  if(!error)loadAll();
}
function size(b){let k=b/1024;return k<1024?k.toFixed(2)+' KB':(k/1024).toFixed(2)+' MB'}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
