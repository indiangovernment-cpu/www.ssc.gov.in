const cfg = window.SSC_CONFIG || {};
const hasSupabase = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase);
const db = hasSupabase ? supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

const EXAMS = [
  'Selection Posts Examination',
  'Combined Graduate Level Examination',
  'Stenographer Grade C and D Examination',
  'Junior Engineer (Civil, Mechanical & Electrical) Examination',
  'Combined Higher Secondary Level (10+2) Examination',
  'Constable (GD) in CAPFs, SSF, Rifleman (GD) in Assam Rifles and Sepoy in NCB Examination',
  'Combined Hindi Translators Examination',
  'Sub-Inspector in Delhi Police and CAPFs Examination',
  'Multi-Tasking (Non-Technical) Staff Examination',
  'Junior Secretariat Assistant / Lower Division Clerk Examination'
];

const EXAM_RESOURCES = ['Scribe Procedure','Script Evaluation','Examination Calendar','Scheme of Examination','Syllabus','Special Instructions','Previous Year Question Papers','Format of Certificates','Tentative Vacancy','Normalization Method','Mock Test'];
const CANDIDATE_MENU = ['Apply Online','Admit Card','Answer Key','Result','Candidate Login','One Time Registration (OTR)','Correction Window','Exam City / Intimation','Option-cum-Preference'];
const NAV = [
  ['Home','home'],
  ["Chairman's Message",'chairman'],
  ['For Candidates','candidates',CANDIDATE_MENU],
  ['Tender','tender',['Current Tenders','Tender Archive','Corrigenda']],
  ['RTI','rti',['RTI Online','RTI Disclosure','RTI Officers']],
  ['About Us','about',['About Commission','Functions','Contact Us','Help','Website Policies']]
];

const fallbackNotices = [
  {id:'demo1',notice_date:'2026-07-24',title:'Important Notice regarding SSC Examinations',file_size:'323.27 KB',file_path:''},
  {id:'demo2',notice_date:'2026-07-20',title:'Corrigendum and candidate instructions for Selection Posts Examination',file_size:'87.66 KB',file_path:''},
  {id:'demo3',notice_date:'2026-07-16',title:'Tentative Answer Keys along with Candidates Response Sheets',file_size:'201.93 KB',file_path:''},
  {id:'demo4',notice_date:'2026-07-15',title:'Tentative vacancies for departmental competitive examination',file_size:'421.09 KB',file_path:''},
  {id:'demo5',notice_date:'2026-07-14',title:'Identity Verification for shortlisted candidates',file_size:'140.19 KB',file_path:''},
  {id:'demo6',notice_date:'2026-07-13',title:'Junior Engineer Examination: candidate instructions',file_size:'670.86 KB',file_path:''},
  {id:'demo7',notice_date:'2026-07-10',title:'Declaration of first round of tentative allocation',file_size:'401.67 KB',file_path:''}
];

let state = { notices:[...fallbackNotices], noticePage:1, month:new Date().getMonth(), year:new Date().getFullYear(), lang:'en', user:null };

const esc = v => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const slug = x => x.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const fmtDate = d => { const x=new Date(d+'T00:00:00'); return {day:String(x.getDate()).padStart(2,'0'), month:x.toLocaleString('en',{month:'short'}).toUpperCase(), year:x.getFullYear()}; };

const t = {
  en:{home:'Home',candidates:'For Candidates',browse:'Browse by Examinations',notices:'Notice Board',about:'About Us',quick:'Quick Links',calendar:'SSC Calendar',faq:'FAQs',initiatives:'Other Initiatives',viewAll:'View All',login:'Login or Register',search:'Search'},
  hi:{home:'होम',candidates:'अभ्यर्थियों के लिए',browse:'परीक्षाओं के अनुसार',notices:'नोटिस बोर्ड',about:'हमारे बारे में',quick:'त्वरित लिंक',calendar:'एसएससी कैलेंडर',faq:'अक्सर पूछे जाने वाले प्रश्न',initiatives:'अन्य पहल',viewAll:'सभी देखें',login:'लॉगिन या रजिस्टर',search:'खोजें'}
};
function tr(k){return t[state.lang][k]||t.en[k]||k;}

