
const A="assets/";
const cfg=window.SSC_CONFIG||{};
let lang="en", db=null;
if(window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY){
  db=supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
}

const notices=[
["Jul","24","2026","Sub Inspector in Delhi Police and CAPFs Examination, 2024:- Uploading Final Marks of candidates.","323.27 KB",""],
["Jul","20","2026","Corrigendum for the post of Vocational Instructor (Except Women Training) {Post Code NR11526 to NE14426} under Phase-XIV/2026/Selection Posts Examination","87.66 KB",""],
["Jul","16","2026","Grade 'C' Stenographers Limited Departmental Competitive Examination, 2025 : Uploading of Tentative Answer Keys along with Candidates’ Response Sheet(s)","201.93 KB",""],
["Jul","15","2026","Tentative vacancies of Senior Secretariat Assistant/ Upper Division Clerk Grade Limited Departmental Competitive Examination, 2025","421.09 KB",""],
["Jul","14","2026","Corrigendum for the post of E.C.G. Technician (Junior) Post Code MP11626 under Selection Post Examination, Phase-XIV/2026","199.83 KB",""],
["Jul","14","2026","Cancellation Notice for the post of Ayurvedic Pharmacist, Post Code MP10826, under Selection Posts Examination, Phase-XIV/2026","194.92 KB",""],
["Jul","13","2026","Addendum to the Notice of Junior Secretariat Assistant / Lower Division Clerk Grade Limited Departmental Competitive Examination, 2025","670.86 KB",""],
["Jul","10","2026","Identity Verification (IV) for the candidates shortlisted in FRTA of Junior Engineer Examination, 2025","140.19 KB",""],
["Jul","9","2026","Junior Engineer (Civil, Mechanical and Electrical) Examination, 2025- Declaration of First Round of Tentative Allocation (FRTA)","401.67 KB",""],
["Jul","9","2026","Tentative Vacancy for Combined Hindi Translators Examination, 2026","220.43 KB",""]
];

const exams=[
"Selection Posts Examination","Combined Graduate Level Examination, 2024",
"Stenographer Grade 'C' and 'D' Examination, 2024",
"Junior Engineer (Civil, Mechanical & Electrical) Examination",
"Combined Higher Secondary Level (10+2) Examination",
"Constable (GD) in Central Armed Police Forces (CAPFs), SSF, Rifleman (GD) in Assam Rifles and Sepoy in Narcotics Control Bureau Examination",
"Combined Hindi Translators Examination",
"Sub-Inspector in Delhi Police and Central Armed Police Forces Examination",
"Others","Departmental Examination"
];

const menuItems={
"For Candidates":["SSC's Scribe Procedure","Script Evaluation","Examination Calendar","Scheme of Examination","Syllabus","Special Instruction","Previous Year Question Paper","Format of Certificates","Tentative Vacancy","Normalization Method","Mock Test"],
"About Us":["Background of Commission","Setup of Commission","Organisation Structure","Function of Commission","Vision, Mission & Objectives of SSC","Regional Network","Annual Report","Citizen's Charter","Contact List","Resolution","PIDPI","Right To Information","Committee on Sexual Harassment"],
"RTI":["RTI- MIS","Proactive Disclosure (RTI)"]
};

const faqData=[
["Is Registration mandatory for applying to the examinations of the Commission?","Yes, One-Time Registration with the Commission is a mandatory prerequisite. On completion of One-Time Registration, candidates can apply online for any examination."],
["I did not receive registration number and password on the email.","Check your Spam folder. If the email is not received, contact the concerned Regional Office helpline."],
["When is the notice/advertisement of an Examination issued?","Tentative dates of issue of Notices are given in the Annual Calendar of Examinations."],
["What are the posts for which the SSC conducts exams and what are the required qualifications ?","SSC conducts open examinations regularly for a wide range of Group B and Group C posts."],
["When does the Commission upload its Annual Calendar of Examinations?","The Annual Calendar is uploaded as part of the Commission examination schedule."]
];

