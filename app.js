const cfg = window.SSC_CONFIG || {};
const db = (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase)
  ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY)
  : null;

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

/* =========================================================
   EXAMINATIONS
   ========================================================= */

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
  'Apply Online',
  'Admit Card',
  'Answer Key',
  'Result',
  'Candidate Login',
  'One Time Registration (OTR)',
  'Correction Window',
  'Exam City / Intimation',
  'Option-cum-Preference'
];

const ABOUT = [
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
];

const TENDER = [
  'Current Tenders',
  'Tender Archive',
  'Corrigenda'
];

const RTI = [
  'RTI Online',
  'RTI Disclosure',
  'RTI Officers'
];

const EXAM_RESOURCES = [
  'Notice',
  'Calendar',
  'Scheme of Examination',
  'Syllabus',
  'Special Instructions',
  'Previous Year Question Papers',
  'Format of Certificates',
  'Tentative Vacancy',
  'Normalization Method',
  'Mock Test'
];

/* =========================================================
   FALLBACK NOTICE DATA
   ========================================================= */

const FALLBACK_NOTICES = [
  {
    id: 'f1',
    notice_date: '2026-08-20',
    title: 'IMPORTANT NOTICE: Schedule of PET/PST for MTS (NT) and Havaldar Examination 2025',
    file_size: '536.88 KB',
    file_path: ''
  },
  {
    id: 'f2',
    notice_date: '2026-08-19',
    title: 'Corrigendum to First Round of Tentative Allocation (FRTA) dated 17.08.2026 of Combined Higher Secondary (10+2) Level Examination, 2025',
    file_size: '479.97 KB',
    file_path: ''
  },
  {
    id: 'f3',
    notice_date: '2026-08-18',
    title: 'Important Notice',
    file_size: '184.92 KB',
    file_path: ''
  },
  {
    id: 'f4',
    notice_date: '2026-08-18',
    title: 'Identity Verification (IV) for the candidates shortlisted in FRTA of Combined Higher Secondary (10+2) Level Examination (CHSLE), 2025 - reg',
    file_size: '83.41 KB',
    file_path: ''
  },
  {
    id: 'f5',
    notice_date: '2026-08-17',
    title: 'Combined Higher Secondary (10+2) Level Examination, 2025 - Declaration of First Round of Tentative Allocation (FRTA)',
    file_size: '811.22 KB',
    file_path: ''
  },
  {
    id: 'f6',
    notice_date: '2026-08-17',
    title: 'Important Notice for Departmental examinations, 2025 to be held on 23.08.2026 at Delhi',
    file_size: '247.52 KB',
    file_path: ''
  },
  {
    id: 'f7',
    notice_date: '2026-08-12',
    title: 'Important Notice - Schedule of Examinations',
    file_size: '364.75 KB',
    file_path: ''
  }
];

/* =========================================================
   CALENDAR
   ========================================================= */

const CALENDAR = [
  ['2026-08-14', 'Indian Navy Entrance Test (INET) - [Agniveer (MR as SSR) and SSR (Medical)]'],
  ['2026-08-16', 'JSA / LDC Grade Limited Departmental Competitive Examination, 2025 (for DoPT only)'],
  ['2026-08-16', 'ASO Grade Limited Departmental Competitive Examination, 2025'],
  ['2026-08-16', 'SSA / UDC Grade Limited Departmental Competitive Examination, 2025 (for DoPT only)'],
  ['2026-08-30', 'Combined Higher Secondary Level (10+2) Examination, 2026'],
  ['2026-08-30', 'Stenographer Grade C and D Examination, 2026'],
  ['2026-08-30', 'Combined Hindi Translators Examination, 2026'],
  ['2026-09-30', 'Multi Tasking (Non-Technical) Staff Examination, 2026']
];

/* =========================================================
   PROMOTIONAL ASSETS
   ========================================================= */