function shell(){
  document.getElementById('app').innerHTML = `
  <div class="gov-strip"><div class="container"><span>Feedback | Staff Selection Commission</span><span>Skip to Main Content &nbsp;|&nbsp; ${state.lang==='en'?'हिन्दी':'English'} &nbsp;|&nbsp; A- A A+</span></div></div>
  <header class="ssc-header"><div class="container header-main">
    <a href="#home" class="brand" data-route="home"><img class="brand-reference" src="assets/brand.jpg" alt="Staff Selection Commission"></a>
    <div class="header-actions"><button class="lang-btn" id="langBtn">${state.lang==='en'?'हिन्दी':'English'}</button><div class="searchbox"><input id="searchInput" placeholder="${tr('search')}..." aria-label="Search"><button id="searchBtn" aria-label="Search">⌕</button></div><button class="login-btn" id="loginBtn">${tr('login')}</button></div>
  </div></header>
  <nav class="nav"><div class="container nav-inner">${NAV.map(n=>navItem(n)).join('')}</div></nav>

  <main id="main-content">
    <section class="hero"><div class="hero-image"><img class="reference-hero" src="assets/hero.jpg" alt="Staff Selection Commission building"></div></section>
    <section class="notice-banner"><div class="container"><div>For inquiries or support, candidates can use the candidate services and help options.</div><div>Follow the Staff Selection Commission on official social channels.</div><div>One Time Registration (OTR) and examination updates are published here.</div><a href="#" data-route="candidate-login">Join / Candidate Login</a></div></section>

    <section class="section notice-section" id="notices"><div class="container"><div class="section-head"><h2>${tr('notices')}</h2><button class="text-link" data-route="notices-all">${tr('viewAll')}</button></div><div class="notice-card"><div id="noticeList"></div><div class="pager" id="pager"></div></div></div></section>

    <section class="section compact"><div class="container"><h2 class="small-title">${tr('quick')}</h2><div class="quick-grid">${quickLinks()}</div></div></section>

    <section class="section compact"><div class="container"><div class="calendar-card"><div class="calendar-head"><h2 class="small-title">${tr('calendar')}</h2><div class="month-nav"><button id="prevMonth">‹</button><b id="calMonth"></b><button id="nextMonth">›</button></div></div><div id="calendarList" class="cal-list"></div><button class="viewall" data-route="calendar">${tr('viewAll')}</button></div></div></section>

    <section class="exam-band"><div class="container exam-layout"><div class="exam-intro"><h2>Browse by Examinations</h2><p>Explore exam-related details and relevant resources.</p><button class="light-btn" data-route="browse-all">View All</button></div><div><div class="exam-grid" id="examGrid"></div><div class="carousel-dots" id="examDots"></div></div></div></section>

    <section class="section compact"><div class="container promo-grid" id="promoGrid"></div></section>

    <section class="section faq-section"><div class="container faq-layout"><div class="faq-copy"><h2>${tr('faq')}</h2><p>List of common inquiries and their brief answers to provide quick information and assistance.</p><button class="primary" data-route="faq">${tr('viewAll')}</button></div><div class="faq-list" id="faqList"></div></div></section>

    <section class="section initiatives"><div class="container"><h2 class="small-title">${tr('initiatives')}</h2><div class="initiative-row"><a class="initiative" href="https://www.india.gov.in/" target="_blank" rel="noopener"><img src="assets/initiative-india.jpg" alt="India.gov.in"></a><a class="initiative" href="https://www.mygov.in/" target="_blank" rel="noopener"><img src="assets/initiative-mygov.jpg" alt="MyGov"></a><a class="initiative" href="https://www.incredibleindia.gov.in/" target="_blank" rel="noopener"><img src="assets/initiative-incredible.jpg" alt="Incredible India"></a><a class="initiative" href="https://www.data.gov.in/" target="_blank" rel="noopener"><img src="assets/initiative-data.jpg" alt="data.gov.in"></a><a class="initiative" href="https://www.digitalindia.gov.in/" target="_blank" rel="noopener"><img src="assets/initiative-digital.jpg" alt="Digital India"></a></div></div></section>
  </main>
  <footer class="footer"><div class="container footer-grid"><div><div class="footer-brand"><div class="emblem small">SSC</div><b>Staff Selection Commission</b></div><p>Public Disclosure of Scores and Other Details of Non-Recommended Willing Candidates</p><p>List of Debarred Candidates in Examinations Conducted by the Staff Selection Commission</p></div><div><h3>Useful Links</h3><a data-route="archive">DoPT</a><a data-route="archive">Archives</a><a data-route="contact">Disclaimer</a><a data-route="contact">Sitemap</a><a data-route="contact">Help</a><a data-route="contact">Website Policies</a><a data-route="contact">Web Information Manager</a></div><div><h3>Contact Us</h3><p>Block No-12, CGO Complex, Lodhi Road<br>New Delhi - 110003</p><a data-route="contact">Contact details</a></div></div><div class="container footer-bottom"><span>© 2026 SSC. All Rights Reserved.</span><span>Total Visitor Count: <b id="visitorCount">0</b></span><span>Last updated on Aug 19, 2026</span></div></footer>`;
  bind(); renderNotices(); renderCalendar(); renderExams(0); renderPromos(); renderFaq(); loadRemoteNotices();
}