const T={
en:{feedback:"Feedback | SSC Old Website",skip:"Skip to Main Content",home:"Home",chair:"Chairman’s Message",cand:"For Candidates",tender:"Tender",rti:"RTI",about:"About Us",login:"Login or Register",notice:"Notice Board",view:"View All",quick:"Quick Links",apply:"Apply",admit:"Admit Card",answer:"Answer Key",result:"Result",calendar:"SSC Calendar",browse:"Browse by Examinations",faq:"FAQs",other:"Other Initiatives"},
hi:{feedback:"फीडबैक | SSC पुरानी वेबसाइट",skip:"मुख्य सामग्री पर जाएँ",home:"होम",chair:"अध्यक्ष का संदेश",cand:"उम्मीदवारों के लिए",tender:"निविदा",rti:"RTI",about:"हमारे बारे में",login:"लॉगिन या रजिस्टर",notice:"सूचना बोर्ड",view:"सभी देखें",quick:"त्वरित लिंक",apply:"आवेदन",admit:"प्रवेश पत्र",answer:"उत्तर कुंजी",result:"परिणाम",calendar:"SSC कैलेंडर",browse:"परीक्षाओं के अनुसार देखें",faq:"अक्सर पूछे जाने वाले प्रश्न",other:"अन्य पहल"}
};
const tr=k=>T[lang][k]||k;
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

function header(){
 return `<div class="topline"><span>${tr("feedback")}</span><span>${tr("skip")} &nbsp;|&nbsp; <button id="langBtn" class="plain">${lang==="en"?"हिन्दी":"English"}</button> &nbsp;|&nbsp; +A A -A</span></div>
 <div class="brandrow"><div class="brand"><img src="${A}header-brand.jpg" alt="SSC"></div>
 <div class="head-actions"><div class="searchbox"><input id="searchInput" placeholder="Search"><button id="searchBtn">⌕</button></div><button class="login-btn" id="loginBtn">${tr("login")}</button></div></div>
 <nav class="nav"><div class="container nav-inner">
 <a class="nav-btn" href="#home">${tr("home")}</a>
 <a class="nav-btn" href="#chairman">${tr("chair")}</a>
 ${Object.keys(menuItems).map(k=>`<div class="nav-item" data-menu="${esc(k)}"><button class="nav-btn">${tr(k==="For Candidates"?"cand":k==="About Us"?"about":"rti")} <span>▾</span></button><div class="dropdown">${menuItems[k].map(v=>`<a href="#sub=${encodeURIComponent(v)}">${esc(v)}</a>`).join("")}</div></div>`).join("")}
 <a class="nav-btn" href="#tender">${tr("tender")}</a><a class="nav-btn" href="#rti">${tr("rti")}</a>
 </div></nav>`;
}

function hero(){
 return `<section class="hero"><img id="heroImg" src="${A}hero-building-1.jpg"><button class="hero-prev" id="heroPrev">‹</button><button class="hero-next" id="heroNext">›</button><div class="hero-dots"><i class="active"></i><i></i><i></i></div></section>
 <div class="notice-strip"><div class="ticker"><span>For inquiries or support, candidates can email: <b>helpdesk-ssc@ssc.nic.in</b></span><span>Follow the Staff Selection Commission on X (formerly Twitter): <b>@SSC_GoI</b></span><span>One Time Registration(OTR) for Scribe is live. Please click here to register.</span><a>Join Indian Navy</a></div></div>`;
}

function noticeSection(items=notices){
 return `<section class="container section"><div class="card"><div class="section-head"><h2>${tr("notice")}</h2><a href="#notices">${tr("view")}</a></div><div class="notice-list">${items.map((n,i)=>`<div class="notice-row"><div class="datebox"><span>${n[0]}</span><b>${n[1]}</b><small>${n[2]}</small></div><div class="notice-title">${esc(n[3])}</div><div class="notice-meta">(${esc(n[4])}) <b>PDF</b></div><button class="eye" data-notice="${i}">◉</button></div>`).join("")}</div><div class="pager"><button>‹</button><button class="current">1</button><button>2</button><button>3</button><button>…</button><button>65</button><button>›</button></div></div></section>`;
}

