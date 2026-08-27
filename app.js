const cfg = window.SSC_CONFIG || {};

const db =
  cfg.SUPABASE_URL &&
  cfg.SUPABASE_ANON_KEY &&
  window.supabase
    ? window.supabase.createClient(
        cfg.SUPABASE_URL,
        cfg.SUPABASE_ANON_KEY
      )
    : null;

/* =========================================================
   ASSETS
   ========================================================= */

const A = "assets/";

const ASSETS = {
  brand: "brand.jpg",
  hero: "hero.jpg",
  chairman: "chairman.jpg",
  emblem: "government-emblem-2.jpg"
};

/* =========================================================
   STATE
   ========================================================= */

const state = {
  lang: localStorage.getItem("sscLang") || "en",
  notices: [],
  results: [],
  page: 1,
  month: 7,
  year: 2026,
  examPage: 0,
  promoPage: 0,
  initiativePage: 0
};

/* =========================================================
   DATA
   ========================================================= */

const EXAMS = [
  "Selection Posts Examination",
  "Junior Engineer (Civil, Mechanical & Electrical) Examination",
  "Combined Graduate Level Examination, 2024",
  "Combined Higher Secondary Level (10+2) Examination",
  "Stenographer Grade 'C' and 'D' Examination, 2024",
  "Constable (GD) in Central Armed Police Forces (CAPFs), SSF, Rifleman (GD) in Assam Rifles and Sepoy in NCB Examination",
  "Combined Hindi Translators Examination",
  "Sub-Inspector in Delhi Police and Central Armed Police Forces Examination",
  "Multi-Tasking (Non-Technical) Staff Examination",
  "Junior Secretariat Assistant / Lower Division Clerk Examination",
  "Departmental Examination"
];

const CANDIDATES = [
  "Apply Online",
  "Admit Card",
  "Answer Key",
  "Result",
  "Candidate Login",
  "One Time Registration (OTR)",
  "Correction Window",
  "Exam City / Intimation",
  "Option-cum-Preference"
];

const ABOUT = [
  "Background of Commission",
  "Setup of Commission",
  "Organisation Structure",
  "Function of Commission",
  "Vision, Mission & Objectives of SSC",
  "Regional Network",
  "Annual Report",
  "Citizen's Charter",
  "Contact List",
  "Resolution",
  "PIDPI",
  "Right To Information",
  "Committee on Sexual Harassment"
];

const TENDER = [
  "Current Tenders",
  "Tender Archive",
  "Corrigenda"
];

const RTI = [
  "RTI Online",
  "RTI Disclosure",
  "RTI Officers"
];

const EXAM_RESOURCES = [
  "Notice",
  "Calendar",
  "Scheme of Examination",
  "Syllabus",
  "Special Instructions",
  "Previous Year Question Papers",
  "Format of Certificates",
  "Tentative Vacancy",
  "Normalization Method",
  "Mock Test"
];

/* =========================================================
   FALLBACK NOTICES
   ========================================================= */

const FALLBACK_NOTICES = [
  {
    id: "f1",
    notice_date: "2026-08-18",
    title: "Important Notice",
    file_size: "184.92 KB",
    file_path: ""
  },
  {
    id: "f2",
    notice_date: "2026-08-18",
    title:
      "Identity Verification (IV) for the candidates shortlisted in FRTA of Combined Higher Secondary (10+2) Level Examination (CHSLE), 2025 - reg",
    file_size: "83.41 KB",
    file_path: ""
  },
  {
    id: "f3",
    notice_date: "2026-08-17",
    title:
      "Combined Higher Secondary (10+2) Level Examination, 2025 - Declaration of First Round of Tentative Allocation (FRTA)",
    file_size: "811.22 KB",
    file_path: ""
  },
  {
    id: "f4",
    notice_date: "2026-08-17",
    title:
      "Important Notice for Departmental examinations, 2025 to be held on 23.08.2026 at Delhi",
    file_size: "247.52 KB",
    file_path: ""
  },
  {
    id: "f5",
    notice_date: "2026-08-12",
    title: "Important Notice - Schedule of Examinations",
    file_size: "364.75 KB",
    file_path: ""
  }
];

/* =========================================================
   CALENDAR
   ========================================================= */

const CALENDAR = [
  [
    "2026-08-14",
    "Indian Navy Entrance Test (INET) - [Agniveer (MR as SSR) and SSR (Medical)]"
  ],
  [
    "2026-08-16",
    "JSA / LDC Grade Limited Departmental Competitive Examination, 2025 (for DoPT only)"
  ],
  [
    "2026-08-16",
    "ASO Grade Limited Departmental Competitive Examination, 2025"
  ],
  [
    "2026-08-16",
    "SSA / UDC Grade Limited Departmental Competitive Examination, 2025 (for DoPT only)"
  ],
  [
    "2026-08-30",
    "Combined Higher Secondary Level (10+2) Examination, 2026"
  ],
  [
    "2026-08-30",
    "Stenographer Grade C and D Examination, 2026"
  ],
  [
    "2026-08-30",
    "Combined Hindi Translators Examination, 2026"
  ],
  [
    "2026-09-30",
    "Multi Tasking (Non-Technical) Staff Examination, 2026"
  ]
];

/* =========================================================
   ACTUAL IMAGE FILE NAMES
   ========================================================= */

const PROMOS = [
  ["promo-1.jpg", "International Day of Yoga"],
  ["promo-2.jpg", "Mahatma Gandhi Quote / National Outreach"],
  ["promo-3.jpg", "National Career Service"]
];

const INITIATIVES = [
  [
    "initiative-azadi-ka-amrit-mahotsav.jpg",
    "Azadi Ka Amrit Mahotsav"
  ],
  [
    "initiative-india-gov.jpg",
    "india.gov.in"
  ],
  [
    "initiative-digital-india-make-in-india-azadi.jpg",
    "Digital India / Make in India"
  ],
  [
    "initiative-incredible-india.jpg",
    "Incredible India"
  ],
  [
    "initiative-data.jpg",
    "data.gov.in"
  ]
];

