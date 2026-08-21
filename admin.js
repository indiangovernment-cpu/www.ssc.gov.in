const cfg=window.SSC_CONFIG||{};
const has=!!(cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&window.supabase);
const db=has?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;

let user=null;
let uploadedPath='';
let uploadedSize='';

const CATEGORIES=[
  'CGL',
  'CHSL',
  'JEN',
  'CAPF',
  'CTGD',
  'CHT',
  'OTHERS',
  'DEPARTMENTAL EXAMS',
  'DPHM',
  'RHQ',
  'DPCE',
  'DPCD',
  'DPHCT',
  'CEDP',
  'MTS',
  'STENOGRAPHER'
];

const $=id=>document.getElementById(id);
const status=m=>{
  if($('status')) $('status').textContent=m;
};

function escapeHtml(s){
  return String(s??'').replace(/[&<>"']/g,m=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[m]));
}

/* Create category selector automatically if it is not already present */
function ensureCategoryField(){
  if(!$('publish')) return;

  if($('noticeCategory')) return;

  const select=document.createElement('select');
  select.id='noticeCategory';
  select.name='noticeCategory';
  select.innerHTML=CATEGORIES.map(x=>
    `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`
  ).join('');

  const title=$('noticeTitle');
  const date=$('noticeDate');

  if(title && title.parentElement){
    title.parentElement.insertBefore(select,title.nextSibling);
  }else if(date && date.parentElement){
    date.parentElement.appendChild(select);
  }else{
    $('publish').parentElement.insertBefore(select,$('publish'));
  }

  select.style.width='100%';
  select.style.margin='8px 0';
  select.style.padding='10px';
  select.style.border='1px solid #ccc';
  select.style.borderRadius='6px';
  select.style.background='#fff';
  select.style.color='#111';
}

ensureCategoryField();

if(!has){
  status('Supabase is not configured.');
  if($('login')) $('login').disabled=true;
}

if($('login')){
  $('login').onclick=async()=>{
    if(!db)return;

    const email=$('email').value.trim();
    const password=$('password').value;

    if(!email||!password){
      status('Enter email and password.');
      return;
    }

    const {data,error}=await db.auth.signInWithPassword({
      email,
      password
    });

    if(error){
      status(error.message);
      return;
    }

    user=data.user;

    if($('auth')) $('auth').hidden=true;
    if($('manager')) $('manager').hidden=false;

    ensureCategoryField();

    status('Logged in. Upload a PDF/file, select its category, then publish it.');

    await loadNotices();
  };
}

if($('upload')){
  $('upload').onclick=async()=>{
    if(!db||!user)return;

    const file=$('file').files[0];

    if(!file){
      $('uploadMsg').textContent='Choose a file first.';
      return;
    }

    const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
    const path=`${user.id}/${Date.now()}-${safe}`;

    const {error}=await db.storage
      .from('ssc-files')
      .upload(
        path,
        file,
        {
          upsert:false,
          contentType:file.type||'application/octet-stream'
        }
      );

    if(error){
      $('uploadMsg').textContent=error.message;
      return;
    }

    uploadedPath=path;
    uploadedSize=(file.size/1024).toFixed(2)+' KB';

    if($('noticePath')) $('noticePath').value=path;
    if($('noticeSize')) $('noticeSize').value=uploadedSize;
    if($('fileTitle')) $('fileTitle').value=file.name;

    $('uploadMsg').textContent=
      'Uploaded successfully. Select the result category and publish it.';
  };
}

if($('publish')){
  $('publish').onclick=async()=>{
    if(!db||!user)return;

    ensureCategoryField();

    const title=$('noticeTitle').value.trim();
    const category=$('noticeCategory')
      ? $('noticeCategory').value
      : 'OTHERS';

    if(!title){
      status('Enter notice title.');
      return;
    }

    if(!category){
      status('Select a result category.');
      return;
    }

    const filePath=
      uploadedPath||
      ($('noticePath')?.value||'');

    if(!filePath){
      status('Upload a file first.');
      return;
    }

    const payload={
      title,
      notice_date:$('noticeDate').value||null,
      category,
      file_path:filePath,
      file_size:$('noticeSize').value.trim()||uploadedSize||''
    };

    const {error}=await db
      .from('ssc_notices')
      .insert(payload);

    if(error){
      status(error.message);
      return;
    }

    status(
      `Notice published successfully in ${category} category.`
    );

    $('noticeTitle').value='';
    $('noticeDate').value='';

    if($('noticePath')) $('noticePath').value='';
    if($('noticeSize')) $('noticeSize').value='';
    if($('uploadMsg')) $('uploadMsg').textContent='';
    if($('file')) $('file').value='';

    if($('noticeCategory')){
      $('noticeCategory').value='OTHERS';
    }

    uploadedPath='';
    uploadedSize='';

    await loadNotices();
  };
}

if($('refresh')){
  $('refresh').onclick=loadNotices;
}

if($('logout')){
  $('logout').onclick=async()=>{
    if(db) await db.auth.signOut();
    location.reload();
  };
}

async function loadNotices(){
  if(!db)return;

  const {data,error}=await db
    .from('ssc_notices')
    .select('*')
    .order('created_at',{ascending:false});

  if(error){
    if($('noticeList')){
      $('noticeList').innerHTML=
        `<div class="muted">${escapeHtml(error.message)}</div>`;
    }
    return;
  }

  if(!$('noticeList')) return;

  $('noticeList').innerHTML=(data||[]).map(n=>{
    const url=n.file_path
      ? db.storage
          .from('ssc-files')
          .getPublicUrl(n.file_path)
          .data.publicUrl
      : '#';

    const category=n.category||'OTHERS';

    return `
      <article>
        <div>
          <b>${escapeHtml(n.title)}</b>
          <div class="muted">
            ${escapeHtml(n.notice_date||'')}
            ·
            ${escapeHtml(category)}
            ·
            ${escapeHtml(n.file_size||'')}
          </div>
        </div>

        <a href="${escapeHtml(url)}" target="_blank" rel="noopener">
          PDF
        </a>

        <button data-delete="${escapeHtml(n.id)}">
          Delete
        </button>
      </article>
    `;
  }).join('')||'<div class="muted">No notices published.</div>';

  document
    .querySelectorAll('[data-delete]')
    .forEach(b=>{
      b.onclick=()=>deleteNotice(b.dataset.delete);
    });
}

async function deleteNotice(id){
  if(!db||!confirm('Delete this notice?'))return;

  const {data,error}=await db
    .from('ssc_notices')
    .select('file_path')
    .eq('id',id)
    .single();

  if(error){
    status(error.message);
    return;
  }

  const del=await db
    .from('ssc_notices')
    .delete()
    .eq('id',id);

  if(del.error){
    status(del.error.message);
    return;
  }

  if(data?.file_path){
    await db.storage
      .from('ssc-files')
      .remove([data.file_path]);
  }

  status('Notice deleted.');

  await loadNotices();
}

/* Try to create category field after page is fully loaded too */
window.addEventListener('DOMContentLoaded',()=>{
  ensureCategoryField();
});
