const A='assets/';

const notices=[
['Aug','3','2026','Multi Tasking (Non-Technical) Staff, and Havaldar (CBIC and CBN) Examination, 2025: Declaration of result of Computer Based Examination to shortlist candidates for PET/PST for the post of Havaldar.','873.66 KB'],
['Aug','3','2026','Junior Engineer (Civil, Mechanical and Electrical) Examination, 2025- Declaration of Final Result','324.75 KB'],
['Jul','31','2026',"Stenographer Grade 'C' and 'D' Examination, 2025: Declaration of Revised First Round of Tentative Allocation (FRTA)",'856.40 KB'],
['Jul','27','2026','Important Notice - Schedule of Examinations','362.77 KB'],
['Jul','27','2026','IMPORTANT NOTICE - Postponement of Physical Endurance and Measurement Test (PE and MT) for various Examinations in Delhi Police, 2025.','259.03 KB'],
['Jul','27','2026','Addendum to Notice of Combined Hindi Translators Examination, 2025','644.02 KB'],
['Jul','24','2026','Sub Inspector in Delhi Police and CAPFs Examination, 2024:- Uploading Final Marks of candidates.','323.27 KB']
];

const calendar=[
['30','APR','Combined Hindi Translators Examination, 2026,2026'],
['31','MAY','Sub-Inspector in Delhi Police and Central Armed Police Forces Examination, 2026,2026'],
['5','JUN','Indian Navy Entrance Test (INET) - [Agniveer (Apprentice)]'],
['30','JUN','Multi Tasking (Non-Technical) Staff Examination, 2026,2026']
];

const exams=[
['Departmental Examination','SSC (Staff Selection Commission) conducts departmental exams for existing government employees.'],
['Selection Posts Examination',"The SSC Selection Posts Examination assesses candidates for Group 'B' and 'C' positions in various departments."],
['Combined Graduate Level Examination, 2024','The Combined Graduate Level (CGL) examination conducted by the Staff Selection Commission (SSC) is one of its major examinations.'],
["Stenographer Grade 'C' and 'D' Examination, 2024",'The Stenographer Grade C and D exams are competitive exams held to recruit stenographers for various departments.']
];

const faqs=[
['Is Registration mandatory for applying to the examinations of the Commission?','Yes, One-Time Registration with the Commission is a mandatory prerequisite. On completion of One-Time Registration, candidates can apply online for any examination.'],
['I did not receive registration number and password on the email.','Check your Spam folder. If the email is not received, contact the concerned Regional Office helpline.'],
['When is the notice/advertisement of an Examination issued?','Tentative dates of issue of Notices are given in the Annual Calendar of Examinations.'],
['What are the posts for which the SSC conducts exams and what are the required qualifications ?','SSC conducts open examinations regularly for a wide range of Group B and Group C posts.'],
['When does the Commission upload its Annual Calendar of Examinations?','The Annual Calendar is uploaded as part of the Commission examination schedule.']
];

let lang='en';

const tr={
en:{
feedback:'Feedback | SSC Old Website',
skip:'Skip to Main Content',
home:'Home',
chair:"Chairman’s Message",
cand:'For Candidates',
tender:'Tender',
rti:'RTI',
about:'About Us',
login:'Login or Register',
notice:'Notice Board',
view:'View All',
quick:'Quick Links',
apply:'Apply',
admit:'Admit Card',
answer:'Answer Key',
result:'Result',
calendar:'SSC Calendar',
browse:'Browse by Examinations',
faq:'FAQs',
other:'Other Initiatives'
},
hi:{
feedback:'फीडबैक | SSC पुरानी वेबसाइट',
skip:'मुख्य सामग्री पर जाएँ',
home:'होम',
chair:'अध्यक्ष का संदेश',
cand:'उम्मीदवारों के लिए',
tender:'निविदा',
rti:'RTI',
about:'हमारे बारे में',
login:'लॉगिन या रजिस्टर',
notice:'सूचना बोर्ड',
view:'सभी देखें',
quick:'त्वरित लिंक',
apply:'आवेदन',
admit:'प्रवेश पत्र',
answer:'उत्तर कुंजी',
result:'परिणाम',
calendar:'SSC कैलेंडर',
browse:'परीक्षाओं के अनुसार देखें',
faq:'अक्सर पूछे जाने वाले प्रश्न',
other:'अन्य पहल'
}
};