const PROMOS = [
  ['promo-1.jpg', 'International Day of Yoga'],
  ['promo-2.jpg', 'Mahatma Gandhi Quote / National Outreach'],
  ['promo-3.jpg', 'National Career Service'],
  ['promo-4.jpg', 'National Outreach'],
  ['promo-5.jpg', 'Government Initiative'],
  ['promo-6.jpg', 'Public Awareness'],
  ['promo-7.jpg', 'National Campaign']
];

/* =========================================================
   OTHER INITIATIVES
   ========================================================= */

const INITIATIVES = [
  ['initiative-india-gov.jpg', 'india.gov.in'],
  ['initiative-digital-india-make-in-india-azadi.jpg', 'Make in India'],
  ['initiative-incredible-india.jpg', 'Incredible India'],
  ['initiative-data.jpg', 'data.gov.in'],
  ['initiative-india.jpg', 'India Initiative']
];

/* =========================================================
   FAQ
   ========================================================= */

const FAQ = [
  [
    'Is Registration mandatory for applying to the examinations of the Commission?',
    'Registration is required before applying for examinations where the Commission specifies it.'
  ],
  [
    'I did not receive registration number and password on the email.',
    'Use the Candidate Login recovery option or contact the Commission help services.'
  ],
  [
    'When is the notice/advertisement of an Examination issued?',
    'The notice is published when the Commission approves and schedules the examination.'
  ],
  [
    'What are the posts for which the SSC conducts exams and what are the required qualifications?',
    'Open the relevant examination to see eligibility, syllabus and qualifications.'
  ],
  [
    'When does the Commission upload its Annual Calendar of Examinations?',
    'The Annual Calendar is published according to the Commission schedule.'
  ]
];

/* =========================================================
   LANGUAGE
   ========================================================= */

const I18N = {
  en: {
    feedback: 'Feedback | SSC Old Website',
    skip: 'Skip to Main Content',
    home: 'Home',
    chair: "Chairman's Message",
    cand: 'For Candidates',
    tender: 'Tender',
    rti: 'RTI',
    about: 'About Us',
    search: 'Search',
    login: 'Login or Register',
    notice: 'Notice Board',
    quick: 'Quick Links',
    calendar: 'SSC Calendar',
    browse: 'Browse by Examinations',
    faq: 'FAQs',
    popular: 'MOST POPULAR FAQS',
    initiatives: 'Other Initiatives',
    view: 'View All',
    apply: 'Apply',
    admit: 'Admit Card',
    answer: 'Answer Key',
    result: 'Result'
  },

  hi: {
    feedback: 'प्रतिक्रिया | एसएससी पुरानी वेबसाइट',
    skip: 'मुख्य विषय पर जाएं',
    home: 'होम',
    chair: 'अध्यक्ष का संदेश',
    cand: 'अभ्यर्थियों के लिए',
    tender: 'निविदा',
    rti: 'आरटीआई',
    about: 'हमारे बारे में',
    search: 'खोजें',
    login: 'लॉगिन या रजिस्टर',
    notice: 'नोटिस बोर्ड',
    quick: 'त्वरित लिंक',
    calendar: 'एसएससी कैलेंडर',
    browse: 'परीक्षाओं के अनुसार',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    popular: 'लोकप्रिय प्रश्न',
    initiatives: 'अन्य पहल',
    view: 'सभी देखें',
    apply: 'आवेदन करें',
    admit: 'प्रवेश पत्र',
    answer: 'उत्तर कुंजी',
    result: 'परिणाम'
  }
};

const tr = k =>
  (I18N[state.lang] && I18N[state.lang][k]) ||
  I18N.en[k] ||
  k;

/* =========================================================
   HELPERS
   ========================================================= */

const esc = v =>
  String(v ?? '').replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));

const slug = x =>
  String(x)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const fileUrl = path =>
  db
    ? db.storage.from('ssc-files').getPublicUrl(path).data.publicUrl
    : '#';

/* =========================================================
   ICONS
   ========================================================= */

