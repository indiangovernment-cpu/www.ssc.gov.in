
const cfg = window.SSC_CONFIG || {};
const db = (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase)
  ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

const A = 'assets/';
const state = {
  lang: localStorage.getItem('sscLang') || 'en',
  notices: [],
  page: 1,
  month: 7,
  year: 2026,
  examPage: 0,
  promoPage: 0,
  initiativePage: 0
};

const EXAMS = [
 'Selection Posts Examination',
 'Junior Engineer (Civil, Mechanical & Electrical) Examination',
 'Combined Graduate Level Examination, 2024',
 'Combined Higher Secondary Level (10+2) Examination',
 "Stenographer Grade 'C' and 'D' Examination, 2024",
 'Constable (GD) in Central Armed Police Forces (CAPFs), SSF, Rifleman (GD) in Assam Rifles and Sepoy in NCB Examination',
 'Combined Hindi Translators Examination',
 'Sub-Inspector in Delhi Police and Central Armed Police Forces Examination',
 'Multi-Tasking (Non-Technical) Staff Examination',
 'Junior Secretariat Assistant / Lower Division Clerk Examination',
 'Departmental Examination'
];

const CANDIDATES = [
 'Apply Online','Admit Card','Answer Key','Result','Candidate Login',
 'One Time Registration (OTR)','Correction Window','Exam City / Intimation',
 'Option-cum-Preference'
];

const ABOUT = [
 'Background of Commission','Setup of Commission','Organisation Structure',
 'Function of Commission','Vision, Mission & Objectives of SSC','Regional Network',
 'Annual Report',"Citizen's Charter",'Contact List','Resolution','PIDPI',
 'Right To Information','Committee on Sexual Harassment'
];

const TENDER = ['Current Tenders','Tender Archive','Corrigenda'];
const RTI = ['RTI Online','RTI Disclosure','RTI Officers'];
const EXAM_RESOURCES = [
 'Notice','Calendar','Scheme of Examination','Syllabus','Special Instructions',
 'Previous Year Question Papers','Format of Certificates','Tentative Vacancy',
 'Normalization Method','Mock Test'
];

const FALLBACK_NOTICES = [
 {id:'f1',notice_date:'2026-08-18',title:'Important Notice',file_size:'184.92 KB',file_path:''},
 {id:'f2',notice_date:'2026-08-18',title:'Identity Verification (IV) for the candidates shortlisted in FRTA of Combined Higher Secondary (10+2) Level Examination (CHSLE), 2025 - reg',file_size:'83.41 KB',file_path:''},
 {id:'f3',notice_date:'2026-08-17',title:'Combined Higher Secondary (10+2) Level Examination, 2025 - Declaration of First Round of Tentative Allocation (FRTA)',file_size:'811.22 KB',file_path:''},
 {id:'f4',notice_date:'2026-08-17',title:'Important Notice for Departmental examinations, 2025 to be held on 23.08.2026 at Delhi',file_size:'247.52 KB',file_path:''},
 {id:'f5',notice_date:'2026-08-12',title:'Important Notice - Schedule of Examinations',file_size:'364.75 KB',file_path:''}
];

const CALENDAR = [
 ['2026-08-14','Indian Navy Entrance Test (INET) - [Agniveer (MR as SSR) and SSR (Medical)]'],
 ['2026-08-16','JSA / LDC Grade Limited Departmental Competitive Examination, 2025 (for DoPT only)'],
 ['2026-08-16','ASO Grade Limited Departmental Competitive Examination, 2025'],
 ['2026-08-16','SSA / UDC Grade Limited Departmental Competitive Examination, 2025 (for DoPT only)'],
 ['2026-08-30','Combined Higher Secondary Level (10+2) Examination, 2026'],
 ['2026-08-30','Stenographer Grade C and D Examination, 2026'],
 ['2026-08-30','Combined Hindi Translators Examination, 2026'],
 ['2026-09-30','Multi Tasking (Non-Technical) Staff Examination, 2026']
];