function T(k){
return tr[lang][k]||k;
}

const menus={
'For Candidates':[
"SSC's Scribe Procedure",
'Script Evaluation',
'Examination Calendar',
'Scheme of Examination',
'Syllabus',
'Special Instruction',
'Previous Year Question Paper',
'Format of Certificates',
'Tentative Vacancy',
'Normalization Method',
'Mock Test'
],
'About Us':[
'Background of Commission',
'Setup of Commission',
'Organisation Structure',
'Function of Commission',
'Vision, Mission & Objectives of SSC',
'Regional Network',
'Annual Report',
"Citizen's Charter",
'Contact List',
'Resolution',
'PIDPI',
'Right To Information',
'Committee on Sexual Harassment'
],
'RTI':[
'RTI- MIS',
'Proactive Disclosure (RTI)'
]
};

function esc(s){
return String(s).replace(/[&<>"']/g,m=>({
'&':'&amp;',
'<':'&lt;',
'>':'&gt;',
'"':'&quot;',
"'":'&#39;'
}[m]));
}

function icon(t){
return t==='Apply'?'✎':
t==='Admit Card'?'▣':
t==='Answer Key'?'▤':'▮';
}

function nav(){

return `
<div class="topline">

<div>${T('feedback')}</div>

<div>
${T('skip')} |
<button id="langBtn" style="border:0;background:transparent;color:#333">
${lang==='en'?'हिन्दी':'English'}
</button>
| +A A -A
</div>

</div>

<div class="brandrow">

<div class="brand">

<img
src="${A}header-brand.jpg"
alt="Government of India Staff Selection Commission"
>

<span class="ashoka">♜</span>

</div>

<div class="head-actions">

<div class="searchbox">

<input
id="searchInput"
placeholder="Search"
>

<button
id="searchBtn"
style="border:0;background:transparent"
>
⌕
</button>

</div>

<button
class="login-btn"
id="loginBtn"
>
${T('login')}
</button>

</div>

</div>

<div class="nav">

<div class="container nav-inner">

${['Home',"Chairman's Message",'For Candidates','Tender','RTI','About Us'].map((x,i)=>{

if(menus[x]){

return `
<div
class="nav-item"
data-menu="${esc(x)}"
>

<button class="nav-btn">

${T(
x==="Chairman's Message"?'chair':
x==='For Candidates'?'cand':
x==='About Us'?'about':
x.toLowerCase()
)}

<span class="caret">▾</span>

</button>

<div class="dropdown">

${menus[x].map(y=>`

<a
class="drop-link"
href="#"
data-action="submenu"
data-label="${esc(y)}"
>
${esc(y)}
</a>

`).join('')}

</div>

</div>
`;

}

return `
<div class="nav-item">

<button
class="nav-btn"
data-page="${i===3?'tender':i===1?'chairman':'home'}"
>

${T(
x==='Home'?'home':
x==='Tender'?'tender':
x==='RTI'?'rti':
x.toLowerCase()
)}

</button>

</div>
`;

}).join('')}

</div>

</div>
`;
}

function hero(){

return `
<div class="hero">

<img
id="heroImg"
src="${A}hero-building-1.jpg"
alt="SSC building"
>

<button
class="hero-prev"
id="heroPrev"
>
‹
</button>

<button
class="hero-next"
id="heroNext"
>
›
</button>

<div class="hero-dots">
<span class="active"></span>
<span></span>
<span></span>
</div>

</div>

<div class="notice-strip">

<div class="ticker">

<div class="ticker-row">
For inquiries or support, candidates can email:
<b>helpdesk-ssc@ssc.nic.in</b>
</div>

<div class="ticker-row">
Follow the Staff Selection Commission on X (formerly Twitter):
<a href="#">@SSC_GoI</a>
</div>

<div class="ticker-row">
One Time Registration(OTR) for Scribe is live.
Please click here to register.
</div>

<a class="join" href="#">
Join Indian Navy
</a>

</div>

</div>
`;
}