function icon(type) {
  const paths = {
    apply:
      '<path d="M5 19l4.2-1 9.1-9.1a2 2 0 0 0-2.8-2.8L6.4 15.2 5 19Z"/><path d="m14.5 7.5 2 2"/>',

    admit:
      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h4M7 12h4M15 9h3M15 12h3M7 16h11"/>',

    answer:
      '<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h3M8.5 11h7M8.5 14h7M8.5 17h5"/>',

    result:
      '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 16v-3M12 16V9M16 16v-6"/>'
  };

  return `
    <svg viewBox="0 0 24 24" focusable="false">
      ${paths[type] || ''}
    </svg>
  `;
}

function eyeIcon() {
  return `
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z"/>
      <circle cx="12" cy="12" r="2.5"/>
    </svg>
  `;
}

/* =========================================================
   DATE
   ========================================================= */

function dateParts(s) {
  const d = new Date((s || '2026-08-18') + 'T00:00:00');

  return {
    day: String(d.getDate()).padStart(2, '0'),
    mon: d
      .toLocaleString(
        state.lang === 'hi' ? 'hi-IN' : 'en-IN',
        { month: 'short' }
      )
      .toUpperCase(),
    year: d.getFullYear()
  };
}

/* =========================================================
   HEADER
   SSC REFERENCE STYLE
   ========================================================= */

function header(active = 'home') {
  return `
    <div class="topline">
      <div class="wrap topflex">
        <span>${tr('feedback')}</span>

        <span>
          ${tr('skip')} |
          <button id="langToggle" class="plain">
            ${state.lang === 'en' ? 'हिन्दी' : 'English'}
          </button>
          | A- | A | A+
        </span>
      </div>
    </div>

    <header class="sitehead">
      <div class="wrap headrow">

        <!-- SSC BRAND -->
        <button
          class="brandbtn"
          data-route="home"
          aria-label="Staff Selection Commission Home"
        >
          <img
            src="${A}brand.jpg"
            alt="Government of India Staff Selection Commission"
          >
        </button>

        <!-- RIGHT SIDE TOOLS -->
        <div class="headtools">

          <div class="searchbox">
            <input
              id="searchInput"
              placeholder="${tr('search')}"
              aria-label="Search"
            >
            <button id="searchBtn" aria-label="Search">⌕</button>
          </div>

          <!-- LOGIN / REGISTER -->
          <button
            class="loginBtn"
            data-route="login"
          >
            ${tr('login')}
          </button>

          <!-- SMALL GOVERNMENT EMBLEM -->
          <img
            class="headerEmblem"
            src="${A}emblem.jpg"
            alt="Government of India Emblem"
          >

        </div>
      </div>
    </header>

    <nav class="mainnav">
      <div class="wrap navrow">

        ${nav('home', tr('home'), active)}

        ${nav('chair', tr('chair'), active)}

        ${menu(
          'cand',
          tr('cand'),
          CANDIDATES,
          active
        )}

        ${menu(
          'tender',
          tr('tender'),
          TENDER,
          active
        )}

        ${menu(
          'rti',
          tr('rti'),
          RTI,
          active
        )}

        ${menu(
          'about',
          tr('about'),
          ABOUT,
          active
        )}

      </div>
    </nav>
  `;
}

function nav(id, label, active) {
  return `
    <button
      class="navbtn ${active === id ? 'active' : ''}"
      data-route="${id}"
    >
      ${label}
    </button>
  `;
}

function menu(id, label, items, active) {
  return `
    <div class="navmenu">

      <button
        class="navbtn ${active === id ? 'active' : ''}"
        data-menu="${id}"
      >
        ${label}
        <span class="chev">⌄</span>
      </button>

      <div class="dropdown">

        ${items
          .map(
            x => `
              <button
                class="dropitem"
                data-route="${slug(x)}"
              >
                ${esc(x)}
              </button>
            `
          )
          .join('')}

      </div>
    </div>
  `;
}

/* =========================================================
   FOOTER
   ========================================================= */