const PROMOS = [
 ['promo-reference-1.jpg','International Day of Yoga'],
 ['promo-reference-2.jpg','Mahatma Gandhi Quote / National Outreach'],
 ['promo-reference-3.jpg','National Career Service']
];

const INITIATIVES = [
 ['initiative-reference-1.jpg','India Empower'],
 ['initiative-reference-2.jpg','india.gov.in'],
 ['initiative-reference-3.jpg','Make in India'],
 ['initiative-reference-4.jpg','Incredible India'],
 ['initiative-reference-5.jpg','data.gov.in']
];

const FAQ = [
 ['Is Registration mandatory for applying to the examinations of the Commission?','Registration is required before applying for examinations where the Commission specifies it.'],
 ['I did not receive registration number and password on the email.','Use the Candidate Login recovery option or contact the Commission help services.'],
 ['When is the notice/advertisement of an Examination issued?','The notice is published when the Commission approves and schedules the examination.'],
 ['What are the posts for which the SSC conducts exams and what are the required qualifications?','Open the relevant examination to see eligibility, syllabus and qualifications.'],
 ['When does the Commission upload its Annual Calendar of Examinations?','The Annual Calendar is published according to the Commission schedule.']
];

const I18N = {
 en:{feedback:'Feedback | SSC Old Website',skip:'Skip to Main Content',home:'Home',chair:"Chairman's Message",cand:'For Candidates',tender:'Tender',rti:'RTI',about:'About Us',search:'Search',login:'Login or Register',notice:'Notice Board',quick:'Quick Links',calendar:'SSC Calendar',browse:'Browse by Examinations',faq:'FAQs',popular:'MOST POPULAR FAQS',initiatives:'Other Initiatives',view:'View All',apply:'Apply',admit:'Admit Card',answer:'Answer Key',result:'Result'},
 hi:{feedback:'प्रतिक्रिया | एसएससी पुरानी वेबसाइट',skip:'मुख्य विषय पर जाएं',home:'होम',chair:'अध्यक्ष का संदेश',cand:'अभ्यर्थियों के लिए',tender:'निविदा',rti:'आरटीआई',about:'हमारे बारे में',search:'खोजें',login:'लॉगिन या रजिस्टर',notice:'नोटिस बोर्ड',quick:'त्वरित लिंक',calendar:'एसएससी कैलेंडर',browse:'परीक्षाओं के अनुसार',faq:'अक्सर पूछे जाने वाले प्रश्न',popular:'लोकप्रिय प्रश्न',initiatives:'अन्य पहल',view:'सभी देखें',apply:'आवेदन करें',admit:'प्रवेश पत्र',answer:'उत्तर कुंजी',result:'परिणाम'}
};