/* =========================================================
   FAQ
   ========================================================= */

const FAQ = [
  [
    "Is Registration mandatory for applying to the examinations of the Commission?",
    "Registration is required before applying for examinations where the Commission specifies it."
  ],
  [
    "I did not receive registration number and password on the email.",
    "Use the Candidate Login recovery option or contact the Commission help services."
  ],
  [
    "When is the notice/advertisement of an Examination issued?",
    "The notice is published when the Commission approves and schedules the examination."
  ],
  [
    "What are the posts for which the SSC conducts exams and what are the required qualifications?",
    "Open the relevant examination to see eligibility, syllabus and qualifications."
  ],
  [
    "When does the Commission upload its Annual Calendar of Examinations?",
    "The Annual Calendar is published according to the Commission schedule."
  ]
];

/* =========================================================
   LANGUAGE
   ========================================================= */

const I18N = {
  en: {
    feedback: "Feedback | SSC Old Website",
    skip: "Skip to Main Content",
    home: "Home",
    chair: "Chairman's Message",
    cand: "For Candidates",
    tender: "Tender",
    rti: "RTI",
    about: "About Us",
    search: "Search",
    login: "Login or Register",
    notice: "Notice Board",
    quick: "Quick Links",
    calendar: "SSC Calendar",
    browse: "Browse by Examinations",
    faq: "FAQs",
    popular: "MOST POPULAR FAQS",
    initiatives: "Other Initiatives",
    view: "View All",
    apply: "Apply",
    admit: "Admit Card",
    answer: "Answer Key",
    result: "Result"
  },

  hi: {
    feedback: "प्रतिक्रिया | एसएससी पुरानी वेबसाइट",
    skip: "मुख्य विषय पर जाएं",
    home: "होम",
    chair: "अध्यक्ष का संदेश",
    cand: "अभ्यर्थियों के लिए",
    tender: "निविदा",
    rti: "आरटीआई",
    about: "हमारे बारे में",
    search: "खोजें",
    login: "लॉगिन या रजिस्टर",
    notice: "नोटिस बोर्ड",
    quick: "त्वरित लिंक",
    calendar: "एसएससी कैलेंडर",
    browse: "परीक्षाओं के अनुसार",
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    popular: "लोकप्रिय प्रश्न",
    initiatives: "अन्य पहल",
    view: "सभी देखें",
    apply: "आवेदन करें",
    admit: "प्रवेश पत्र",
    answer: "उत्तर कुंजी",
    result: "परिणाम"
  }
};

const tr = key =>
  (I18N[state.lang] && I18N[state.lang][key]) ||
  I18N.en[key] ||
  key;

const esc = value =>
  String(value ?? "").replace(/[&<>"']/g, match => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[match];
  });

const slug = value =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* =========================================================
   FILE URL
   ========================================================= */

const fileUrl = path => {
  if (!path) return "#";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!db) return "#";

  return db.storage
    .from("ssc-files")
    .getPublicUrl(path)
    .data.publicUrl;
};

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
      ${paths[type] || ""}
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

function dateParts(value) {
  const date = new Date(
    (value || "2026-08-18") + "T00:00:00"
  );

  return {
    day: String(date.getDate()).padStart(2, "0"),
    mon: date
      .toLocaleString(
        state.lang === "hi" ? "hi-IN" : "en-IN",
        { month: "short" }
      )
      .toUpperCase(),
    year: date.getFullYear()
  };
}

/* =========================================================
   HEADER
   ========================================================= */

function nav(id, label, active) {
  return `
    <button
      class="navbtn ${active === id ? "active" : ""}"
      data-route="${id}">
      ${label}
    </button>
  `;
}

function menu(id, label, items, active) {
  return `
    <div class="navmenu">
      <button
        class="navbtn ${active === id ? "active" : ""}"
        data-menu="${id}">
        ${label}
        <span class="chev">⌄</span>
      </button>

      <div class="dropdown">
        ${items
          .map(
            item => `
            <button
              class="dropitem"
              data-route="${slug(item)}">
              ${esc(item)}
            </button>
          `
          )
          .join("")}
      </div>
    </div>
  `;
}

function header(active = "home") {
  return `
    <div class="topline">
      <div class="wrap topflex">
        <span>${tr("feedback")}</span>

        <span>
          ${tr("skip")} |
          <button id="langToggle" class="plain">
            ${state.lang === "en" ? "हिन्दी" : "English"}
          </button>
          | A- | A | A+
        </span>
      </div>
    </div>

    <header class="sitehead">
      <div class="wrap headrow">

        <button class="brandbtn" data-route="home">
          <img
            src="${A + ASSETS.brand}"
            alt="Staff Selection Commission">
        </button>

        <div class="headtools">

          <div class="searchbox">
            <input
              id="searchInput"
              placeholder="${tr("search")}">

            <button id="searchBtn">⌕</button>
          </div>

          <button
            class="loginBtn"
            data-route="login">
            ${tr("login")}
          </button>

          <img
            class="emblem"
            src="${A + ASSETS.emblem}"
            alt="Government of India">
        </div>
      </div>
    </header>

    <nav class="mainnav">
      <div class="wrap navrow">

        ${nav("home", tr("home"), active)}
        ${nav("chair", tr("chair"), active)}

        ${menu(
          "cand",
          tr("cand"),
          CANDIDATES,
          active
        )}

        ${menu(
          "tender",
          tr("tender"),
          TENDER,
          active
        )}

        ${menu(
          "rti",
          tr("rti"),
          RTI,
          active
        )}

        ${menu(
          "about",
          tr("about"),
          ABOUT,
          active
        )}

      </div>
    </nav>
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
              src="${A + ASSETS.brand}"
              alt="SSC">

            <span>
              Staff Selection<br>
              Commission
            </span>
          </div>

          <p>
            Public Disclosure of Scores and Other Details
            of Non-Recommended Willing Candidates
          </p>

          <p>
            List of Debarred Candidates in Examinations
            Conducted by the Staff Selection Commission
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
            ⌖ Block No-12, CGO Complex,
            Lodhi Road<br>
            New Delhi - 110003
          </p>
        </div>

      </div>

      <div class="wrap footbottom">
        <span>© 2026 SSC. All Rights Reserved.</span>
        <span>Total Visitor Count: 475188660</span>
        <span>Last updated on Aug 18, 2026</span>
      </div>

    </footer>
  `;
}