function noticeCard(){

return `
<section class="section container">

<div class="card notice-card">

<div class="section-head">

<h2 class="section-title">
${T('notice')}
</h2>

<a
href="#"
data-page="notices"
>
${T('view')}
</a>

</div>

<div class="notice-list">

${notices.map((n,i)=>`

<div class="notice-row">

<div class="datebox">

<span class="month">
${n[0]}
</span>

<span class="day">
${n[1]}
</span>

<span class="year">
${n[2]}
</span>

</div>

<div class="notice-title">
${esc(n[3])}
</div>

<div class="notice-meta">
(${n[4]})
<span class="pdf">
PDF
</span>
</div>

<button
class="eye"
data-notice="${i}"
>
◉
</button>

</div>

`).join('')}

</div>

<div class="pager">

<button>‹</button>
<button class="current">1</button>
<button>2</button>
<button>3</button>
<button>…</button>
<button>66</button>
<button>›</button>

</div>

</div>

</section>
`;
}

function quick(){

return `
<section class="container section">

<h2 class="section-title">
${T('quick')}
</h2>

<div class="quick-grid">

${[
[T('apply'),'Apply'],
[T('admit'),'Admit Card'],
[T('answer'),'Answer Key'],
[T('result'),'Result']
].map(x=>`

<a
class="quick"
href="#"
data-quick="${x[1]}"
>

<span class="ico">
${icon(x[1])}
</span>

<span>
${x[0]}
</span>

</a>

`).join('')}

</div>

</section>
`;
}

function calendarCard(){

return `
<section class="container section">

<div class="card calendar-card">

<div class="calendar-head">

<h2 class="section-title">
${T('calendar')}
</h2>

<div class="month-nav">

<button>‹</button>

<span>
Aug, 2026
</span>

<button>›</button>

</div>

</div>

<div class="cal-list">

${calendar.map(c=>`

<div class="cal-row">

<div class="cal-date">

<strong>
${c[0]}
</strong>

<small>
${c[1]}
</small>

</div>

<div class="cal-name">
${esc(c[2])}
</div>

</div>

`).join('')}

</div>

<a
class="viewall"
href="#"
data-page="calendar"
>
${T('view')}
</a>

</div>

</section>
`;
}

function examSection(){

return `
<section class="exams section">

<div class="container exam-wrap">

<div>

<h2 class="exam-title">
${T('browse').replace(' by ','<br>')}
</h2>

<div class="exam-sub">
Explore exam-related details and relevant resources.
</div>

</div>

<div>

<div class="exam-track">

${exams.map((e,i)=>`

<a
href="#"
class="exam-card"
data-exam="${i}"
>

<div>

<h3>
${esc(e[0])}
</h3>

<p>
${esc(e[1])}
</p>

</div>

<span class="arrow">
→
</span>

</a>

`).join('')}

</div>

<div class="dots">
<span></span>
<span></span>
</div>

</div>

</div>

</section>
`;
}

function promos(){

return `
<section class="container">

<div class="promo-grid">

<div class="promo">
<img src="${A}initiative-man-ki-baat.jpg">
</div>

<div class="promo">
<img src="${A}initiative-yoga.jpg">
</div>

<div class="promo">
<img src="${A}initiative-yoga2.jpg">
</div>

</div>

</section>
`;
}

function faqSection(){

return `
<section class="container section">

<div class="faq-grid">

<div class="faq-copy">

<h2>
${T('faq')}
</h2>

<p>
List of common inquiries and their brief answers to provide quick information and assist users.
</p>

<button
class="primary"
data-page="faqs"
>
View All
</button>

</div>

<div class="faq-list">

<div style="color:#9a6b6e;margin-bottom:6px">
MOST POPULAR FAQS
</div>

${faqs.map((f,i)=>`

<div class="faq-item">

<button
class="faq-q"
data-faq="${i}"
>

<span>
${esc(f[0])}
</span>

<b>
⊕
</b>

</button>

<div class="faq-a">
${esc(f[1])}
</div>

</div>

`).join('')}

</div>

</div>

</section>
`;
}

function initiatives(){

return `
<section class="container section initiatives">

<h2 class="section-title">
${T('other')}
</h2>

<div class="initiative-grid">

${[
['initiative-make.jpg','Make in India'],
['initiative-india.jpg','Incredible India'],
['initiative-data.jpg','data.gov.in'],
['initiative-digital.jpg','Digital India']
].map(x=>`

<a
class="initiative"
href="#"
data-action="initiative"
>

<img
src="${A+x[0]}"
alt="${x[1]}"
>

</a>

`).join('')}

</div>

<div class="dots">
<span></span>
<span></span>
</div>

</section>
`;
}