function navItem(n){ const [label,id,items]=n; return `<div class="nav-item"><button class="nav-btn" data-nav="${id}">${tr(id)}${items?' <span class="caret">⌄</span>':''}</button>${items?`<div class="dropdown">${items.map(x=>`<button class="drop-link" data-route="${slug(x)}">${esc(x)}</button>`).join('')}</div>`:''}</div>`; }
function quickLinks(){ return [['✎','Apply Online','apply-online'],['▣','Admit Card','admit-card'],['▤','Answer Key','answer-key'],['✓','Result','result']].map(x=>`<button class="quick" data-route="${x[2]}"><span class="ico">${x[0]}</span><span>${x[1]}</span></button>`).join(''); }

function bind(){
  document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>{const p=b.parentElement; document.querySelectorAll('.nav-item').forEach(x=>x!==p&&x.classList.remove('open')); p.classList.toggle('open');});
  document.addEventListener('click', e=>{if(!e.target.closest('.nav-item')) document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('open')); const r=e.target.closest('[data-route]'); if(r){e.preventDefault();route(r.dataset.route);}});
  document.getElementById('loginBtn').onclick=()=>loginModal();
  document.getElementById('langBtn').onclick=()=>{state.lang=state.lang==='en'?'hi':'en';shell();};
  document.getElementById('searchBtn').onclick=()=>search(document.getElementById('searchInput').value);
  document.getElementById('searchInput').onkeydown=e=>{if(e.key==='Enter')search(e.target.value);};
  document.getElementById('prevMonth').onclick=()=>changeMonth(-1); document.getElementById('nextMonth').onclick=()=>changeMonth(1);
  document.getElementById('visitorCount').textContent=(Math.floor(Math.random()*80000)+468000000).toLocaleString('en-IN');
}

async function loadRemoteNotices(){ if(!db)return; const {data,error}=await db.from('ssc_notices').select('*').order('notice_date',{ascending:false}).limit(100); if(!error&&data&&data.length){state.notices=data; state.noticePage=1; renderNotices();} }