function footer() {
  return `
    <footer class="footer">

      <div class="wrap footgrid">

        <div>

          <div class="footbrand">
            <img
              src="${A}brand.jpg"
              alt="SSC"
            >

            <span>
              Staff Selection<br>
              Commission
            </span>
          </div>

          <p>
            Public Disclosure of Scores and Other Details of
            Non-Recommended Willing Candidates
          </p>

          <p>
            List of Debarred Candidates in Examinations Conducted
            by the Staff Selection Commission
          </p>

        </div>

        <div>

          <h4>Useful Links</h4>

          <a>DoPT</a>
          <a>Archives</a>
          <a>Disclaimer</a>
          <a>Sitemap</a>
          <a>Help</a>
          <a>Website Policies</a>
          <a>Web Information Manager</a>

        </div>

        <div>

          <h4>Contact Us</h4>

          <p>
            Block No-12, CGO Complex, Lodhi Road<br>
            New Delhi - 110003
          </p>

        </div>

      </div>

      <div class="wrap footbottom">

        <span>
          © 2026 SSC. All Rights Reserved.
        </span>

        <span>
          Total Visitor Count: 475188660
        </span>

        <span>
          Last updated on Aug 18, 2026
        </span>

      </div>

    </footer>
  `;
}

/* =========================================================
   HOME
   ========================================================= */

function home() {
  return `
    ${header('home')}

    <main>

      <!-- HERO -->
      <section class="hero">
        <img
          src="${A}hero.jpg"
          alt="SSC building"
        >
      </section>

      <!-- NOTICE STRIP -->
      <section class="noticeband">

        <div>
          For inquiries or support, candidates can email:
          <u>helpdesk-ssc@ssc.nic.in</u>
        </div>

        <div>
          Follow the Staff Selection Commission on X
          (formerly Twitter):
          <u>@SSC_GoI</u>
        </div>

        <div>
          One Time Registration(OTR) for Scribe is live.
          Please click here to register.
        </div>

        <a href="#" onclick="return false">
          Join Indian Navy
        </a>

      </section>

      <!-- NOTICE BOARD -->
      <section class="section">

        <div class="wrap">

          <div class="sectionhead">

            <h2>
              ${tr('notice')}
            </h2>

            <button data-route="notices">
              ${tr('view')}
            </button>

          </div>

          <div class="noticecard">

            <div id="noticeList"></div>

            <div
              id="pager"
              class="pager"
            ></div>

          </div>

        </div>

      </section>

      <!-- QUICK LINKS -->
      <section class="quicksec">

        <div class="wrap">

          <h2>
            ${tr('quick')}
          </h2>

          <div class="quickgrid">

            <button data-route="apply-online">
              <span class="quickicon applyicon">
                ${icon('apply')}
              </span>
              ${tr('apply')}
            </button>

            <button data-route="admit-card">
              <span class="quickicon admiticon">
                ${icon('admit')}
              </span>
              ${tr('admit')}
            </button>

            <button data-route="answer-key">
              <span class="quickicon answericon">
                ${icon('answer')}
              </span>
              ${tr('answer')}
            </button>

            <button data-route="result">
              <span class="quickicon resulticon">
                ${icon('result')}
              </span>
              ${tr('result')}
            </button>

          </div>

        </div>

      </section>

      <!-- CALENDAR -->
      <section class="section">

        <div class="wrap">

          <div class="calendar card">

            <div class="sectionhead">

              <h2>
                ${tr('calendar')}
              </h2>

              <div class="monthnav">

                <button id="prevMonth">
                  ‹
                </button>

                <b id="monthLabel"></b>

                <button id="nextMonth">
                  ›
                </button>

              </div>

            </div>

            <div id="calendarList"></div>

            <button
              class="viewall"
              data-route="calendar"
            >
              ${tr('view')}
            </button>

          </div>

        </div>

      </section>

      <!-- BROWSE EXAMS -->
      <section class="examBand">

        <div class="wrap examwrap">

          <div class="examintro">

            <h2>
              ${tr('browse')}
            </h2>

            <p>
              Explore exam-related details and relevant resources
            </p>

            <button
              class="pill light"
              data-route="browse"
            >
              ${tr('view')}
            </button>

          </div>

          <div class="examarea">

            <div
              id="examGrid"
              class="examgrid"
            ></div>

            <div
              id="examDots"
              class="dots"
            ></div>

          </div>

        </div>

      </section>

      <!-- PROMOS -->
      <section class="section promoSection">

        <div class="wrap">

          <div
            id="promoGrid"
            class="promogrid"
          ></div>

          <div
            id="promoDots"
            class="dots dark"
          ></div>

        </div>

      </section>

      <!-- FAQ -->
      <section class="section faqsec">

        <div class="wrap faqwrap">

          <div>

            <h2>
              ${tr('faq')}
            </h2>

            <p>
              List of common inquiries and their brief answers
              to provide quick information and assist users.
            </p>

            <button
              class="pill"
              data-route="faq"
            >
              ${tr('view')}
            </button>

          </div>

          <div>

            <h5>
              ${tr('popular')}
            </h5>

            <div
              id="faqList"
              class="faqlist"
            ></div>

          </div>

        </div>

      </section>

      <!-- OTHER INITIATIVES -->
      <section class="section initiativeSec">

        <div class="wrap">

          <h2>
            ${tr('initiatives')}
          </h2>

          <div
            id="initiativeGrid"
            class="initiativegrid"
          ></div>

          <div
            id="initiativeDots"
            class="dots dark"
          ></div>

        </div>

      </section>

    </main>

    ${footer()}
  `;
}