function footer(){

return `
<footer class="footer">

<div class="container footer-grid">

<div>

<div class="footer-brand">

<img src="${A}ssc-footer.jpg">

<span>
Staff Selection<br>
Commission
</span>

</div>

<p>
Public Disclosure of Scores and Other Details of Non-Recommended Willing Candidates
</p>

<p>
List of Debarred Candidates in Examinations Conducted by the Staff Selection Commission
</p>

</div>

<div>

<b>
Useful links
</b>

<a href="#">DoPT</a>
<a href="#">Archives</a>
<a href="#">Disclaimer</a>
<a href="#">Sitemap</a>
<a href="#">Help</a>
<a href="#">Website Policies</a>
<a href="#">Web Information Manager</a>

</div>

<div>

<b>
Contact Us
</b>

<p>
⌖ Block No-12, CGO Complex, Lodhi Road<br>
New Delhi - 110003
</p>

</div>

</div>

<div class="container footer-bottom">

<span>
© 2026 SSC. All Rights Reserved.
</span>

<span>
Total Visitor Count: 474754905
</span>

<span>
Last updated on Aug 12, 2026
</span>

</div>

</footer>
`;
}

function home(){

return nav()+
hero()+
noticeCard()+
quick()+
calendarCard()+
examSection()+
promos()+
faqSection()+
initiatives()+
footer();

}

function page(title,body){

return nav()+

`
<main class="page container">

<div class="breadcrumb">
Homepage &gt; ${esc(title)}
</div>

<h1>
${esc(title)}
</h1>

${body}

</main>
`

+
footer();

}

function tenderPage(){

const rows=[
'Opening of Financial Bids in respect of RFP for Selection of Service Provider (SP) for Technology and Operations Partner for SSC Examinations and Candidate Services',
'Notice for Opening of Bids in respect of the RFP for Selection of Service Provider (SP) for Technology & Operations Partner for SSC Examinations and Candidate Services',
'Corrigendum 4 - Corrigendum regarding Extension of Dates in respect of the RFP for Selection of Service Provider (SP) for Technology and Operations Partner for SSC Examinations and Candidate Services',
'Response to Pre-bid Queries i.r.o. Request for Proposal (RFP) for Selection of Service Provider (SP) for Technology and Operations Partner for SSC Examinations and Candidate Services',
'Corrigendum 3 - Corrigendum regarding revision in content of RFP',
'Corrigendum 2 for Date Extension in respect of Tender Id - 2026_SSC_901309_1',
'Corrigendum for Date Extension in respect of Tender Id - 2026_SSC_901309_1'
];

return page(
'Tender',

`
<p>
Welcome to the SSC Tenders page, your gateway to explore the latest tender opportunities related to Staff Selection Commission.
</p>

<div
class="searchbox"
style="margin:20px 0;width:280px"
>

<input placeholder="Search">

<span>
⌕
</span>

</div>

${rows.map((r,i)=>`

<div class="tender-row">

<div>
${i+1}
<br>
<small>
2026
</small>
</div>

<div>

${esc(r)}

<br>

<a
class="download"
href="#"
>
PDF. ${(158+i*37).toFixed(2)} KB
</a>

</div>

<div>
⇩ ◉
</div>

</div>

`).join('')}

`
);

}

function calendarPage(){

return page(
'SSC Calendar',

`
<p>
Staff Selection Commission Tentative Calendar of Examination for the Year 2026-2027
</p>

<div class="card calendar-card">

${calendar.concat([
['14','MAR','Indian Navy Entrance Test (INET) - [Agniveer (MR as SSR) and SSR (Medical)]'],
['16','MAR','JSA / LDC Grade Limited Departmental Competitive Examination, 2025 for DoPT only'],
['16','MAR','ASO Grade Limited Departmental Competitive Examination, 2025']
]).map(c=>`

<div class="cal-row">

<div class="cal-date">

<strong>
${c[0]}
</strong>

<small>
${c[1]}
</small>

</div>

<div class="cal-name">
${esc(c[2])}
</div>

</div>

`).join('')}

</div>
`
);

}