function quick(){
 return `<section class="container section"><h2 class="section-title">${tr("quick")}</h2><div class="quick-grid">
 <a class="quick" data-quick="Apply"><strong>✎</strong><span>${tr("apply")}</span></a>
 <a class="quick" data-quick="Admit Card"><strong>▣</strong><span>${tr("admit")}</span></a>
 <a class="quick" data-quick="Answer Key"><strong>▤</strong><span>${tr("answer")}</span></a>
 <a class="quick" data-quick="Result"><strong>▮</strong><span>${tr("result")}</span></a></div></section>`;
}

function calendar(){
 const rows=[["30","APR","Combined Hindi Translators Examination, 2026"],["31","MAY","Sub-Inspector in Delhi Police and Central Armed Police Forces Examination, 2026"],["5","JUN","Indian Navy Entrance Test (INET) - [Agniveer (Apprentice)]"],["30","JUN","Multi Tasking (Non-Technical) Staff Examination, 2026"]];
 return `<section class="container section"><div class="card"><div class="calendar-head"><h2>${tr("calendar")}</h2><div>‹ &nbsp; Aug, 2026 &nbsp; ›</div></div>${rows.map(r=>`<div class="cal-row"><div class="cal-date"><b>${r[0]}</b><small>${r[1]}</small></div><div>${esc(r[2])}</div></div>`).join("")}<a class="viewall" href="#calendar">View All</a></div></section>`;
}

function examsSection(){
 return `<section class="exams section"><div class="container exam-wrap"><div><h2>${tr("browse").replace(" by ","<br>")}</h2><p>Explore exam-related details and relevant resources.</p></div><div class="exam-track">${exams.slice(0,6).map((e,i)=>`<a class="exam-card" href="#exam=${i}"><h3>${esc(e)}</h3><p>View examination notices, syllabus, instructions, vacancies and related resources.</p><b>→</b></a>`).join("")}</div></div></section>`;
}

function faq(){
 return `<section class="container section"><div class="faq-grid"><div><h2>${tr("faq")}</h2><p>List of common inquiries and their brief answers to provide quick information and assist users.</p><button class="primary" data-page="faqs">View All</button></div><div><div class="popular">MOST POPULAR FAQS</div>${faqData.map((f,i)=>`<div class="faq-item"><button data-faq="${i}"><span>${esc(f[0])}</span><b>⊕</b></button><div>${esc(f[1])}</div></div>`).join("")}</div></div></section>`;
}

function initiatives(){
 const x=[["initiative-make.jpg","Make in India"],["initiative-india.jpg","Incredible India"],["initiative-data.jpg","data.gov.in"],["initiative-digital.jpg","Digital India"]];
 return `<section class="container section"><h2 class="section-title">${tr("other")}</h2><div class="initiative-grid">${x.map(a=>`<a><img src="${A+a[0]}" alt="${a[1]}"></a>`).join("")}</div></section>`;
}

function footer(){return `<footer><div class="container footer-grid"><div><div class="footer-brand"><img src="${A}ssc-footer.jpg"><b>Staff Selection<br>Commission</b></div><p>Public Disclosure of Scores and Other Details of Non-Recommended Willing Candidates</p><p>List of Debarred Candidates in Examinations Conducted by the Staff Selection Commission</p></div><div><b>Useful links</b><a>DoPT</a><a>Archives</a><a>Disclaimer</a><a>Sitemap</a><a>Help</a><a>Website Policies</a><a>Web Information Manager</a></div><div><b>Contact Us</b><p>Block No-12, CGO Complex, Lodhi Road<br>New Delhi - 110003</p></div></div><div class="container footer-bottom">© 2026 SSC. All Rights Reserved.<span>Total Visitor Count: 468827075</span><span>Last updated on Jul 24, 2026</span></div></footer>`;}