/* =========================================================
   HOME PAGE
   ========================================================= */

function home() {
  return `
    ${header("home")}

    <main>

      <section class="hero">
        <img
          src="${A + ASSETS.hero}"
          alt="SSC Building">
      </section>

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

      <section class="section">
        <div class="wrap">

          <div class="sectionhead">
            <h2>${tr("notice")}</h2>

            <button data-route="notices">
              ${tr("view")}
            </button>
          </div>

          <div class="noticecard">
            <div id="noticeList"></div>

            <div
              id="pager"
              class="pager">
            </div>
          </div>

        </div>
      </section>

      <section class="quicksec">
        <div class="wrap">

          <h2>${tr("quick")}</h2>

          <div class="quickgrid">

            <button data-route="apply-online">
              <span class="quickicon applyicon">
                ${icon("apply")}
              </span>
              ${tr("apply")}
            </button>

            <button data-route="admit-card">
              <span class="quickicon admiticon">
                ${icon("admit")}
              </span>
              ${tr("admit")}
            </button>

            <button data-route="answer-key">
              <span class="quickicon answericon">
                ${icon("answer")}
              </span>
              ${tr("answer")}
            </button>

            <button data-route="result">
              <span class="quickicon resulticon">
                ${icon("result")}
              </span>
              ${tr("result")}
            </button>

          </div>

        </div>
      </section>

      <section class="section">
        <div class="wrap">

          <div class="calendar card">

            <div class="sectionhead">

              <h2>${tr("calendar")}</h2>

              <div class="monthnav">

                <button id="prevMonth">‹</button>

                <b id="monthLabel"></b>

                <button id="nextMonth">›</button>

              </div>
            </div>

            <div id="calendarList"></div>

            <button
              class="viewall"
              data-route="calendar">
              ${tr("view")}
            </button>

          </div>

        </div>
      </section>

      <section class="examBand">

        <div class="wrap examwrap">

          <div class="examintro">

            <h2>${tr("browse")}</h2>

            <p>
              Explore exam-related details and
              relevant resources
            </p>

            <button
              class="pill light"
              data-route="browse">
              ${tr("view")}
            </button>

          </div>

          <div class="examarea">

            <div
              id="examGrid"
              class="examgrid">
            </div>

            <div
              id="examDots"
              class="dots">
            </div>

          </div>

        </div>
      </section>

      <section class="section promoSection">
        <div class="wrap">

          <div
            id="promoGrid"
            class="promogrid">
          </div>

          <div
            id="promoDots"
            class="dots dark">
          </div>

        </div>
      </section>

      <section class="section faqsec">

        <div class="wrap faqwrap">

          <div>

            <h2>${tr("faq")}</h2>

            <p>
              List of common inquiries and their
              brief answers to provide quick
              information and assist users.
            </p>

            <button
              class="pill"
              data-route="faq">
              ${tr("view")}
            </button>

          </div>

          <div>

            <h5>${tr("popular")}</h5>

            <div
              id="faqList"
              class="faqlist">
            </div>

          </div>

        </div>

      </section>

      <section class="section initiativeSec">

        <div class="wrap">

          <h2>${tr("initiatives")}</h2>

          <div
            id="initiativeGrid"
            class="initiativegrid">
          </div>

          <div
            id="initiativeDots"
            class="dots dark">
          </div>

        </div>

      </section>

    </main>

    ${footer()}
  `;
}

/* =========================================================
   NOTICES
   ========================================================= */

function renderNotices() {
  const list =
    state.notices.length
      ? state.notices
      : FALLBACK_NOTICES;

  const pageSize = 5;

  const total = Math.max(
    1,
    Math.ceil(list.length / pageSize)
  );

  const page = Math.min(
    state.page,
    total
  );

  const start = (page - 1) * pageSize;

  const noticeList =
    document.getElementById("noticeList");

  if (!noticeList) return;

  noticeList.innerHTML = list
    .slice(start, start + pageSize)
    .map(notice => {

      const date = dateParts(
        notice.notice_date
      );

      return `
        <article class="noticeRow">

          <div class="datebox">
            <small>${date.mon}</small>
            <b>${date.day}</b>
            <small>${date.year}</small>
          </div>

          <div class="noticeTitle">
            ${esc(notice.title)}
          </div>

          <div class="noticeMeta">
            (${esc(notice.file_size || "")})
          </div>

          <div class="noticeActions">

            <button
              title="PDF"
              data-notice-action="pdf"
              data-notice="${esc(notice.id)}">

              <span class="pdficon">
                PDF
              </span>

            </button>

            <button
              title="View"
              data-notice-action="view"
              data-notice="${esc(notice.id)}">

              <span class="eyeicon">
                ${eyeIcon()}
              </span>

            </button>

          </div>

        </article>
      `;
    })
    .join("");

  const pager =
    document.getElementById("pager");

  if (!pager) return;

  if (
    list.length <= pageSize ||
    total <= 1
  ) {
    pager.innerHTML = "";
    pager.style.display = "none";
  } else {

    pager.style.display = "flex";

    const numbers = [
      ...new Set(
        [
          1,
          page - 1,
          page,
          page + 1,
          total
        ].filter(
          number =>
            number >= 1 &&
            number <= total
        )
      )
    ];

    let html = `
      <button
        data-page="${Math.max(
          1,
          page - 1
        )}">
        ‹
      </button>
    `;

    numbers.forEach(
      (number, index) => {

        if (
          index &&
          number >
            numbers[index - 1] + 1
        ) {
          html += "<span>…</span>";
        }

        html += `
          <button
            class="${
              page === number
                ? "active"
                : ""
            }"
            data-page="${number}">
            ${number}
          </button>
        `;
      }
    );

    html += `
      <button
        data-page="${Math.min(
          total,
          page + 1
        )}">
        ›
      </button>
    `;

    pager.innerHTML = html;
  }

  document
    .querySelectorAll("[data-page]")
    .forEach(button => {

      button.onclick = () => {
        state.page =
          Number(button.dataset.page);

        renderNotices();
      };
    });

  document
    .querySelectorAll("[data-notice]")
    .forEach(button => {

      button.onclick = () => {

        const notice =
          state.notices.find(
            item =>
              String(item.id) ===
              String(button.dataset.notice)
          ) ||
          FALLBACK_NOTICES.find(
            item =>
              String(item.id) ===
              String(button.dataset.notice)
          );

        if (
          button.dataset.noticeAction ===
            "pdf" &&
          notice?.file_path
        ) {
          window.open(
            fileUrl(notice.file_path),
            "_blank",
            "noopener"
          );
        } else {
          openNotice(
            button.dataset.notice
          );
        }
      };
    });
}