/* =========================================================
   NOTICE RENDER
   ========================================================= */

function renderNotices() {

  const list =
    state.notices.length
      ? state.notices
      : FALLBACK_NOTICES;

  const pageSize = 5;

  const total =
    Math.max(
      1,
      Math.ceil(list.length / pageSize)
    );

  const page =
    Math.min(
      state.page,
      total
    );

  const start =
    (page - 1) * pageSize;

  document.getElementById('noticeList').innerHTML =
    list
      .slice(start, start + pageSize)
      .map(n => {

        const d =
          dateParts(n.notice_date);

        return `
          <article class="noticeRow">

            <div class="datebox">

              <small>
                ${d.mon}
              </small>

              <b>
                ${d.day}
              </b>

              <small>
                ${d.year}
              </small>

            </div>

            <div class="noticeTitle">
              ${esc(n.title)}
            </div>

            <div class="noticeMeta">
              (${esc(n.file_size || '')})
            </div>

            <div class="noticeActions">

              <button
                title="PDF"
                data-notice-action="pdf"
                data-notice="${esc(n.id)}"
              >
                <span class="pdficon">
                  PDF
                </span>
              </button>

              <button
                title="View"
                data-notice-action="view"
                data-notice="${esc(n.id)}"
              >
                <span class="eyeicon">
                  ${eyeIcon()}
                </span>
              </button>

            </div>

          </article>
        `;
      })
      .join('');

  const pager =
    document.getElementById('pager');

  if (
    list.length <= pageSize ||
    total <= 1
  ) {

    pager.innerHTML = '';
    pager.style.display = 'none';

  } else {

    pager.style.display = 'flex';

    const nums = [
      ...new Set(
        [
          1,
          page - 1,
          page,
          page + 1,
          total
        ].filter(
          i => i >= 1 && i <= total
        )
      )
    ];

    let html = `
      <button
        data-page="${Math.max(1, page - 1)}"
        aria-label="Previous page"
      >
        ‹
      </button>
    `;

    nums.forEach((n, i) => {

      if (
        i &&
        n > nums[i - 1] + 1
      ) {
        html += '<span>…</span>';
      }

      html += `
        <button
          class="${page === n ? 'active' : ''}"
          data-page="${n}"
        >
          ${n}
        </button>
      `;
    });

    html += `
      <button
        data-page="${Math.min(total, page + 1)}"
        aria-label="Next page"
      >
        ›
      </button>
    `;

    pager.innerHTML = html;
  }

  document
    .querySelectorAll('[data-page]')
    .forEach(b => {

      b.onclick = () => {

        state.page =
          +b.dataset.page;

        renderNotices();
      };
    });

  document
    .querySelectorAll('[data-notice]')
    .forEach(b => {

      b.onclick = () => {

        const n =
          state.notices.find(
            x =>
              String(x.id) ===
              String(b.dataset.notice)
          ) ||
          FALLBACK_NOTICES.find(
            x =>
              String(x.id) ===
              String(b.dataset.notice)
          );

        if (
          b.dataset.noticeAction === 'pdf' &&
          n?.file_path
        ) {

          window.open(
            fileUrl(n.file_path),
            '_blank',
            'noopener'
          );

        } else {

          openNotice(
            b.dataset.notice
          );
        }
      };
    });
}