function home(){return header()+hero()+noticeSection()+quick()+calendar()+examsSection()+faq()+initiatives()+footer();}

function page(title,body){return header()+`<main class="container page"><div class="breadcrumb">Homepage &gt; ${esc(title)}</div><h1>${esc(title)}</h1>${body}</main>`+footer();}

function resultPage(){
 const cats=["All","CHSL","STENO","JE","CAPF","CTGD","CHT","OTHERS","DEPARTMENTAL EXAMS","DPHCM","RHQ","DPCE","CGL","DPCD","DPHCT","CEDP","MTS","STE"];
 return page("Results",`<div class="tabs">${cats.map((x,i)=>`<button class="${i===0?"active":""}">${x}</button>`).join("")}</div><div class="result-table"><div class="rt-head"><b>Uploaded Date</b><b>Examination Name and Year</b><b>Write Up</b><b>Result</b></div>${notices.map(n=>`<div class="rt-row"><span>${n[1]}-${n[0]}-2026</span><span>${esc(n[3])}</span><a>(${n[4]}) ↓</a><a>Result ↓</a></div>`).join("")}</div>`);
}

function admitPage(){return page("Admit Card",`<div class="login-box"><h2>Login to your Account</h2><label>Username (Registration Number) *</label><input placeholder="Registration Number"><label>Password (SSC Registration Password) *</label><input type="password" placeholder="Password"><label>Captcha *</label><div class="captcha">PBhCU <button>↻ Refresh</button></div><input placeholder="Captcha"><button class="primary">Login</button><p>New User ? <a>Register Now</a></p></div>`);}

function answerPage(){return page("Answer Key",`<div class="tabs">${["CGL","CHSL","JE","MTS","STENO","OTHERS"].map((x,i)=>`<button class="${i===0?"active":""}">${x}</button>`).join("")}</div>${notices.slice(0,6).map(n=>`<div class="answer-row"><span>${esc(n[3])}</span><b>(${n[4]}) PDF</b><a>View</a></div>`).join("")}`);}

function applyPage(){return page("Apply",`<div class="apply-box"><div>📄</div><h2>Application</h2><p>One Time Registration is required before applying for examinations.</p><button class="primary">Register Now</button><button>Login</button></div>`);}

function examPage(i){return page(exams[i]||"Examination",`<p>Official examination information and related resources.</p><div class="quick-grid">${["Examination Notice","Syllabus","Previous Year Question Paper","Tentative Vacancy","Special Instruction","Result"].map(x=>`<a class="quick" href="#sub=${encodeURIComponent(x)}"><span>${x}</span></a>`).join("")}</div>`);}

function modal(title,body){const r=document.getElementById("modal-root");r.innerHTML=`<div class="modal-backdrop" id="backdrop"><div class="modal"><div class="modal-head"><h2>${title}</h2><button id="closeModal">×</button></div><div class="modal-body">${body}</div></div></div>`;document.getElementById("closeModal").onclick=()=>r.innerHTML="";document.getElementById("backdrop").onclick=e=>{if(e.target.id==="backdrop")r.innerHTML=""};}