function faqsPage(){

return page(
'FAQs',

`
<div class="faq-list">

${faqs.concat(faqs).map((f,i)=>`

<div class="faq-item">

<button
class="faq-q"
data-faq="${i%faqs.length}"
>

<span>
${esc(f[0])}
</span>

<b>
⊕
</b>

</button>

<div class="faq-a">
${esc(f[1])}
</div>

</div>

`).join('')}

</div>
`
);

}

function examPage(i){

const e=exams[i]||exams[0];

return page(
e[0],

`
<p>
${esc(e[1])}
</p>

<div class="admin-note">
This examination section contains notices, syllabus, special instructions, previous year question papers, tentative vacancies and related resources.
</div>

<div class="quick-grid">

<a class="quick" href="#">
Examination Notice
</a>

<a class="quick" href="#">
Syllabus
</a>

<a class="quick" href="#">
Previous Year Question Paper
</a>

<a class="quick" href="#">
Result
</a>

</div>
`
);

}

function modal(html,cls=''){

const root=document.getElementById('modal-root');

if(!root)return;

root.innerHTML=`
<div
class="modal-backdrop"
id="backdrop"
>

<div class="modal ${cls}">
${html}
</div>

</div>
`;

const backdrop=document.getElementById('backdrop');

if(backdrop){

backdrop.addEventListener(
'click',
e=>{

if(e.target.id==='backdrop'){
closeModal();
}

}
);

}

}

function closeModal(){

const root=document.getElementById('modal-root');

if(root){
root.innerHTML='';
}

}

function resultModal(){

modal(`

<div class="modal-head">

<h2>
▮ Result
</h2>

<button
class="close"
onclick="closeModal()"
>
×
</button>

</div>

<div class="tabs">

${[
'All','CHSL','STENO','JE','CAPF','CTGD','CHT','OTHERS',
'DEPARTMENTAL EXAMS','DPHCM','RHQ','DPCE','CGL','DPCD',
'DPHCT','CEDP','MTS','STE'
].map((x,i)=>`

<button class="tab ${i===0?'active':''}">
${x}
</button>

`).join('')}

</div>

<div class="modal-body">

${notices.slice(0,2).map(n=>`

<div class="result-row">

<div>

${esc(n[3])}

<br>

<small>
03-08-2026
</small>

</div>

<div class="result-actions">

(${n[4]})
<span class="pdf">
PDF
</span>

<br>

<a href="#">
Write up
</a>

<a href="#">
Result
</a>

</div>

</div>

`).join('')}

</div>

<div class="modal-footer">

<button class="primary">
View All
</button>

</div>

`);

}

function admitModal(){

modal(`

<div class="modal-head">

<h2>
▣ ${T('admit')}
</h2>

<button
class="close"
onclick="closeModal()"
>
×
</button>

</div>

<div class="modal-body">

<div class="result-row">

<div>
Download E-Admit Card of Stenographer Grade 'C' and 'D' Examination, 2024,
</div>

</div>

<div class="result-row">

<div>
Download E-Admit Card of Combined Hindi Translators Examination,
</div>

</div>

</div>

<div class="modal-footer">

<button class="primary">
Login
</button>

</div>

`);

}

function applyModal(){

modal(`

<div class="modal-head">

<h2>
✎ ${T('apply')}
</h2>

<button
class="close"
onclick="closeModal()"
>
×
</button>

</div>

<div class="modal-body">

<div
style="text-align:center;padding:50px 10px"
>

<div
style="font-size:78px;color:#c48784"
>
📄
</div>

<p>
Application is not active !
</p>

</div>

</div>

`);

}

function answerModal(){

modal(`

<div class="modal-head">

<h2>
▤ ${T('answer')}
</h2>

<button
class="close"
onclick="closeModal()"
>
×
</button>

</div>

<div class="tabs">

${['CGL','CHSL','JE','MTS','STENO','OTHERS'].map((x,i)=>`

<button class="tab ${i===0?'active':''}">
${x}
</button>

`).join('')}

</div>

<div class="modal-body">

<div class="result-row">

<div>
Tentative Answer Key and Response Sheet
</div>

<div class="result-actions">
PDF
</div>

</div>

<div class="result-row">

<div>
Final Answer Key and Response Sheet
</div>

<div class="result-actions">
PDF
</div>

</div>

</div>

<div class="modal-footer">

<button class="primary">
View All
</button>

</div>

`);

}