function renderNotices(){
  const per=7, total=Math.max(1,Math.ceil(state.notices.length/per)), page=Math.min(state.noticePage,total), rows=state.notices.slice((page-1)*per,page*per);
  document.getElementById('noticeList').innerHTML=rows.map(n=>{const d=fmtDate(n.notice_date||'2026-08-01'); const url=n.file_path?getPublicUrl(n.file_path):''; return `<div class="notice-row"><div class="datebox"><span>${d.month}</span><b>${d.day}</b><small>${d.year}</small></div><button class="notice-title" data-route="notice:${n.id}">${esc(n.title)}</button><span class="notice-meta">${esc(n.file_size||'')}</span><div class="notice-actions">${url?`<a class="pdf" href="${esc(url)}" target="_blank" rel="noopener">PDF</a><a class="eye" href="${esc(url)}" target="_blank" rel="noopener">◉</a>`:'<span class="pdf disabled">PDF</span>'}</div></div>`;}).join('')||'<div class="empty">No notices available.</div>';
  document.getElementById('pager').innerHTML=`<button ${page<=1?'disabled':''} data-page="${page-1}">‹</button>${Array.from({length:Math.min(total,3)},(_,i)=>`<button class="${page===i+1?'current':''}" data-page="${i+1}">${i+1}</button>`).join('')}${total>4?'<span>…</span>':''}<button ${page>=total?'disabled':''} data-page="${page+1}">›</button>`;
  document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{const p=Number(b.dataset.page); if(p>=1&&p<=total){state.noticePage=p;renderNotices();}});
}
function getPublicUrl(path){ if(!path)return ''; if(/^https?:\/\//i.test(path)) return path; if(!db)return ''; const {data}=db.storage.from('ssc-files').getPublicUrl(path); return data.publicUrl; }

function renderCalendar(){
  const d=new Date(state.year,state.month,1); document.getElementById('calMonth').textContent=d.toLocaleString(state.lang==='hi'?'hi-IN':'en-IN',{month:'short',year:'numeric'});
  const items=[['30','APR','Combined Hindi Translators Examination, 2026'],['31','MAR','Sub-Inspector in Delhi Police and CAPFs Examination, 2026'],['5','JUN','Indian Navy Entrance Test / Apprentice'],['30','JUN','Multi Tasking (Non-Technical) Staff Examination, 2026']];
  document.getElementById('calendarList').innerHTML=items.map(x=>`<button class="cal-row" data-route="calendar"><div class="cal-date"><b>${x[0]}</b><small>${x[1]}</small></div><span>${x[2]}</span></button>`).join('');
}
function changeMonth(n){state.month+=n; if(state.month<0){state.month=11;state.year--;} if(state.month>11){state.month=0;state.year++;} renderCalendar();}

let examPage=0;
function renderExams(page){ examPage=page; const start=page*6; const cards=EXAMS.slice(start,start+6); document.getElementById('examGrid').innerHTML=cards.map((x,i)=>`<button class="exam-card" data-route="exam:${encodeURIComponent(x)}"><span><b>${esc(x)}</b><small>Notice, schedule, syllabus and candidate resources</small></span><strong>→</strong></button>`).join(''); const pages=Math.ceil(EXAMS.length/6); document.getElementById('examDots').innerHTML=Array.from({length:pages},(_,i)=>`<button class="${i===page?'active':''}" data-exampage="${i}"></button>`).join(''); document.querySelectorAll('[data-exampage]').forEach(b=>b.onclick=()=>renderExams(Number(b.dataset.exampage))); }
function renderPromos(){ const items=[['assets/promo-1.jpg','75 Years of Azadi Ka Amrit Mahotsav','75 Years of Azadi Ka Amrit Mahotsav'],['assets/promo-2.jpg','Mann Ki Baat / Government Outreach','Mann Ki Baat / Government Outreach'],['assets/promo-3.jpg','International Yoga Day','International Yoga Day']]; document.getElementById('promoGrid').innerHTML=items.map(x=>`<article class="promo"><img src="${x[0]}" alt="${esc(x[1])}"><div class="promo-body"><b>${esc(x[2])}</b><p>Government information and citizen outreach.</p></div></article>`).join(''); }
function renderFaq(){const faq=[['Is registration required for applying to examinations?','Yes. Candidates need an SSC registration/profile before submitting examination applications.'],['I did not receive registration number and password on email.','Use the forgot-password/recovery service from Candidate Login.'],['When is the notice/admit card available?','Availability depends on the examination schedule and Commission publication.'],['What are the posts for which SSC conducts exams?','Open Browse by Examinations to see current examination categories and resources.'],['Where does the Commission upload its Annual Calendar?','Use SSC Calendar from the home page and the examination calendar resource.']]; document.getElementById('faqList').innerHTML=faq.map(f=>`<div class="faq-item"><button class="faq-q">${esc(f[0])}<span>⊕</span></button><div class="faq-a">${esc(f[1])}</div></div>`).join(''); document.querySelectorAll('.faq-q').forEach(b=>b.onclick=()=>b.parentElement.classList.toggle('open'));}

async function search(q){q=q.trim();if(!q)return;let hits=[...EXAMS,...EXAM_RESOURCES,...CANDIDATE_MENU,...state.notices.map(n=>n.title)].filter(x=>x.toLowerCase().includes(q.toLowerCase())); if(db){const {data}=await db.from('ssc_notices').select('*').ilike('title',`%${q}%`).limit(20); if(data)hits=[...hits,...data.map(x=>x.title)];} hits=[...new Set(hits)]; modal(`<div class="modal"><div class="modal-head"><h2>Search Results</h2><button class="close">×</button></div><div class="modal-body">${hits.length?hits.map(x=>`<button class="search-item" data-route="${slug(x)}">${esc(x)}</button>`).join(''):'<p>No matching results found.</p>'}</div></div>`);}

function loginModal(){ modal(`<div class="modal small"><div class="modal-head"><h2>Login / Register</h2><button class="close">×</button></div><div class="login-tabs"><button class="active" data-tab="login">Login</button><button data-tab="register">Register</button></div><div class="modal-body" id="authBody"></div></div>`); renderAuth('login'); document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>renderAuth(b.dataset.tab)); }
function renderAuth(mode){ const b=document.getElementById('authBody'); if(!b)return; if(mode==='register'){b.innerHTML=`<div class="form-group"><label>Email</label><input id="regEmail" type="email"></div><div class="form-group"><label>Password</label><input id="regPassword" type="password"></div><button class="primary wide" id="registerSubmit">Register</button><p class="muted">You can manage candidate authentication through Supabase.</p>`; document.getElementById('registerSubmit').onclick=async()=>{if(!db){toast('Add Supabase configuration first.');return;}const {error}=await db.auth.signUp({email:regEmail.value,password:regPassword.value});toast(error?error.message:'Registration submitted. Check your email if confirmation is enabled.');};return;} b.innerHTML=`<div class="form-group"><label>Registration Number / Email</label><input id="authEmail"></div><div class="form-group"><label>Password</label><input id="authPassword" type="password"></div><div class="captcha"><span class="captcha-code">SSC 26</span><input id="authCaptcha" placeholder="Captcha"></div><button class="primary wide" id="loginSubmit">Login</button><div class="auth-links"><button id="forgotBtn">Forgot Password?</button><button data-route="apply-online">New User? Register Now</button></div>`; document.getElementById('loginSubmit').onclick=async()=>{if(!db){toast('Demo mode: configure Supabase to enable login.');return;}const {data,error}=await db.auth.signInWithPassword({email:authEmail.value,password:authPassword.value});if(error){toast(error.message);return;}state.user=data.user;toast('Login successful');document.getElementById('modal-root').innerHTML='';}; document.getElementById('forgotBtn').onclick=async()=>{if(!db){toast('Configure Supabase first.');return;}const email=authEmail.value.trim();if(!email){toast('Enter your email first.');return;}const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});toast(error?error.message:'Password reset email sent.');};}