function bind(){
 document.querySelectorAll("[data-menu]").forEach(x=>x.querySelector("button").onclick=e=>{e.stopPropagation();document.querySelectorAll(".nav-item.open").forEach(y=>y!==x&&y.classList.remove("open"));x.classList.toggle("open")});
 document.querySelectorAll("[data-quick]").forEach(x=>x.onclick=()=>{const q=x.dataset.quick;if(q==="Result")location.hash="results";else if(q==="Admit Card")location.hash="admit";else if(q==="Answer Key")location.hash="answer";else location.hash="apply"});
 document.querySelectorAll("[data-faq]").forEach(x=>x.onclick=()=>x.parentElement.classList.toggle("open"));
 document.querySelectorAll("[data-notice]").forEach(x=>x.onclick=()=>{const n=notices[+x.dataset.notice];modal("Notice",`<div class="notice-detail"><div class="datebox"><span>${n[0]}</span><b>${n[1]}</b><small>${n[2]}</small></div><h3>${esc(n[3])}</h3><p>PDF size: ${n[4]}</p><button class="primary">Download PDF</button></div>`)});
 document.getElementById("loginBtn")?.addEventListener("click",()=>location.href="admin.html");
 document.getElementById("langBtn")?.addEventListener("click",()=>{lang=lang==="en"?"hi":"en";render()});
 document.getElementById("searchBtn")?.addEventListener("click",search);
 document.getElementById("searchInput")?.addEventListener("keydown",e=>e.key==="Enter"&&search());
 document.querySelectorAll("[data-page]").forEach(x=>x.onclick=()=>location.hash=x.dataset.page);
 bindHero();
}
function search(){const q=document.getElementById("searchInput")?.value.trim();if(!q)return;const found=[...notices.map(n=>n[3]),...exams,...faqData.map(f=>f[0])].filter(x=>x.toLowerCase().includes(q.toLowerCase()));modal("Search",found.length?found.map(x=>`<div class="search-item">${esc(x)}</div>`).join(""):"No matching results found.")}
function bindHero(){const img=document.getElementById("heroImg");if(!img)return;const imgs=["hero-building-1.jpg","hero-building-2.jpg","hero-building-3.jpg"];let i=0;const dots=[...document.querySelectorAll(".hero-dots i")];const go=d=>{i=(i+d+imgs.length)%imgs.length;img.src=A+imgs[i];dots.forEach((x,j)=>x.classList.toggle("active",i===j))};document.getElementById("heroPrev").onclick=()=>go(-1);document.getElementById("heroNext").onclick=()=>go(1);setInterval(()=>go(1),5000)}
function render(){const h=location.hash.replace("#","");const root=document.getElementById("app");if(!root)return;if(h==="results")root.innerHTML=resultPage();else if(h==="admit")root.innerHTML=admitPage();else if(h==="answer")root.innerHTML=answerPage();else if(h==="apply")root.innerHTML=applyPage();else if(h==="calendar")root.innerHTML=page("SSC Calendar",`<div class="card">${["APR","MAY","JUN","JUL"].map((m,i)=>`<div class="cal-row"><div class="cal-date"><b>${30+i}</b><small>${m}</small></div><div>Combined examination schedule and tentative calendar information</div></div>`).join("")}</div>`);else if(h==="faqs")root.innerHTML=page("FAQs",faqData.concat(faqData).map((f,i)=>`<div class="faq-item"><button data-faq="${i%faqData.length}"><span>${esc(f[0])}</span><b>⊕</b></button><div>${esc(f[1])}</div></div>`).join(""));else if(h.startsWith("exam="))root.innerHTML=examPage(+h.slice(5));else if(h==="notices")root.innerHTML=page("Notice Board",noticeSection());else if(h==="chairman")root.innerHTML=page("Chairman's Message","<p>Welcome to the Chairman’s Message section of the Staff Selection Commission.</p>");else if(h==="tender")root.innerHTML=page("Tender",`<p>Latest tender opportunities related to Staff Selection Commission.</p>`+notices.slice(0,7).map((n,i)=>`<div class="tender-row"><b>${i+1}</b><span>${esc(n[3])}<br><small>PDF. ${n[4]}</small></span><b>⇩</b></div>`).join(""));else if(h==="rti")root.innerHTML=page("RTI",`<div class="quick-grid"><a class="quick">RTI- MIS</a><a class="quick">Proactive Disclosure (RTI)</a></div>`);else root.innerHTML=home();bind()}
window.addEventListener("hashchange",render);render();