async function loadNotices() {
  try {

    if (!db) {
      state.notices =
        FALLBACK_NOTICES;

      renderNotices();
      return;
    }

    const { data, error } =
      await db
        .from("ssc_notices")
        .select("*")
        .order(
          "notice_date",
          { ascending: false }
        )
        .order(
          "created_at",
          { ascending: false }
        );

    state.notices =
      !error &&
      data &&
      data.length
        ? data
        : FALLBACK_NOTICES;

    renderNotices();

  } catch (error) {

    console.error(error);

    state.notices =
      FALLBACK_NOTICES;

    renderNotices();
  }
}

/* =========================================================
   CALENDAR
   ========================================================= */

function renderCalendar() {
  const month = state.month;

  const items =
    CALENDAR.filter(
      item =>
        new Date(item[0])
          .getMonth() === month
    );

  const label =
    document.getElementById(
      "monthLabel"
    );

  if (!label) return;

  label.textContent =
    new Date(
      state.year,
      month,
      1
    ).toLocaleString(
      state.lang === "hi"
        ? "hi-IN"
        : "en-IN",
      {
        month: "short",
        year: "numeric"
      }
    );

  const calendarList =
    document.getElementById(
      "calendarList"
    );

  if (!calendarList) return;

  calendarList.innerHTML =
    (items.length
      ? items
      : CALENDAR.slice(0, 4)
    )
      .map(item => {

        const date =
          dateParts(item[0]);

        return `
          <div class="calrow">

            <div class="caldate">
              <b>${date.day}</b>
              <small>${date.mon}</small>
            </div>

            <div>
              ${esc(item[1])}
            </div>

          </div>
        `;
      })
      .join("");
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

  const grid =
    document.getElementById(
      "examGrid"
    );

  if (!grid) return;

  grid.innerHTML = items
    .map(
      exam => `
      <button
        class="examcard"
        data-route="exam:${encodeURIComponent(
          exam
        )}">

        <strong>
          ${esc(exam)}
        </strong>

        <span>
          ${esc(exam)} is a competitive
          examination conducted by the
          Staff Selection Commission...
        </span>

        <b>→</b>

      </button>
    `
    )
    .join("");

  const dots =
    document.getElementById(
      "examDots"
    );

  if (!dots) return;

  dots.innerHTML = [0, 1]
    .map(
      page => `
      <button
        class="${
          page === state.examPage
            ? "on"
            : ""
        }"
        data-exampage="${page}">
      </button>
    `
    )
    .join("");

  document
    .querySelectorAll(
      "[data-exampage]"
    )
    .forEach(button => {

      button.onclick = () => {
        state.examPage =
          Number(
            button.dataset.exampage
          );

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
      index =>
        PROMOS[
          (state.promoPage + index) %
            PROMOS.length
        ]
    );

  const grid =
    document.getElementById(
      "promoGrid"
    );

  if (!grid) return;

  grid.innerHTML = items
    .map(
      promo => `
      <button
        class="promoCard"
        data-promo="${esc(
          promo[1]
        )}">

        <img
          src="${A + promo[0]}"
          alt="${esc(promo[1])}"
          onerror="this.style.display='none'">

        <span>
          ${esc(promo[1])}
        </span>

      </button>
    `
    )
    .join("");

  const dots =
    document.getElementById(
      "promoDots"
    );

  if (!dots) return;

  dots.innerHTML = [
    0,
    1,
    2
  ]
    .map(
      page => `
      <button
        class="${
          page === state.promoPage
            ? "on"
            : ""
        }"
        data-promopage="${page}">
      </button>
    `
    )
    .join("");

  document
    .querySelectorAll(
      "[data-promopage]"
    )
    .forEach(button => {

      button.onclick = () => {
        state.promoPage =
          Number(
            button.dataset.promopage
          );

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
      index =>
        INITIATIVES[
          (start + index) %
            INITIATIVES.length
        ]
    );

  const grid =
    document.getElementById(
      "initiativeGrid"
    );

  if (!grid) return;

  grid.innerHTML = items
    .map(
      item => `
      <button class="initiativeCard">

        <img
          src="${A + item[0]}"
          alt="${esc(item[1])}"
          onerror="this.style.display='none'">

      </button>
    `
    )
    .join("");

  const dots =
    document.getElementById(
      "initiativeDots"
    );

  if (!dots) return;

  dots.innerHTML = [0, 1]
    .map(
      page => `
      <button
        class="${
          page ===
          state.initiativePage % 2
            ? "on"
            : ""
        }"
        data-initiativepage="${page}">
      </button>
    `
    )
    .join("");

  document
    .querySelectorAll(
      "[data-initiativepage]"
    )
    .forEach(button => {

      button.onclick = () => {
        state.initiativePage =
          Number(
            button.dataset
              .initiativepage
          );

        renderInitiatives();
      };
    });
}

/* =========================================================
   FAQ
   ========================================================= */

function renderFaq() {
  const faqList =
    document.getElementById(
      "faqList"
    );

  if (!faqList) return;

  faqList.innerHTML =
    FAQ.map(
      (item, index) => `
      <div class="faqitem">

        <button data-faq="${index}">

          <span>
            ${esc(item[0])}
          </span>

          <b>⊕</b>

        </button>

        <div class="faqanswer">
          ${esc(item[1])}
        </div>

      </div>
    `
    ).join("");

  document
    .querySelectorAll("[data-faq]")
    .forEach(button => {

      button.onclick = () => {
        button.parentElement
          .classList
          .toggle("open");
      };
    });
}

/* =========================================================
   TOAST AND MODAL
   ========================================================= */

function toast(message) {
  const element =
    document.getElementById("toast");

  if (!element) return;

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(window.__toast);

  window.__toast =
    setTimeout(() => {
      element.classList.remove("show");
    }, 2200);
}

function modal(html) {
  const root =
    document.getElementById(
      "modal-root"
    );

  if (!root) return;

  root.innerHTML = `
    <div class="modalback">
      ${html}
    </div>
  `;

  document
    .querySelector(".modalback")
    ?.addEventListener(
      "click",
      event => {
        if (
          event.target.classList.contains(
            "modalback"
          )
        ) {
          closeModal();
        }
      }
    );

  document
    .querySelectorAll(".close")
    .forEach(button => {
      button.onclick = closeModal;
    });
}

function closeModal() {
  const root =
    document.getElementById(
      "modal-root"
    );

  if (root) {
    root.innerHTML = "";
  }
}

/* =========================================================
   RESULTS
   ========================================================= */

function resultModal() {
  const categories = [
    "ALL",
    "CHSL",
    "JEN",
    "CAPF",
    "CTGD",
    "CHT",
    "OTHERS",
    "DEPARTMENTAL EXAMS",
    "DPHM",
    "RHQ",
    "DPCE",
    "CGL",
    "DPCD",
    "DPHCT",
    "CEDP",
    "MTS",
    "STENOGRAPHER"
  ];

  modal(`
    <div class="modal resultmodal">

      <div class="modalhead">
        <h3>Result</h3>
        <button class="close">×</button>
      </div>

      <div class="tabs">
        ${categories
          .map(
            (category, index) => `
            <button
              class="tab ${
                index === 0
                  ? "active"
                  : ""
              }"
              data-resultcat="${category}">
              ${category}
            </button>
          `
          )
          .join("")}
      </div>

      <div
        class="modalbody"
        id="resultBody">

        <p class="muted">
          Loading results…
        </p>

      </div>

      <div class="modalfoot">
        <button
          class="pill"
          id="resultViewAll">
          View All
        </button>
      </div>

    </div>
  `);

  loadResults("ALL");

  document
    .querySelectorAll(
      "[data-resultcat]"
    )
    .forEach(button => {

      button.onclick = () => {

        document
          .querySelectorAll(
            "[data-resultcat]"
          )
          .forEach(item =>
            item.classList.remove(
              "active"
            )
          );

        button.classList.add(
          "active"
        );

        loadResults(
          button.dataset.resultcat
        );
      };
    });

  document
    .getElementById("resultViewAll")
    ?.addEventListener(
      "click",
      () => loadResults("ALL")
    );
}

async function loadResults(category = "ALL") {
  const body =
    document.getElementById(
      "resultBody"
    );

  if (!body) return;

  if (!db) {
    body.innerHTML = `
      <p class="muted">
        Connect Supabase to show
        uploaded result files.
      </p>
    `;
    return;
  }

  body.innerHTML = `
    <p class="muted">
      Loading results…
    </p>
  `;

  try {

    const { data, error } =
      await db
        .from("ssc_results")
        .select("*")
        .order(
          "result_date",
          { ascending: false }
        )
        .order(
          "created_at",
          { ascending: false }
        );

    if (error) {
      console.error(error);

      body.innerHTML = `
        <p class="muted">
          Unable to load results.
          Check Supabase configuration.
        </p>
      `;

      return;
    }

    state.results = data || [];

    const rows =
      category === "ALL"
        ? state.results
        : state.results.filter(
            item =>
              String(
                item.category || ""
              ).toUpperCase() ===
              category
          );

    if (!rows.length) {
      body.innerHTML = `
        <p class="muted">
          No uploaded result files
          in this category.
        </p>
      `;
      return;
    }

    body.innerHTML = rows
      .map(item => {

        const link =
          item.file_path
            ? fileUrl(
                item.file_path
              )
            : "#";

        return `
          <div class="resultrow">

            <span>

              <b>
                ${esc(item.title)}
              </b>

              <small>
                ${esc(
                  item.result_date || ""
                )}
                ·
                ${esc(
                  item.file_size || ""
                )}
                ·
                ${esc(
                  item.category || ""
                )}
              </small>

            </span>

            <span>

              ${
                item.file_path
                  ? `
                    <a
                      class="result-link"
                      href="${esc(link)}"
                      target="_blank"
                      rel="noopener">
                      PDF
                    </a>
                  `
                  : "No file"
              }

            </span>

          </div>
        `;
      })
      .join("");

  } catch (error) {

    console.error(error);

    body.innerHTML = `
      <p class="muted">
        Unable to load results.
      </p>
    `;
  }
}

/* =========================================================
   ADMIT CARD
   ========================================================= */

function admitModal() {
  const cards = [
    "Download E-Admit Card of Stenographer Grade C and D Examination, 2024",
    "Download E-Admit Card of Combined Hindi Translators Examination",
    "Download E-Admit Card of Combined Higher Secondary Level Examination"
  ];

  modal(`
    <div class="modal small">

      <div class="modalhead">
        <h3>▣ Admit Card</h3>
        <button class="close">×</button>
      </div>

      <div class="modalbody">

        ${cards
          .map(
            item => `
            <div class="resultrow">
              <span>${item}</span>
            </div>
          `
          )
          .join("")}

        <div class="center">
          <button
            class="pill"
            data-route="login">
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
  const answers = [
    "Grade C Stenographers Limited Departmental Competitive Examination, 2025: Uploading of Tentative Answer Keys along with Candidates Response Sheets.",
    "Constable (Executive) Male and Female in Delhi Police Examination, 2025: Uploading of Final Answer Keys.",
    "Head Constable (Ministerial) in Delhi Police Examination, 2025: Uploading of Final Answer Keys along with Question Papers cum Response Sheet."
  ];

  modal(`
    <div class="modal">

      <div class="modalhead">
        <h3>▤ Answer Key</h3>
        <button class="close">×</button>
      </div>

      <div class="modalbody">

        ${answers
          .map(
            item => `
            <div class="resultrow">
              <span>${item}</span>
              <span>
                PDF
              </span>
            </div>
          `
          )
          .join("")}

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
   PAGES
   ========================================================= */

function genericPage(
  title,
  body
) {
  return `
    ${header("")}

    <main class="page">

      <div class="wrap">

        <div class="crumb">
          ← Homepage &gt;
          ${esc(title)}
        </div>

        <h2>
          ${esc(title)}
        </h2>

        ${body}

      </div>

    </main>

    ${footer()}
  `;
}

function applyPage() {
  return genericPage(
    "Apply Online",
    `
      <div class="servicecard">

        <h3>
          Apply Online
        </h3>

        <p>
          Select an examination to
          continue your application.
        </p>

        ${EXAMS.slice(0, 6)
          .map(
            exam => `
            <button
              class="serviceitem"
              data-route="exam:${encodeURIComponent(
                exam
              )}">

              ${esc(exam)}
              <b>→</b>

            </button>
          `
          )
          .join("")}

      </div>
    `
  );
}

function loginPage() {
  return `
    ${header("login")}

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
              data-route="admin-login">
              Admin
            </button>

          </div>

          <label>
            Username
            (Registration Number)
            <i>*</i>
          </label>

          <input
            id="loginUser"
            placeholder="Registration Number">

          <label>
            Password
            <i>*</i>
          </label>

          <div class="passrow">

            <input
              id="loginPass"
              type="password"
              placeholder="Password">

            <button type="button">
              ◉
            </button>

          </div>

          <a class="forgot">
            Forgot Password
          </a>

          <div class="captcha">
            <b>69vXs</b>
            <button type="button">
              ↻ Refresh
            </button>
          </div>

          <label>
            Captcha
            <i>*</i>
          </label>

          <input placeholder="Captcha">

          <button
            id="candidateLogin"
            class="loginfull">

            Login

          </button>

          <div class="loginlinks">
            New User?
            <a>
              Register Now
            </a>
          </div>

        </div>

      </div>

    </main>

    ${footer()}
  `;
}

function chairmanPage() {
  return genericPage(
    "Chairman's Message",
    `
      <div class="chaircard">

        <div class="chairhero">

          <img
            src="${A + ASSETS.chairman}"
            alt="Chairman"
            onerror="this.style.display='none'">

          <div>

            <h3>
              Chairman's Message
            </h3>

            <p>
              Staff Selection Commission has evolved
              as one of the trusted recruiting agencies
              in India. The Commission uses technology
              and transparent processes to conduct fair
              recruitment.
            </p>

            <p>
              For the full message and downloadable
              documents, use the links provided by
              the administrator.
            </p>

          </div>

        </div>

      </div>
    `
  );
}

function tenderPage() {
  return genericPage(
    "SSC Tender",
    `
      <p>
        Welcome to the SSC Tenders page,
        your gateway to tender announcements.
      </p>

      <div class="servicecard">

        ${Array.from(
          { length: 9 },
          (_, index) => `
          <div class="tenderrow">

            <span class="datebox">
              <small>APR</small>
              <b>${8 - (index % 7)}</b>
              <small>2026</small>
            </span>

            <span>
              Opening of Financial Bids in respect
              of RFP for Selection of Service Provider
              for SSC Examinations and Candidate Services
            </span>

            <span>
              PDF ·
              ${158 + index * 17}.89 KB
            </span>

            <span>↓</span>

          </div>
        `
        ).join("")}

      </div>
    `
  );
}

/* =========================================================
   NOTICE MODAL
   ========================================================= */

function openNotice(id) {
  const notice =
    state.notices.find(
      item =>
        String(item.id) ===
        String(id)
    ) ||
    FALLBACK_NOTICES.find(
      item =>
        String(item.id) ===
        String(id)
    );

  if (!notice) return;

  const link =
    notice.file_path
      ? fileUrl(
          notice.file_path
        )
      : "#";

  modal(`
    <div class="modal">

      <div class="modalhead">
        <h3>Notice</h3>
        <button class="close">×</button>
      </div>

      <div class="modalbody">

        <h3>
          ${esc(notice.title)}
        </h3>

        <p>
          ${esc(
            notice.notice_date || ""
          )}
        </p>

        <p>
          ${esc(
            notice.file_size || ""
          )}
        </p>

        ${
          notice.file_path
            ? `
              <a
                class="pill"
                href="${esc(link)}"
                target="_blank"
                rel="noopener">
                Open PDF
              </a>
            `
            : `
              <p class="muted">
                No PDF attached.
              </p>
            `
        }

      </div>

    </div>
  `);
}

/* =========================================================
   EXAM MODAL
   ========================================================= */

function examModal(name) {
  modal(`
    <div class="modal exammodal">

      <div class="modalhead">

        <h3>
          ${esc(name)}
        </h3>

        <button class="close">
          ×
        </button>

      </div>

      <div class="tabs">

        ${EXAM_RESOURCES
          .map(
            (item, index) => `
            <button
              class="tab ${
                index === 0
                  ? "active"
                  : ""
              }"
              data-examtab="${slug(
                item
              )}">

              ${esc(item)}

            </button>
          `
          )
          .join("")}

      </div>

      <div
        class="modalbody"
        id="examBody">

        <h4>Notice</h4>

        <p>
          Examination-specific content can
          be managed from the administrator
          panel.
        </p>

      </div>

    </div>
  `);

  document
    .querySelectorAll(
      "[data-examtab]"
    )
    .forEach(button => {

      button.onclick = () => {

        document
          .querySelectorAll(
            "[data-examtab]"
          )
          .forEach(item =>
            item.classList.remove(
              "active"
            )
          );

        button.classList.add(
          "active"
        );

        const body =
          document.getElementById(
            "examBody"
          );

        if (body) {
          body.innerHTML = `
            <h4>
              ${esc(
                button.textContent
              )}
            </h4>

            <p>
              ${esc(name)}
              —
              ${esc(
                button.textContent
              )}
              documents and links can be
              published by the administrator.
            </p>
          `;
        }
      };
    });
}