/* =========================================================
   LOAD NOTICES
   ========================================================= */

async function loadNotices() {

  if (!db) {

    state.notices =
      FALLBACK_NOTICES;

    renderNotices();

    return;
  }

  const {
    data,
    error
  } =
    await db
      .from('ssc_notices')
      .select('*')
      .order(
        'notice_date',
        { ascending: false }
      )
      .order(
        'created_at',
        { ascending: false }
      );

  state.notices =
    !error &&
    data &&
    data.length
      ? data
      : FALLBACK_NOTICES;

  renderNotices();
}

/* =========================================================
   CALENDAR
   ========================================================= */

function renderCalendar() {

  const m =
    state.month;

  const items =
    CALENDAR.filter(
      x =>
        new Date(x[0]).getMonth() === m
    );

  document.getElementById(
    'monthLabel'
  ).textContent =
    new Date(
      state.year,
      m,
      1
    ).toLocaleString(
      state.lang === 'hi'
        ? 'hi-IN'
        : 'en-IN',
      {
        month: 'short',
        year: 'numeric'
      }
    );

  document.getElementById(
    'calendarList'
  ).innerHTML =
    (
      items.length
        ? items
        : CALENDAR.slice(0, 4)
    )
      .map(x => {

        const d =
          dateParts(x[0]);

        return `
          <div class="calrow">

            <div class="caldate">

              <b>
                ${d.day}
              </b>

              <small>
                ${d.mon}
              </small>

            </div>

            <div>
              ${esc(x[1])}
            </div>

          </div>
        `;
      })
      .join('');
}

/* =========================================================
   EXAMS
   ========================================================= */

function renderExams() {

  const start =
    state.examPage * 6;

  const items =
    EXAMS.slice(
      start,
      start + 6
    );

  document.getElementById(
    'examGrid'
  ).innerHTML =
    items
      .map(
        x => `
          <button
            class="examcard"
            data-route="exam:${encodeURIComponent(x)}"
          >

            <strong>
              ${esc(x)}
            </strong>

            <span>
              ${esc(x)}
              is a competitive examination conducted
              by the Staff Selection Commission...
            </span>

            <b>
              →
            </b>

          </button>
        `
      )
      .join('');

  document.getElementById(
    'examDots'
  ).innerHTML =
    [0, 1].map(
      i => `
        <button
          class="${i === state.examPage ? 'on' : ''}"
          data-exampage="${i}"
        ></button>
      `
    ).join('');

  document
    .querySelectorAll('[data-exampage]')
    .forEach(b => {

      b.onclick = () => {

        state.examPage =
          +b.dataset.exampage;

        renderExams();
      };
    });
}

/* =========================================================
   PROMOS
   ========================================================= */

function renderPromos() {

  const items =
    [0, 1, 2].map(
      i =>
        PROMOS[
          (state.promoPage + i) %
          PROMOS.length
        ]
    );

  document.getElementById(
    'promoGrid'
  ).innerHTML =
    items
      .map(
        p => `
          <button
            class="promoCard"
            data-promo="${esc(p[1])}"
          >

            <img
              src="${A}${p[0]}"
              alt="${esc(p[1])}"
            >

            <span>
              ${esc(p[1])}
            </span>

          </button>
        `
      )
      .join('');

  document.getElementById(
    'promoDots'
  ).innerHTML =
    [0, 1, 2].map(
      i => `
        <button
          class="${i === state.promoPage ? 'on' : ''}"
          data-promopage="${i}"
        ></button>
      `
    ).join('');

  document
    .querySelectorAll('[data-promopage]')
    .forEach(b => {

      b.onclick = () => {

        state.promoPage =
          +b.dataset.promopage;

        renderPromos();
      };
    });
}