/* ==========================================
   LOGIN MODAL
   ========================================== */

function loginModal(){

modal(`

<div class="modal-head">
</div>

<div class="login-tabs">

<button
class="active"
data-login-tab="candidate"
>
Candidate
</button>

<button
type="button"
data-login-tab="admin"
onclick="window.location.href='./admin.html'"
>
Admin
</button>

</div>

<div class="modal-body">

<div class="form-group">

<label>
Username (Registration Number) <b>*</b>
</label>

<input
placeholder="Registration Number"
>

</div>

<div class="form-group">

<label>
Password (SSC Registration Password) <b>*</b>
</label>

<input
type="password"
placeholder="Password"
>

</div>

<div style="text-align:right">

<a
class="link"
href="#"
>
Forgot Password
</a>

</div>

<div class="captcha">

<div class="captcha-code">
LRaQV
</div>

<button
type="button"
class="close"
style="font-size:14px"
>
↻ Refresh
</button>

</div>

<div class="form-group">

<label>
Captcha *
</label>

<input
placeholder="Captcha"
>

</div>

<button
type="button"
class="primary"
style="width:100%"
>
Login
</button>

<div
style="text-align:center;padding-top:12px"
>

New User ? &nbsp;

<a
class="link"
href="#"
>
Register Now
</a>

</div>

</div>

<button
type="button"
class="close"
style="position:absolute;right:10px;top:8px"
onclick="closeModal()"
>
×
</button>

`,
'small'
);

}

/* ==========================================
   NOTICE MODAL
   ========================================== */

function noticeModal(i){

const n=notices[i];

if(!n)return;

modal(`

<div class="modal-head">

<h2>
Notice
</h2>

<button
class="close"
onclick="closeModal()"
>
×
</button>

</div>

<div class="modal-body">

<div
class="datebox"
style="align-items:flex-start"
>

<span class="month">
${n[0]}
</span>

<span class="day">
${n[1]}
</span>

<span class="year">
${n[2]}
</span>

</div>

<p>
${esc(n[3])}
</p>

<p>
PDF size: ${n[4]}
</p>

</div>

<div class="modal-footer">

<button class="primary">
Download PDF
</button>

</div>

`);

}

/* ==========================================
   SEARCH
   ========================================== */

function searchModal(q){

const all=[

...notices.map(x=>x[3]),
...exams.map(x=>x[0]),
...faqs.map(x=>x[0])

].filter(
x=>x.toLowerCase().includes(q.toLowerCase())
);

modal(`

<div class="modal-head">

<h2>
Search
</h2>

<button
class="close"
onclick="closeModal()"
>
×
</button>

</div>

<div class="search-results">

${
all.length

?

all.map(x=>`

<div class="search-item">
${esc(x)}
</div>

`).join('')

:

'No matching results found.'
}

</div>

`);

}

/* ==========================================
   HERO
   ========================================== */

function bindHero(){

const imgs=[
'hero-building-1.jpg',
'hero-building-2.jpg',
'hero-building-3.jpg'
];

let i=0;

const img=document.getElementById('heroImg');

if(!img)return;

const dots=[
...document.querySelectorAll('.hero-dots span')
];

function go(d){

i=(i+d+imgs.length)%imgs.length;

img.src=A+imgs[i];

dots.forEach(
(x,n)=>x.classList.toggle(
'active',
n===i
)
);

}

document
.getElementById('heroPrev')
?.addEventListener(
'click',
()=>go(-1)
);

document
.getElementById('heroNext')
?.addEventListener(
'click',
()=>go(1)
);

setInterval(
()=>go(1),
5000
);

}

/* ==========================================
   TOAST
   ========================================== */

function toast(msg){

const t=document.getElementById('toast');

if(!t)return;

t.textContent=msg;

t.classList.add('show');

setTimeout(
()=>{
t.classList.remove('show');
},
1800
);

}

/* ==========================================
   BIND
   ========================================== */