const tr = k => (I18N[state.lang] && I18N[state.lang][k]) || I18N.en[k] || k;
const esc = v => String(v ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const slug = x => String(x).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const fileUrl = path => db ? db.storage.from('ssc-files').getPublicUrl(path).data.publicUrl : '#';
function icon(type){
 const paths={
  apply:'<path d="M5 19l4.2-1 9.1-9.1a2 2 0 0 0-2.8-2.8L6.4 15.2 5 19Z"/><path d="m14.5 7.5 2 2"/>',
  admit:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h4M7 12h4M15 9h3M15 12h3M7 16h11"/>',
  answer:'<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h3M8.5 11h7M8.5 14h7M8.5 17h5"/>',
  result:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 16v-3M12 16V9M16 16v-6"/>'
 };
 return `<svg viewBox="0 0 24 24" focusable="false">${paths[type]||''}</svg>`;
}
function eyeIcon(){return '<svg viewBox="0 0 24 24" focusable="false"><path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z"/><circle cx="12" cy="12" r="2.5"/></svg>'}

function dateParts(s){
  const d = new Date((s || '2026-08-18')+'T00:00:00');
  return {day:String(d.getDate()).padStart(2,'0'), mon:d.toLocaleString(state.lang==='hi'?'hi-IN':'en-IN',{month:'short'}).toUpperCase(), year:d.getFullYear()};
}

function header(active='home'){
 return `<div class="topline"><div class="wrap topflex"><span>${tr('feedback')}</span><span>${tr('skip')} | <button id="langToggle" class="plain">${state.lang==='en'?'हिन्दी':'English'}</button> | A- | A | A+</span></div></div>
 <header class="sitehead"><div class="wrap headrow">
   <button class="brandbtn" data-route="home"><img src="${A}brand-reference.jpg" alt="Staff Selection Commission"></button>
   <div class="headtools"><div class="searchbox"><input id="searchInput" placeholder="${tr('search')}"><button id="searchBtn">⌕</button></div><button class="loginBtn" data-route="login">${tr('login')}</button><img class="emblem" src="${A}government-emblem.png" alt="Government of India"></div>
 </div></header>
 <nav class="mainnav"><div class="wrap navrow">
   ${nav('home',tr('home'),active)}${nav('chair',tr('chair'),active)}
   ${menu('cand',tr('cand'),CANDIDATES,active)}${menu('tender',tr('tender'),TENDER,active)}
   ${menu('rti',tr('rti'),RTI,active)}${menu('about',tr('about'),ABOUT,active)}
 </div></nav>`;
}
function nav(id,label,active){return `<button class="navbtn ${active===id?'active':''}" data-route="${id}">${label}</button>`}
function menu(id,label,items,active){
 return `<div class="navmenu"><button class="navbtn ${active===id?'active':''}" data-menu="${id}">${label}<span class="chev">⌄</span></button><div class="dropdown">${items.map(x=>`<button class="dropitem" data-route="${slug(x)}">${esc(x)}</button>`).join('')}</div></div>`;
}

function footer(){
 return `<footer class="footer"><div class="wrap footgrid">
  <div><div class="footbrand"><img src="${A}brand-reference.jpg" alt=""><span>Staff Selection<br>Commission</span></div>
   <p>Public Disclosure of Scores and Other Details of Non-Recommended Willing Candidates</p>
   <p>List of Debarred Candidates in Examinations Conducted by the Staff Selection Commission</p>
  </div>
  <div><h4>Useful Links</h4><a>DoPT</a><a>Archives</a><a>Disclaimer</a><a>Sitemap</a><a>Help</a><a>Website Policies</a><a>Web Information Manager</a></div>
  <div><h4>Contact Us</h4><p>⌖ Block No-12, CGO Complex, Lodhi Road<br>New Delhi - 110003</p></div>
 </div><div class="wrap footbottom"><span>© 2026 SSC. All Rights Reserved.</span><span>Total Visitor Count: 475188660</span><span>Last updated on Aug 18, 2026</span></div></footer>`;
}

function home(){
 return `${header('home')}<main>
 <section class="hero"><img src="${A}hero-reference.jpg" alt="SSC building"></section>
 <section class="noticeband"><div>For inquiries or support, candidates can email: <u>helpdesk-ssc@ssc.nic.in</u></div><div>Follow the Staff Selection Commission on X (formerly Twitter): <u>@SSC_GoI</u></div><div>One Time Registration(OTR) for Scribe is live. Please click here to register.</div><a href="#" onclick="return false">Join Indian Navy</a></section>
 <section class="section"><div class="wrap"><div class="sectionhead"><h2>${tr('notice')}</h2><button data-route="notices">${tr('view')}</button></div><div class="noticecard"><div id="noticeList"></div><div id="pager" class="pager"></div></div></div></section>
 <section class="quicksec"><div class="wrap"><h2>${tr('quick')}</h2><div class="quickgrid">
  <button data-route="apply-online"><span class="quickicon applyicon">${icon('apply')}</span>${tr('apply')}</button><button data-route="admit-card"><span class="quickicon admiticon">${icon('admit')}</span>${tr('admit')}</button>
  <button data-route="answer-key"><span class="quickicon answericon">${icon('answer')}</span>${tr('answer')}</button><button data-route="result"><span class="quickicon resulticon">${icon('result')}</span>${tr('result')}</button>
 </div></div></section>
 <section class="section"><div class="wrap"><div class="calendar card"><div class="sectionhead"><h2>${tr('calendar')}</h2><div class="monthnav"><button id="prevMonth">‹</button><b id="monthLabel"></b><button id="nextMonth">›</button></div></div><div id="calendarList"></div><button class="viewall" data-route="calendar">${tr('view')}</button></div></div></section>
 <section class="examBand"><div class="wrap examwrap"><div class="examintro"><h2>${tr('browse')}</h2><p>Explore exam-related details and relevant resources</p><button class="pill light" data-route="browse">${tr('view')}</button></div><div class="examarea"><div id="examGrid" class="examgrid"></div><div id="examDots" class="dots"></div></div></div></section>
 <section class="section promoSection"><div class="wrap"><div id="promoGrid" class="promogrid"></div><div id="promoDots" class="dots dark"></div></div></section>
 <section class="section faqsec"><div class="wrap faqwrap"><div><h2>${tr('faq')}</h2><p>List of common inquiries and their brief answers to provide quick information and assist users.</p><button class="pill" data-route="faq">${tr('view')}</button></div><div><h5>${tr('popular')}</h5><div id="faqList" class="faqlist"></div></div></div></section>
 <section class="section initiativeSec"><div class="wrap"><h2>${tr('initiatives')}</h2><div id="initiativeGrid" class="initiativegrid"></div><div id="initiativeDots" class="dots dark"></div></div></section>
 </main>${footer()}`;
}

function renderNotices(){
 const list = state.notices.length ? state.notices : FALLBACK_NOTICES;
 const pageSize=5, total=Math.max(1,Math.ceil(list.length/pageSize)), page=Math.min(state.page,total);
 const start=(page-1)*pageSize;
 document.getElementById('noticeList').innerHTML=list.slice(start,start+pageSize).map(n=>{
   const d=dateParts(n.notice_date);
   return `<article class="noticeRow"><div class="datebox"><small>${d.mon}</small><b>${d.day}</b><small>${d.year}</small></div><div class="noticeTitle">${esc(n.title)}</div><div class="noticeMeta">(${esc(n.file_size||'')} )</div><div class="noticeActions"><button title="PDF" data-notice-action="pdf" data-notice="${esc(n.id)}"><span class="pdficon">PDF</span></button><button title="View" data-notice-action="view" data-notice="${esc(n.id)}"><span class="eyeicon">${eyeIcon()}</span></button></div></article>`;
 }).join('');
 const pager=document.getElementById('pager');
 if(list.length<=pageSize || total<=1){ pager.innerHTML=''; pager.style.display='none'; } else {
   pager.style.display='flex';
   const nums=[...new Set([1,page-1,page,page+1,total].filter(i=>i>=1&&i<=total))];
   let html=`<button data-page="${Math.max(1,page-1)}" aria-label="Previous page">‹</button>`;
   nums.forEach((n,i)=>{ if(i && n>nums[i-1]+1) html+='<span>…</span>'; html+=`<button class="${page===n?'active':''}" data-page="${n}">${n}</button>`; });
   html+=`<button data-page="${Math.min(total,page+1)}" aria-label="Next page">›</button>`;
   pager.innerHTML=html;
 }
 document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{state.page=+b.dataset.page;renderNotices()});
 document.querySelectorAll('[data-notice]').forEach(b=>b.onclick=()=>{
   const n=state.notices.find(x=>String(x.id)===String(b.dataset.notice)) || FALLBACK_NOTICES.find(x=>String(x.id)===String(b.dataset.notice));
   if(b.dataset.noticeAction==='pdf' && n?.file_path){ window.open(fileUrl(n.file_path),'_blank','noopener'); } else openNotice(b.dataset.notice);
 });
}
async function loadNotices(){
 if(!db){state.notices=FALLBACK_NOTICES;renderNotices();return}
 const {data,error}=await db.from('ssc_notices').select('*').order('notice_date',{ascending:false}).order('created_at',{ascending:false});
 state.notices=(!error && data && data.length)?data:FALLBACK_NOTICES;
 renderNotices();
}