/* =========================================================
   INITIATIVES
   ========================================================= */

function renderInitiatives() {

  const start =
    state.initiativePage;

  const items =
    [0, 1, 2, 3, 4].map(
      i =>
        INITIATIVES[
          (start + i) %
          INITIATIVES.length
        ]
    );

  document.getElementById(
    'initiativeGrid'
  ).innerHTML =
    items
      .map(
        p => `
          <button class="initiativeCard">

            <img
              src="${A}${p[0]}"
              alt="${esc(p[1])}"
            >

          </button>
        `
      )
      .join('');

  document.getElementById(
    'initiativeDots'
  ).innerHTML =
    [0, 1].map(
      i => `
        <button
          class="${
            i === state.initiativePage % 2
              ? 'on'
              : ''
          }"
        ></button>
      `
    ).join('');
}

/* =========================================================
   FAQ
   ========================================================= */

function renderFaq() {

  document.getElementById(
    'faqList'
  ).innerHTML =
    FAQ
      .map(
        (x, i) => `
          <div class="faqitem">

            <button data-faq="${i}">

              <span>
                ${esc(x[0])}
              </span>

              <b>
                ⊕
              </b>

            </button>

            <div class="faqanswer">
              ${esc(x[1])}
            </div>

          </div>
        `
      )
      .join('');

  document
    .querySelectorAll('[data-faq]')
    .forEach(b => {

      b.onclick = () =>
        b.parentElement.classList.toggle(
          'open'
        );
    });
}

/* =========================================================
   TOAST
   ========================================================= */

function toast(msg) {

  const el =
    document.getElementById('toast');

  if (!el) return;

  el.textContent =
    msg;

  el.classList.add('show');

  clearTimeout(
    window.__toast
  );

  window.__toast =
    setTimeout(
      () =>
        el.classList.remove('show'),
      2200
    );
}

/* =========================================================
   MODAL
   ========================================================= */

function modal(html) {

  const root =
    document.getElementById(
      'modal-root'
    );

  if (!root) return;

  root.innerHTML =
    `<div class="modalback">${html}</div>`;

  const back =
    document.querySelector(
      '.modalback'
    );

  if (back) {

    back.addEventListener(
      'click',
      e => {

        if (
          e.target.classList.contains(
            'modalback'
          )
        ) {
          closeModal();
        }
      }
    );
  }

  document
    .querySelectorAll('.close')
    .forEach(
      b =>
        b.onclick =
          closeModal
    );
}

function closeModal() {

  const root =
    document.getElementById(
      'modal-root'
    );

  if (root) {
    root.innerHTML = '';
  }
}

/* =========================================================
   RESULT MODAL
   ========================================================= */

function resultModal() {

  const cats = [
    'ALL',
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
    'CGL',
    'DPCD',
    'DPHCT',
    'CEDP',
    'MTS',
    'STENOGRAPHER'
  ];

  modal(`
    <div class="modal resultmodal">

      <div class="modalhead">

        <h3>
          🟢 Result
        </h3>

        <button class="close">
          ×
        </button>

      </div>

      <div class="tabs">

        ${cats
          .map(
            (x, i) => `
              <button
                class="tab ${i === 0 ? 'active' : ''}"
                data-resultcat="${x}"
              >
                ${x}
              </button>
            `
          )
          .join('')}

      </div>

      <div
        class="modalbody"
        id="resultBody"
      ></div>

      <div class="modalfoot">

        <button class="pill">
          View All
        </button>

      </div>

    </div>
  `);

  renderResult('ALL');

  document
    .querySelectorAll('[data-resultcat]')
    .forEach(b => {

      b.onclick = () => {

        document
          .querySelectorAll(
            '[data-resultcat]'
          )
          .forEach(
            x =>
              x.classList.remove(
                'active'
              )
          );

        b.classList.add(
          'active'
        );

        renderResult(
          b.dataset.resultcat
        );
      };
    });
}

