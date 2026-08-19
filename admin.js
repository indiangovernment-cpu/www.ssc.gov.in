
const cfg=window.SSC_CONFIG||{};
const has=!!(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&window.supabase);
const db=has?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
let user=null, uploadedPath='', uploadedSize='';

const $=id=>document.getElementById(id);
const status=m=>{$('status').textContent=m};

if(!has){status('Supabase is not configured.');$('login').disabled=true}

$('login').onclick=async()=>{
 if(!db)return;
 const email=$('email').value.trim(), password=$('password').value;
 if(!email||!password){status('Enter email and password.');return}
 const {data,error}=await db.auth.signInWithPassword({email,password});
 if(error){status(error.message);return}
 user=data.user; $('auth').hidden=true; $('manager').hidden=false;
 status('Logged in. Upload a PDF/file, then publish it as a notice.');
 await loadNotices();
};

$('upload').onclick=async()=>{
 if(!db||!user)return;
 const file=$('file').files[0];
 if(!file){$('uploadMsg').textContent='Choose a file first.';return}
 const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
 const path=`${user.id}/${Date.now()}-${safe}`;
 const {error}=await db.storage.from('ssc-files').upload(path,file,{upsert:false,contentType:file.type||'application/octet-stream'});
 if(error){$('uploadMsg').textContent=error.message;return}
 uploadedPath=path; uploadedSize=(file.size/1024).toFixed(2)+' KB';
 $('noticePath').value=path;
 $('noticeSize').value=uploadedSize;
 $('fileTitle').value=file.name;
 $('uploadMsg').textContent='Uploaded successfully. You can now publish this file as a notice.';
};

$('publish').onclick=async()=>{
 if(!db||!user)return;
 const title=$('noticeTitle').value.trim();
 if(!title){status('Enter notice title.');return}
 const payload={
   title,
   notice_date:$('noticeDate').value||null,
   file_path:uploadedPath||$('noticePath').value||'',
   file_size:$('noticeSize').value.trim()||uploadedSize||''
 };
 const {error}=await db.from('ssc_notices').insert(payload);
 if(error){status(error.message);return}
 status('Notice published successfully. It will appear on the website.');
 $('noticeTitle').value='';$('noticeDate').value='';$('noticePath').value='';
 $('noticeSize').value='';$('uploadMsg').textContent='';$('file').value='';uploadedPath='';uploadedSize='';
 await loadNotices();
};

$('refresh').onclick=loadNotices;
$('logout').onclick=async()=>{if(db)await db.auth.signOut();location.reload()};

async function loadNotices(){
 if(!db)return;
 const {data,error}=await db.from('ssc_notices').select('*').order('created_at',{ascending:false});
 if(error){$('noticeList').innerHTML=`<div class="muted">${escapeHtml(error.message)}</div>`;return}
 $('noticeList').innerHTML=(data||[]).map(n=>{
   const url=n.file_path?db.storage.from('ssc-files').getPublicUrl(n.file_path).data.publicUrl:'#';
   return `<article><div><b>${escapeHtml(n.title)}</b><div class="muted">${escapeHtml(n.notice_date||'')} · ${escapeHtml(n.file_size||'')}</div></div><a href="${escapeHtml(url)}" target="_blank">PDF</a><button data-delete="${escapeHtml(n.id)}">Delete</button></article>`;
 }).join('')||'<div class="muted">No notices published.</div>';
 document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteNotice(b.dataset.delete));
}
async function deleteNotice(id){
 if(!db||!confirm('Delete this notice?'))return;
 const {data,error}=await db.from('ssc_notices').select('file_path').eq('id',id).single();
 if(error){status(error.message);return}
 const del=await db.from('ssc_notices').delete().eq('id',id);
 if(del.error){status(del.error.message);return}
 if(data?.file_path) await db.storage.from('ssc-files').remove([data.file_path]);
 status('Notice deleted.');
 await loadNotices();
}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