function renderCalendar(){
 const m=state.month;
 const items=CALENDAR.filter(x=>new Date(x[0]).getMonth()===m);
 document.getElementById('monthLabel').textContent=new Date(state.year,m,1).toLocaleString(state.lang==='hi'?'hi-IN':'en-IN',{month:'short',year:'numeric'});
 document.getElementById('calendarList').innerHTML=(items.length?items:CALENDAR.slice(0,4)).map(x=>{
   const d=dateParts(x[0]);return `<div class="calrow"><div class="caldate"><b>${d.day}</b><small>${d.mon}</small></div><div>${esc(x[1])}</div></div>`;
 }).join('');
}
function renderExams(){
 const start=state.examPage*6;
 const items=EXAMS.slice(start,start+6);
 document.getElementById('examGrid').innerHTML=items.map(x=>`<button class="examcard" data-route="exam:${encodeURIComponent(x)}"><strong>${esc(x)}</strong><span>${esc(x)} is a competitive examination conducted by the Staff Selection Commission...</span><b>→</b></button>`).join('');
 document.getElementById('examDots').innerHTML=[0,1].map(i=>`<button class="${i===state.examPage?'on':''}" data-exampage="${i}"></button>`).join('');
 document.querySelectorAll('[data-exampage]').forEach(b=>b.onclick=()=>{state.examPage=+b.dataset.exampage;renderExams()});
}
function renderPromos(){
 const items=[0,1,2].map(i=>PROMOS[(state.promoPage+i)%PROMOS.length]);
 document.getElementById('promoGrid').innerHTML=items.map(p=>`<button class="promoCard" data-promo="${esc(p[1])}"><img src="${A+p[0]}" alt=""><span>${esc(p[1])}</span></button>`).join('');
 document.getElementById('promoDots').innerHTML=[0,1,2].map(i=>`<button class="${i===state.promoPage?'on':''}" data-promopage="${i}"></button>`).join('');
 document.querySelectorAll('[data-promopage]').forEach(b=>b.onclick=()=>{state.promoPage=+b.dataset.promopage;renderPromos()});
}
function renderInitiatives(){
 const start=state.initiativePage;
 const items=[0,1,2,3,4].map(i=>INITIATIVES[(start+i)%INITIATIVES.length]);
 document.getElementById('initiativeGrid').innerHTML=items.map(p=>`<button class="initiativeCard"><img src="${A+p[0]}" alt="${esc(p[1])}"></button>`).join('');
 document.getElementById('initiativeDots').innerHTML=[0,1].map(i=>`<button class="${i===state.initiativePage%2?'on':''}"></button>`).join('');
}
function renderFaq(){
 document.getElementById('faqList').innerHTML=FAQ.map((x,i)=>`<div class="faqitem"><button data-faq="${i}"><span>${esc(x[0])}</span><b>⊕</b></button><div class="faqanswer">${esc(x[1])}</div></div>`).join('');
 document.querySelectorAll('[data-faq]').forEach(b=>b.onclick=()=>b.parentElement.classList.toggle('open'));
}