/* =========================================================
   SEARCH
   ========================================================= */

function doSearch() {
  const input =
    document.getElementById(
      "searchInput"
    );

  const query =
    (input?.value || "")
      .trim()
      .toLowerCase();

  if (!query) {
    toast(
      "Enter a search term"
    );
    return;
  }

  const all = [
    ...EXAMS,
    ...CANDIDATES,
    ...ABOUT,
    ...TENDER,
    ...RTI,
    ...state.notices.map(
      notice => notice.title
    )
  ];

  const hits =
    all.filter(item =>
      item
        .toLowerCase()
        .includes(query)
    );

  modal(`
    <div class="modal">

      <div class="modalhead">
        <h3>Search</h3>
        <button class="close">×</button>
      </div>

      <div class="modalbody">

        ${
          hits.length
            ? hits
                .map(
                  item => `
                  <button
                    class="serviceitem"
                    data-route="${slug(
                      item
                    )}">

                    ${esc(item)}
                    <b>→</b>

                  </button>
                `
                )
                .join("")
            : `
                <p>
                  No matching results found.
                </p>
              `
        }

      </div>

    </div>
  `);

  bindModalRoutes();
}

/* =========================================================
   ROUTING
   ========================================================= */

function route(routeName) {
  if (!routeName) return;

  location.hash = routeName;

  document
    .querySelectorAll(
      ".navmenu.open"
    )
    .forEach(item =>
      item.classList.remove("open")
    );

  closeModal();

  if (routeName === "home") {
    renderHome();
    return;
  }

  if (
    routeName === "login" ||
    routeName === "candidate-login"
  ) {
    document.getElementById(
      "app"
    ).innerHTML = loginPage();

    bindCommon();
    return;
  }

  if (routeName === "admin-login") {
    location.href = "admin.html";
    return;
  }

  if (routeName === "result") {
    resultModal();
    return;
  }

  if (routeName === "admit-card") {
    admitModal();
    return;
  }

  if (routeName === "answer-key") {
    answerModal();
    return;
  }

  if (routeName === "apply-online") {
    document.getElementById(
      "app"
    ).innerHTML = applyPage();

    bindCommon();
    return;
  }

  if (routeName === "chair") {
    document.getElementById(
      "app"
    ).innerHTML = chairmanPage();

    bindCommon();
    return;
  }

  if (
    routeName === "tender" ||
    routeName === "current-tenders" ||
    routeName === "tender-archive" ||
    routeName === "corrigenda"
  ) {
    document.getElementById(
      "app"
    ).innerHTML = tenderPage();

    bindCommon();
    return;
  }

  if (routeName === "browse") {

    modal(`
      <div class="modal">

        <div class="modalhead">
          <h3>
            Browse by Examinations
          </h3>

          <button class="close">
            ×
          </button>
        </div>

        <div class="modalbody exammenu">

          ${EXAMS
            .map(
              exam => `
              <button
                data-route="exam:${encodeURIComponent(
                  exam
                )}">

                ${esc(exam)}
                <b>→</b>

              </button>
            `
            )
            .join("")}

        </div>

      </div>
    `);

    bindModalRoutes();
    return;
  }

  if (
    routeName.startsWith("exam:")
  ) {
    examModal(
      decodeURIComponent(
        routeName.slice(5)
      )
    );
    return;
  }

  if (
    routeName.startsWith("notice:")
  ) {
    openNotice(
      routeName.slice(7)
    );
    return;
  }

  if (routeName === "notices") {

    document.getElementById(
      "app"
    ).innerHTML = genericPage(
      "Notice Board",
      `
        <div
          class="servicecard"
          id="allNotices">
        </div>
      `
    );

    bindCommon();

    const box =
      document.getElementById(
        "allNotices"
      );

    if (box) {

      const list =
        state.notices.length
          ? state.notices
          : FALLBACK_NOTICES;

      box.innerHTML = list
        .map(
          notice => `
          <div class="resultrow">

            <span>
              ${esc(notice.title)}
            </span>

            <span>

              <a
                href="${
                  notice.file_path
                    ? esc(
                        fileUrl(
                          notice.file_path
                        )
                      )
                    : "#"
                }"
                target="_blank">

                PDF

              </a>

              <button
                data-notice="${esc(
                  notice.id
                )}">
                ◉
              </button>

            </span>

          </div>
        `
        )
        .join("");

      document
        .querySelectorAll(
          "[data-notice]"
        )
        .forEach(button => {

          button.onclick = () =>
            openNotice(
              button.dataset.notice
            );
        });
    }

    return;
  }

  if (routeName === "calendar") {

    document.getElementById(
      "app"
    ).innerHTML = genericPage(
      "SSC Calendar",
      CALENDAR.map(
        item => `
        <div class="resultrow">

          <b>
            ${esc(item[0])}
          </b>

          <span>
            ${esc(item[1])}
          </span>

        </div>
      `
      ).join("")
    );

    bindCommon();
    return;
  }

  if (routeName === "faq") {

    document.getElementById(
      "app"
    ).innerHTML = genericPage(
      "Frequently Asked Questions",
      FAQ.map(
        item => `
        <div class="faqfull">

          <b>
            ${esc(item[0])}
          </b>

          <p>
            ${esc(item[1])}
          </p>

        </div>
      `
      ).join("")
    );

    bindCommon();
    return;
  }

  if (
    routeName === "rti" ||
    routeName.startsWith("rti-")
  ) {

    document.getElementById(
      "app"
    ).innerHTML = genericPage(
      "RTI",
      `
        <div class="servicecard">

          ${RTI.map(
            item => `
            <button
              class="serviceitem"
              data-route="${slug(
                item
              )}">

              ${esc(item)}
              <b>→</b>

            </button>
          `
          ).join("")}

        </div>
      `
    );

    bindCommon();
    return;
  }

  if (
    routeName === "about" ||
    ABOUT.map(slug).includes(
      routeName
    )
  ) {

    document.getElementById(
      "app"
    ).innerHTML = genericPage(
      "About Us",
      `
        <div class="servicecard">

          ${ABOUT.map(
            item => `
            <button
              class="serviceitem"
              data-route="${slug(
                item
              )}">

              ${esc(item)}
              <b>→</b>

            </button>
          `
          ).join("")}

        </div>
      `
    );

    bindCommon();
    return;
  }

  document.getElementById(
    "app"
  ).innerHTML = genericPage(
    routeName.replace(
      /-/g,
      " "
    ),
    `
      <div class="servicecard">

        <p>
          This option is active and ready
          for administrator-managed content
          and documents.
        </p>

      </div>
    `
  );

  bindCommon();
}