function renderResult(cat) {

  const rows = [
    'Junior Secretariat Assistant / Lower Division Clerk Grade Limited Departmental Competitive Examination, 2023-24: Declaration of final result for the year 2024 of AFHQ Grade-II',

    'Combined Graduate Level Examination (CGLE), 2025: List of Candidates in Roll Number Order provisionally shortlisted',

    'Head Constable (Assistant Wireless Operator/Tele-Printer Operator) in Delhi Police Examination, 2025 — Additional Female Candidates qualified'
  ];

  document.getElementById(
    'resultBody'
  ).innerHTML =
    rows
      .map(
        x => `
          <div class="resultrow">

            <span>
              ${esc(x)}
            </span>

            <span>
              416.08 KB
              <i class="pdf">PDF</i>
              <u>Write up</u>
              <u>Result</u>
            </span>

          </div>
        `
      )
      .join('');
}

/* =========================================================
   ADMIT CARD
   ========================================================= */

function admitModal() {

  const rows = [
    'Download E-Admit Card of Stenographer Grade C and D Examination, 2024',

    'Download E-Admit Card of Combined Hindi Translators Examination',

    'Download E-Admit Card of Combined Higher Secondary Level Examination'
  ];

  modal(`
    <div class="modal small">

      <div class="modalhead">

        <h3>
          ▣ Admit Card
        </h3>

        <button class="close">
          ×
        </button>

      </div>

      <div class="modalbody">

        ${rows
          .map(
            x => `
              <div class="resultrow">
                <span>
                  ${esc(x)}
                </span>
              </div>
            `
          )
          .join('')}

        <div class="center">

          <button
            class="pill"
            data-route="login"
          >
            Login
          </button>

        </div>

      </div>

    </div>
  `);

  bindModalRoutes();
}

/* =========================================================
   ANSWER KEY
   ========================================================= */

function answerModal() {

  const rows = [
    'Grade C Stenographers Limited Departmental Competitive Examination, 2025: Uploading of Tentative Answer Keys along with Candidates Response Sheets.',

    'Constable (Executive) Male and Female in Delhi Police Examination, 2025: Uploading of Final Answer Keys.',

    'Head Constable (Ministerial) in Delhi Police Examination, 2025: Uploading of Final Answer Keys along with Question Papers cum Response Sheet.'
  ];

  modal(`
    <div class="modal">

      <div class="modalhead">

        <h3>
          ▤ Answer Key
        </h3>

        <button class="close">
          ×
        </button>

      </div>

      <div class="modalbody">

        ${rows
          .map(
            x => `
              <div class="resultrow">

                <span>
                  ${esc(x)}
                </span>

                <span>
                  191.93 KB
                  <i class="pdf">PDF</i>
                  ◉
                </span>

              </div>
            `
          )
          .join('')}

        <div class="center">

          <button class="pill">
            View All
          </button>

        </div>

      </div>

    </div>
  `);
}

/* =========================================================
   APPLY PAGE
   ========================================================= */

function applyPage() {

  return genericPage(
    'Apply Online',
    `
      <div class="servicecard">

        <h3>
          Apply Online
        </h3>

        <p>
          Select an examination to continue your application.
        </p>

        ${EXAMS
          .slice(0, 6)
          .map(
            x => `
              <button
                class="serviceitem"
                data-route="exam:${encodeURIComponent(x)}"
              >
                ${esc(x)}
                <b>→</b>
              </button>
            `
          )
          .join('')}

      </div>
    `
  );
}

/* =========================================================
   LOGIN PAGE
   ========================================================= */

function loginPage() {

  return `
    ${header('login')}

    <main class="page loginPage">

      <div class="wrap">

        <h2>
          Login to your Account
        </h2>

        <div class="loginbox">

          <div class="logintabs">

            <button class="active">
              Candidate
            </button>

            <button
              data-route="admin-login"
            >
              Admin
            </button>

          </div>

          <label>
            Username (Registration Number)
            <i>*</i>
          </label>

          <input
            id="loginUser"
            placeholder="Registration Number"
          >

          <