function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),2200)}
function modal(html){document.getElementById('modal-root').innerHTML=`<div class="modalback">${html}</div>`;document.querySelector('.modalback').addEventListener('click',e=>{if(e.target.classList.contains('modalback'))closeModal()});document.querySelectorAll('.close').forEach(b=>b.onclick=closeModal)}
function closeModal(){document.getElementById('modal-root').innerHTML=''}
function resultModal(){
 const cats=['ALL','CHSL','JEN','CAPF','CTGD','CHT','OTHERS','DEPARTMENTAL EXAMS','DPHM','RHQ','DPCE','CGL','DPCD','DPHCT','CEDP','MTS','STENOGRAPHER'];
 modal(`<div class="modal resultmodal"><div class="modalhead"><h3>🟢 Result</h3><button class="close">×</button></div><div class="tabs">${cats.map((x,i)=>`<button class="tab ${i===0?'active':''}" data-resultcat="${x}">${x}</button>`).join('')}</div><div class="modalbody" id="resultBody"></div><div class="modalfoot"><button class="pill">View All</button></div></div>`);
 renderResult('ALL');
 document.querySelectorAll('[data-resultcat]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-resultcat]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderResult(b.dataset.resultcat)});
}
function renderResult(cat){
 const rows=[
  'Junior Secretariat Assistant / Lower Division Clerk Grade Limited Departmental Competitive Examination, 2023-24: Declaration of final result for the year 2024 of AFHQ Grade-II',
  'Combined Graduate Level Examination (CGLE), 2025: List of Candidates in Roll Number Order provisionally shortlisted',
  'Head Constable (Assistant Wireless Operator/Tele-Printer Operator) in Delhi Police Examination, 2025 — Additional Female Candidates qualified'
 ];
 document.getElementById('resultBody').innerHTML=rows.map(x=>`<div class="resultrow"><span>${esc(x)}</span><span>416.08 KB <i class="pdf">PDF</i> <u>Write up</u> <u>Result</u></span></div>`).join('');
}
function admitModal(){
 modal(`<div class="modal small"><div class="modalhead"><h3>▣ Admit Card</h3><button class="close">×</button></div><div class="modalbody">${['Download E-Admit Card of Stenographer Grade C and D Examination, 2024','Download E-Admit Card of Combined Hindi Translators Examination','Download E-Admit Card of Combined Higher Secondary Level Examination'].map(x=>`<div class="resultrow"><span>${x}</span></div>`).join('')}<div class="center"><button class="pill" data-route="login">Login</button></div></div></div>`);
 bindModalRoutes();
}
function answerModal(){
 modal(`<div class="modal"><div class="modalhead"><h3>▤ Answer Key</h3><button class="close">×</button></div><div class="modalbody">${['Grade C Stenographers Limited Departmental Competitive Examination, 2025: Uploading of Tentative Answer Keys along with Candidates Response Sheets.','Constable (Executive) Male and Female in Delhi Police Examination, 2025: Uploading of Final Answer Keys.','Head Constable (Ministerial) in Delhi Police Examination, 2025: Uploading of Final Answer Keys along with Question Papers cum Response Sheet.'].map(x=>`<div class="resultrow"><span>${x}</span><span>191.93 KB <i class="pdf">PDF</i> ◉</span></div>`).join('')}<div class="center"><button class="pill">View All</button></div></div></div>`);
}
function applyPage(){return genericPage('Apply Online',`<div class="servicecard"><h3>Apply Online</h3><p>Select an examination to continue your application.</p>${EXAMS.slice(0,6).map(x=>`<button class="serviceitem" data-route="exam:${encodeURIComponent(x)}">${esc(x)} <b>→</b></button>`).join('')}</div>`)}
function loginPage(){
 return `${header('login')}<main class="page loginPage"><div class="wrap"><h2>Login to your Account</h2><div class="loginbox"><div class="logintabs"><button class="active">Candidate</button><button data-route="admin-login">Admin</button></div><label>Username (Registration Number) <i>*</i></label><input id="loginUser" placeholder="Registration Number"><label>Password (SSC Registration Password) <i>*</i></label><div class="passrow"><input id="loginPass" type="password" placeholder="Password"><button>◉</button></div><a class="forgot">Forgot Password</a><div class="captcha"><b>69vXs</b><button>↻ Refresh</button></div><label>Captcha <i>*</i></label><input placeholder="Captcha"><button id="candidateLogin" class="loginfull">Login</button><div class="loginlinks">New User? <a>Register Now</a></div></div></div></main>${footer()}`;
}
function chairmanPage(){return genericPage("Chairman's Message",`<div class="chaircard"><div class="chairhero"><img src="${A}chairman.jpg" alt="Chairman"><div><h3>Chairman's Message</h3><p>Staff Selection Commission has evolved as one of the trusted recruiting agencies in India. The Commission uses technology and transparent processes to conduct fair recruitment.</p><p>For the full message and downloadable documents, use the links provided by the administrator.</p></div></div></div>`)}
function tenderPage(){return genericPage('SSC Tender',`<p>Welcome to the SSC Tenders page, your gateway to tender announcements.</p><div class="servicecard">${Array.from({length:9},(_,i)=>`<div class="tenderrow"><span class="datebox"><small>APR</small><b>${8-i%7}</b><small>2026</small></span><span>Opening of Financial Bids in respect of RFP for Selection of Service Provider (SP) for SSC Examinations and Candidate Services</span><span>PDF · ${(158+i*17)}.89 KB</span><span>↓ ◉</span></div>`).join('')}</div>`)}
function genericPage(title,body){return `${header('')}<main class="page"><div class="wrap"><div class="crumb">← Homepage &gt; ${esc(title)}</div><h2>${esc(title)}</h2>${body}</div></main>${footer()}`}

function openNotice(id){
 const n=state.notices.find(x=>String(x.id)===String(id)); if(!n)return;
 const link=n.file_path?fileUrl(n.file_path):'#';
 modal(`<div class="modal"><div class="modalhead"><h3>Notice</h3><button class="close">×</button></div><div class="modalbody"><h3>${esc(n.title)}</h3><p>${esc(n.notice_date||'')}</p><p>${esc(n.file_size||'')}</p>${n.file_path?`<a class="pill" href="${esc(link)}" target="_blank">Open PDF</a>`:'<p class="muted">No PDF attached.</p>'}</div></div>`);
}

function examModal(name){
 modal(`<div class="modal exammodal"><div class="modalhead"><h3>${esc(name)}</h3><button class="close">×</button></div><div class="tabs">${EXAM_RESOURCES.map((x,i)=>`<button class="tab ${i===0?'active':''}" data-examtab="${slug(x)}">${esc(x)}</button>`).join('')}</div><div class="modalbody" id="examBody"><h4>Notice</h4><p>Examination-specific content can be managed from the administrator panel.</p></div></div>`);
 document.querySelectorAll('[data-examtab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-examtab]').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById('examBody').innerHTML=`<h4>${esc(b.textContent)}</h4><p>${esc(name)} — ${esc(b.textContent)} documents and links can be published by the administrator.</p>`});
}