function route(r){ document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('open')); if(r==='home'){scrollTo({top:0,behavior:'smooth'});return;} if(r.startsWith('notice:')){const n=state.notices.find(x=>String(x.id)===r.split(':')[1]); if(n) modal(`<div class="modal"><div class="modal-head"><h2>Notice</h2><button class="close">×</button></div><div class="modal-body"><h3>${esc(n.title)}</h3><p>Date: ${esc(n.notice_date||'')}</p><p>File size: ${esc(n.file_size||'')}</p>${n.file_path?`<a class="primary inline" href="${esc(getPublicUrl(n.file_path))}" target="_blank">Open PDF</a>`:'<p class="muted">No attachment is linked to this notice.</p>'}</div></div>`);return;}
 if(r.startsWith('exam:')){const name=decodeURIComponent(r.slice(5)); modal(`<div class="modal"><div class="modal-head"><h2>${esc(name)}</h2><button class="close">×</button></div><div class="tabs">${['Notice','Calendar','Scheme','Syllabus','Instructions','Question Paper','Vacancy','Mock Test'].map(x=>`<button class="tab" data-examtab="${slug(x)}">${x}</button>`).join('')}</div><div class="modal-body" id="examBody"><h3>Candidate resources</h3><p>Select a tab to open the corresponding examination information.</p></div></div>`);document.querySelectorAll('[data-examtab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-examtab]').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById('examBody').innerHTML=`<h3>${esc(b.textContent)}</h3><p>${esc(name)} — ${esc(b.textContent)} information is ready for your content/data source.</p>`;});return;}
 const map={'apply-online':['Apply Online','Start or continue an examination application.'], 'admit-card':['Admit Card','Select an examination and open the candidate login to download the admission certificate.'], 'answer-key':['Answer Key','View provisional/final answer keys and response sheet information.'], result:['Result','Search examination results, write-ups and marks information.'], 'candidate-login':['Candidate Login','Login using your registration credentials.'], 'one-time-registration-otr':['One Time Registration (OTR)','Create or update your SSC candidate profile.'], 'correction-window':['Correction Window','Open an active correction window when available.'], 'exam-city-intimation':['Exam City / Intimation','View examination city and schedule information when published.'], 'option-cum-preference':['Option-cum-Preference','Submit preferences for examinations/posts when the facility is active.'], 'notices-all':['Notice Archive','Browse all notices with pagination and file links.'], 'archive':['Archives','Access archived notices and public documents.'], faq:['FAQs','Browse common candidate questions and answers.'], calendar:['SSC Calendar','Browse examination calendar months and dates.'], contact:['Contact Us','SSC Headquarters and help information.'], about:['About Commission','Information about the Staff Selection Commission.'], chairman:["Chairman’s Message",'Message and information from the Commission leadership.'], tender:['Tenders','Current tenders, corrigenda and archived tender documents.'], rti:['RTI','RTI online information, disclosures and designated officers.'], functions:['Functions','Commission functions and examination responsibilities.'], 'browse-all':['Browse by Examinations','Select an examination to open its resources.']};
 if(map[r]){ if(r==='admit-card'||r==='candidate-login') {loginModal();return;} if(r==='browse-all'){modal(`<div class="modal"><div class="modal-head"><h2>Browse by Examinations</h2><button class="close">×</button></div><div class="modal-body exam-menu">${EXAMS.map(x=>`<button data-route="exam:${encodeURIComponent(x)}">${esc(x)} <span>→</span></button>`).join('')}</div></div>`);return;} modal(`<div class="modal"><div class="modal-head"><h2>${esc(map[r][0])}</h2><button class="close">×</button></div><div class="modal-body"><p>${esc(map[r][1])}</p>${r==='result'?'<div class="result-filter"><select><option>All Examinations</option>'+EXAMS.map(x=>`<option>${esc(x)}</option>`).join('')+'</select><input placeholder="Search result / roll number"><button class="primary">Search</button></div>':''}${r==='apply-online'?'<div class="result-row"><b>New registration</b><button class="primary">Start</button></div><div class="result-row"><b>Existing application</b><button class="primary">Continue</button></div>':''}${r==='answer-key'?'<div class="result-row"><b>Provisional Answer Key</b><button class="primary">Open</button></div><div class="result-row"><b>Final Answer Key</b><button class="primary">Open</button></div>':''}</div></div>`); return; }
 const target=document.getElementById(r)||document.getElementById('notices'); target?.scrollIntoView({behavior:'smooth'});
}
function modal(html){const root=document.getElementById('modal-root');root.innerHTML=`<div class="modal-backdrop">${html}</div>`;root.querySelector('.close')?.addEventListener('click',()=>root.innerHTML='');root.querySelector('.modal-backdrop').addEventListener('click',e=>{if(e.target===e.currentTarget)root.innerHTML='';});}
function toast(msg){const x=document.getElementById('toast');x.textContent=msg;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),3000);}

shell();