function bind(){

bindHero();

/* MENU */

document
.querySelectorAll('[data-menu]')
.forEach(el=>{

const btn=el.querySelector('.nav-btn');

if(!btn)return;

btn.addEventListener(
'click',
e=>{

e.stopPropagation();

document
.querySelectorAll('.nav-item.open')
.forEach(x=>{

if(x!==el){
x.classList.remove('open');
}

});

el.classList.toggle('open');

}
);

});

/* PAGE LINKS */

document
.querySelectorAll('[data-page]')
.forEach(el=>{

el.addEventListener(
'click',
e=>{

e.preventDefault();

location.hash='page='+el.dataset.page;

}
);

});

/* QUICK LINKS */

document
.querySelectorAll('[data-quick]')
.forEach(el=>{

el.addEventListener(
'click',
e=>{

e.preventDefault();

const q=el.dataset.quick;

if(q==='Result'){
resultModal();
}

else if(q==='Admit Card'){
admitModal();
}

else if(q==='Apply'){
applyModal();
}

else if(q==='Answer Key'){
answerModal();
}

}
);

});

/* NOTICE */

document
.querySelectorAll('[data-notice]')
.forEach(el=>{

el.addEventListener(
'click',
()=>{
noticeModal(
Number(el.dataset.notice)
);
}
);

});

/* FAQ */

document
.querySelectorAll('[data-faq]')
.forEach(el=>{

el.addEventListener(
'click',
()=>{
el.parentElement.classList.toggle('open');
}
);

});

/* EXAMS */

document
.querySelectorAll('[data-exam]')
.forEach(el=>{

el.addEventListener(
'click',
e=>{

e.preventDefault();

location.hash='exam='+el.dataset.exam;

}
);

});

/* LOGIN */

document
.getElementById('loginBtn')
?.addEventListener(
'click',
loginModal
);

/* SEARCH */

document
.getElementById('searchBtn')
?.addEventListener(
'click',
()=>{

const input=document.getElementById('searchInput');

const q=input?.value.trim();

if(q){
searchModal(q);
}

}
);

document
.getElementById('searchInput')
?.addEventListener(
'keydown',
e=>{

if(e.key==='Enter'){

document
.getElementById('searchBtn')
?.click();

}

}
);

/* LANGUAGE */

document
.getElementById('langBtn')
?.addEventListener(
'click',
e=>{

e.preventDefault();

lang=lang==='en'
?'hi'
:'en';

render();

}
);

/* SUBMENUS */

document
.querySelectorAll('[data-action="submenu"]')
.forEach(el=>{

el.addEventListener(
'click',
e=>{

e.preventDefault();

toast(
el.dataset.label+' opened'
);

}
);

});

/*
IMPORTANT:
Admin button has its own inline onclick
inside loginModal(), so it does NOT depend
on this JavaScript event listener.
*/

document
.querySelectorAll('[data-login-tab="candidate"]')
.forEach(el=>{

el.addEventListener(
'click',
e=>{

e.preventDefault();
e.stopPropagation();

toast('Candidate login selected');

}
);

});

}

/* ==========================================
   RENDER
   ========================================== */

function render(){

const root=document.getElementById('app');

if(!root)return;

const h=location.hash.slice(1);

if(h.startsWith('page=')){

const p=h.slice(5);

if(p==='tender'){

root.innerHTML=tenderPage();

}

else if(p==='calendar'){

root.innerHTML=calendarPage();

}

else if(p==='faqs'){

root.innerHTML=faqsPage();

}

else if(p==='chairman'){

root.innerHTML=page(
"Chairman's Message",
'<p>Welcome to the Chairman’s Message section of the Staff Selection Commission.</p>'
);

}

else if(p==='notices'){

root.innerHTML=page(
'Notice Board',
noticeCard()
);

}

else{

root.innerHTML=home();

}

}

else if(h.startsWith('exam=')){

root.innerHTML=examPage(
Number(h.slice(5))
);

}

else{

root.innerHTML=home();

}

bind();

}

/* ==========================================
   GLOBAL FUNCTIONS
   ========================================== */

window.closeModal=closeModal;
window.resultModal=resultModal;
window.admitModal=admitModal;
window.applyModal=applyModal;
window.answerModal=answerModal;
window.loginModal=loginModal;
window.noticeModal=noticeModal;

/* ==========================================
   START
   ========================================== */

window.addEventListener(
'hashchange',
render
);

render();