function bindModalRoutes(){document.querySelectorAll('#modal-root [data-route]').forEach(b=>b.onclick=()=>route(b.dataset.route))}
function doSearch(){
 const q=(document.getElementById('searchInput')?.value||'').trim().toLowerCase();
 if(!q){toast('Enter a search term');return}
 const all=[...EXAMS,...CANDIDATES,...ABOUT,...TENDER,...RTI,...state.notices.map(n=>n.title)];
 const hits=all.filter(x=>x.toLowerCase().includes(q));
 modal(`<div class="modal"><div class="modalhead"><h3>Search</h3><button class="close">×</button></div><div class="modalbody">${hits.length?hits.map(x=>`<button class="serviceitem" data-route="${slug(x)}">${esc(x)} <b>→</b></button>`).join(''):'<p>No matching results found.</p>'}</div></div>`);
 bindModalRoutes();
}

function route(r){
 if(!r)return;
 location.hash=r;
 document.querySelectorAll('.navmenu.open').forEach(x=>x.classList.remove('open'));
 closeModal();
 if(r==='home'){renderHome();return}
 if(r==='candidate-login'){window.location.href='candidate.html';return}
 if(r==='login'){document.getElementById('app').innerHTML=loginPage();bindCommon();return}
 if(r==='admin-login'){location.href='admin.html';return}
 if(r==='result'){resultModal();return}
 if(r==='admit-card'){admitModal();return}
 if(r==='answer-key'){answerModal();return}
 if(r==='apply-online'){document.getElementById('app').innerHTML=applyPage();bindCommon();return}
 if(r==='chair'){document.getElementById('app').innerHTML=chairmanPage();bindCommon();return}
 if(r==='tender'||r==='current-tenders'||r==='tender-archive'||r==='corrigenda'){document.getElementById('app').innerHTML=tenderPage();bindCommon();return}
 if(r==='browse'){modal(`<div class="modal"><div class="modalhead"><h3>Browse by Examinations</h3><button class="close">×</button></div><div class="modalbody exammenu">${EXAMS.map(x=>`<button data-route="exam:${encodeURIComponent(x)}">${esc(x)} <b>→</b></button>`).join('')}</div></div>`);bindModalRoutes();return}
 if(r.startsWith('exam:')){examModal(decodeURIComponent(r.slice(5)));return}
 if(r.startsWith('notice:')){openNotice(r.slice(7));return}
 if(r==='notices'){document.getElementById('app').innerHTML=genericPage('Notice Board','<div class="servicecard" id="allNotices"></div>');bindCommon();document.getElementById('allNotices').innerHTML=state.notices.map(n=>`<div class="resultrow"><span>${esc(n.title)}</span><span><a href="${n.file_path?esc(fileUrl(n.file_path)):'#'}" target="_blank">PDF</a> <button data-notice="${esc(n.id)}">◉</button></span></div>`).join('');document.querySelectorAll('[data-notice]').forEach(b=>b.onclick=()=>openNotice(b.dataset.notice));return}
 if(r==='calendar'){document.getElementById('app').innerHTML=genericPage('SSC Calendar',CALENDAR.map(x=>`<div class="resultrow"><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div>`).join(''));bindCommon();return}
 if(r==='faq'){document.getElementById('app').innerHTML=genericPage('Frequently Asked Questions',FAQ.map(x=>`<div class="faqfull"><b>${esc(x[0])}</b><p>${esc(x[1])}</p></div>`).join(''));bindCommon();return}
 if(r==='rti'||r.startsWith('rti-')){document.getElementById('app').innerHTML=genericPage('RTI',`<div class="servicecard">${RTI.map(x=>`<button class="serviceitem" data-route="${slug(x)}">${esc(x)} <b>→</b></button>`).join('')}</div>`);bindCommon();return}
 if(r==='about'||ABOUT.map(slug).includes(r)){document.getElementById('app').innerHTML=genericPage('About Us',`<div class="servicecard">${ABOUT.map(x=>`<button class="serviceitem" data-route="${slug(x)}">${esc(x)} <b>→</b></button>`).join('')}</div>`);bindCommon();return}
 document.getElementById('app').innerHTML=genericPage(r.replace(/-/g,' '),'<div class="servicecard"><p>This option is active and ready for administrator-managed content and documents.</p></div>');bindCommon();
}