/* =========================================================
   COMMON EVENTS
   ========================================================= */

function bindModalRoutes() {
  document
    .querySelectorAll(
      "#modal-root [data-route]"
    )
    .forEach(button => {

      button.onclick = () =>
        route(
          button.dataset.route
        );
    });
}

function bindCommon() {

  document
    .querySelectorAll(
      "[data-route]"
    )
    .forEach(button => {

      button.onclick = () =>
        route(
          button.dataset.route
        );
    });

  document
    .querySelectorAll(
      "[data-menu]"
    )
    .forEach(button => {

      button.onclick = event => {

        event.stopPropagation();

        const parent =
          button.parentElement;

        document
          .querySelectorAll(
            ".navmenu.open"
          )
          .forEach(item => {

            if (item !== parent) {
              item.classList.remove(
                "open"
              );
            }
          });

        parent.classList.toggle(
          "open"
        );
      };
    });

  document.onclick = event => {

    if (
      !event.target.closest(
        ".navmenu"
      )
    ) {
      closeMenus();
    }
  };

  document
    .getElementById("langToggle")
    ?.addEventListener(
      "click",
      () => {

        state.lang =
          state.lang === "en"
            ? "hi"
            : "en";

        localStorage.setItem(
          "sscLang",
          state.lang
        );

        renderHome();
      }
    );

  document
    .getElementById("searchBtn")
    ?.addEventListener(
      "click",
      doSearch
    );

  document
    .getElementById("searchInput")
    ?.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter"
        ) {
          doSearch();
        }
      }
    );

  document
    .getElementById("prevMonth")
    ?.addEventListener(
      "click",
      () => {

        state.month =
          (state.month + 11) %
          12;

        renderCalendar();
      }
    );

  document
    .getElementById("nextMonth")
    ?.addEventListener(
      "click",
      () => {

        state.month =
          (state.month + 1) %
          12;

        renderCalendar();
      }
    );

  document
    .getElementById(
      "candidateLogin"
    )
    ?.addEventListener(
      "click",
      () => {

        toast(
          "Candidate login form is ready."
        );
      }
    );
}

function closeMenus() {
  document
    .querySelectorAll(
      ".navmenu.open"
    )
    .forEach(item =>
      item.classList.remove(
        "open"
      )
    );
}

/* =========================================================
   RENDER HOME
   ========================================================= */

function renderHome() {

  const app =
    document.getElementById("app");

  if (!app) return;

  app.innerHTML = home();

  bindCommon();

  loadNotices();

  renderCalendar();

  renderExams();

  renderPromos();

  renderInitiatives();

  renderFaq();

  clearInterval(
    window.sscTimer
  );

  window.sscTimer =
    setInterval(() => {

      state.promoPage =
        (state.promoPage + 1) %
        PROMOS.length;

      state.initiativePage =
        (state.initiativePage + 1) %
        2;

      renderPromos();

      renderInitiatives();

    }, 5000);
}

/* =========================================================
   HASH CHANGE
   ========================================================= */

window.addEventListener(
  "hashchange",
  () => {

    const routeName =
      location.hash.slice(1) ||
      "home";

    if (
      routeName === "home"
    ) {
      renderHome();
    } else {
      route(routeName);
    }
  }
);

/* =========================================================
   START
   ========================================================= */

renderHome();