function bindCommon(){
 document.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>route(b.dataset.route));
 document.querySelectorAll('[data-menu]').forEach(b=>b.onclick=e=>{e.stopPropagation();const p=b.parentElement;document.querySelectorAll('.navmenu.open').forEach(x=>{if(x!==p)x.classList.remove('open')});p.classList.toggle('open')});
 document.addEventListener('click',closeMenus,{once:true});
 document.getElementById('langToggle')?.addEventListener('click',()=>{state.lang=state.lang==='en'?'hi':'en';localStorage.setItem('sscLang',state.lang);renderHome()});
 document.getElementById('searchBtn')?.addEventListener('click',doSearch);
 document.getElementById('searchInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')doSearch()});
 document.getElementById('prevMonth')?.addEventListener('click',()=>{state.month=(state.month+11)%12;renderCalendar()});
 document.getElementById('nextMonth')?.addEventListener('click',()=>{state.month=(state.month+1)%12;renderCalendar()});
 document.getElementById('candidateLogin')?.addEventListener('click',()=>{window.location.href='candidate.html'});
}
function closeMenus(){document.querySelectorAll('.navmenu.open').forEach(x=>x.classList.remove('open'))}

function renderHome(){
 document.getElementById('app').innerHTML=home();
 bindCommon(); loadNotices(); renderCalendar(); renderExams(); renderPromos(); renderInitiatives(); renderFaq();
 clearInterval(window.sscTimer);
 window.sscTimer=setInterval(()=>{state.promoPage=(state.promoPage+1)%3;state.initiativePage=(state.initiativePage+1)%2;renderPromos();renderInitiatives()},5000);
}

window.addEventListener('hashchange',()=>{const r=location.hash.slice(1)||'home'; if(r==='home')renderHome(); else route(r)});
renderHome();
