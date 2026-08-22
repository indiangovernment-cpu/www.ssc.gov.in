Admin app.js — Complete Replacement Code

const cfg = window.SSC_CONFIG || {};

const hasSupabase =
  !!(
    cfg.SUPABASE_URL &&
    cfg.SUPABASE_ANON_KEY &&
    window.supabase
  );

const db = hasSupabase
  ? window.supabase.createClient(
      cfg.SUPABASE_URL,
      cfg.SUPABASE_ANON_KEY
    )
  : null;

let user = null;
let uploadedPath = '';
let uploadedSize = '';

const CATEGORIES = [
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

const $ = id => document.getElementById(id);

function setStatus(message) {
  if ($('status')) {
    $('status').textContent = message;
  }
}

function setUploadMessage(message) {
  if ($('uploadMsg')) {
    $('uploadMsg').textContent = message;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char])
  );
}

/* =========================================================
   CATEGORY FIELD
   ========================================================= */

function ensureCategoryField() {
  if (!$('publish')) return;
  if ($('noticeCategory')) return;

  const select = document.createElement('select');

  select.id = 'noticeCategory';
  select.name = 'noticeCategory';

  select.innerHTML = CATEGORIES.map(category => `
    <option value="${escapeHtml(category)}">
      ${escapeHtml(category)}
    </option>
  `).join('');

  const title = $('noticeTitle');
  const date = $('noticeDate');

  if (title && title.parentElement) {
    title.parentElement.insertBefore(
      select,
      title.nextSibling
    );
  } else if (date && date.parentElement) {
    date.parentElement.appendChild(select);
  } else if ($('publish').parentElement) {
    $('publish').parentElement.insertBefore(
      select,
      $('publish')
    );
  }

  select.style.width = '100%';
  select.style.margin = '8px 0';
  select.style.padding = '10px';
  select.style.border = '1px solid #ccc';
  select.style.borderRadius = '6px';
  select.style.background = '#fff';
  select.style.color = '#111';
}

/* =========================================================
   SUPABASE CHECK
   ========================================================= */

if (!hasSupabase) {
  setStatus(
    'Supabase configuration missing. Check SSC_CONFIG.'
  );

  if ($('login')) {
    $('login').disabled = true;
  }
}

/* =========================================================
   LOGIN
   ========================================================= */

if ($('login')) {

  $('login').onclick = async () => {

    if (!db) {
      setStatus('Supabase is not configured.');
      return;
    }

    const email = ($('email')?.value || '').trim();
    const password = $('password')?.value || '';

    if (!email || !password) {
      setStatus('Enter email and password.');
      return;
    }

    setStatus('Logging in...');

    try {

      const { data, error } =
        await db.auth.signInWithPassword({
          email,
          password
        });

      if (error) {
        console.error('LOGIN ERROR:', error);
        setStatus(error.message);
        return;
      }

      user = data?.user || null;

      if (!user) {
        setStatus('Login succeeded but user session was not found.');
        return;
      }

      if ($('auth')) {
        $('auth').hidden = true;
      }

      if ($('manager')) {
        $('manager').hidden = false;
      }

      ensureCategoryField();

      setStatus(
        'Logged in. Choose a PDF, upload it, select category and publish.'
      );

      await loadNotices();

    } catch (error) {

      console.error('LOGIN EXCEPTION:', error);

      setStatus(
        error?.message ||
        'Login failed.'
      );
    }
  };
}

/* =========================================================
   GET CURRENT SESSION
   ========================================================= */

async function getCurrentUser() {

  if (!db) return null;

  try {

    const {
      data,
      error
    } = await db.auth.getSession();

    if (error) {
      console.error(
        'GET SESSION ERROR:',
        error
      );

      return null;
    }

    user = data?.session?.user || null;

    return user;

  } catch (error) {

    console.error(
      'GET SESSION EXCEPTION:',
      error
    );

    return null;
  }
}

/* =========================================================
   UPLOAD FILE
   ========================================================= */

if ($('upload')) {

  $('upload').onclick = async () => {

    if (!db) {
      setUploadMessage(
        'Supabase is not configured.'
      );
      return;
    }

    setUploadMessage('');
    setStatus('');

    /* -----------------------------------------
       Make sure session/user exists
       ----------------------------------------- */

    if (!user) {
      user = await getCurrentUser();
    }

    if (!user) {
      setUploadMessage(
        'Please login again before uploading.'
      );
      return;
    }

    /* -----------------------------------------
       Get selected file
       ----------------------------------------- */

    const fileInput = $('file');

    const file =
      fileInput?.files?.[0];

    if (!file) {
      setUploadMessage(
        'Choose a file first.'
      );
      return;
    }

    /* -----------------------------------------
       File type check
       ----------------------------------------- */

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setUploadMessage(
        'Please select a PDF file.'
      );
      return;
    }

    /* -----------------------------------------
       File size check
       ----------------------------------------- */

    if (file.size <= 0) {
      setUploadMessage(
        'Selected file is empty.'
      );
      return;
    }

    /*
      25 MB safety limit.
      Your SSC PDFs can normally be much smaller.
    */

    const MAX_SIZE =
      25 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      setUploadMessage(
        'File is too large. Maximum allowed size is 25 MB.'
      );
      return;
    }

    /* -----------------------------------------
       Refresh session
       ----------------------------------------- */

    try {

      const {
        data: sessionData,
        error: sessionError
      } = await db.auth.getSession();

      if (sessionError) {
        console.error(
          'SESSION ERROR:',
          sessionError
        );

        setUploadMessage(
          sessionError.message
        );

        return;
      }

      if (!sessionData?.session) {

        setUploadMessage(
          'Your login session has expired. Please login again.'
        );

        return;
      }

      user =
        sessionData.session.user;

    } catch (error) {

      console.error(
        'SESSION CHECK ERROR:',
        error
      );

      setUploadMessage(
        'Could not verify login session.'
      );

      return;
    }

    /* -----------------------------------------
       Safe filename
       ----------------------------------------- */

    const originalName =
      file.name || 'document.pdf';

    const safeName =
      originalName
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_+/g, '_');

    /*
      Keep the file inside the logged-in user's folder.
    */

    const path =
      `${user.id}/${Date.now()}-${safeName}`;

    setUploadMessage(
      'Uploading PDF...'
    );

    /* -----------------------------------------
       Upload
       ----------------------------------------- */

    try {

      console.log(
        'UPLOAD START',
        {
          bucket: 'ssc-files',
          path,
          fileName: originalName,
          fileType: file.type,
          fileSize: file.size,
          userId: user.id
        }
      );

      const {
        data,
        error
      } = await db.storage
        .from('ssc-files')
        .upload(
          path,
          file,
          {
            cacheControl: '3600',
            upsert: false,
            contentType: 'application/pdf'
          }
        );

      console.log(
        'UPLOAD RESPONSE',
        {
          data,
          error
        }
      );

      if (error) {

        console.error(
          'SUPABASE STORAGE ERROR:',
          error
        );

        setUploadMessage(
          `Upload failed: ${error.message || 'Storage upload error'}`
        );

        return;
      }

      if (!data) {

        console.error(
          'UPLOAD RETURNED NO DATA'
        );

        setUploadMessage(
          'Upload failed: Supabase returned no upload data.'
        );

        return;
      }

      /* -----------------------------------------
         Save uploaded file info
         ----------------------------------------- */

      uploadedPath = path;

      uploadedSize =
        (file.size / 1024).toFixed(2) +
        ' KB';

      if ($('noticePath')) {
        $('noticePath').value =
          uploadedPath;
      }

      if ($('noticeSize')) {
        $('noticeSize').value =
          uploadedSize;
      }

      if ($('fileTitle')) {
        $('fileTitle').value =
          originalName;
      }

      setUploadMessage(
        'Upload successful. Now select category and publish.'
      );

      setStatus(
        'PDF uploaded successfully.'
      );

    } catch (error) {

      console.error(
        'UPLOAD FETCH/NETWORK ERROR:',
        error
      );

      /*
        "Failed to fetch" usually comes here.
        Show a useful message instead of only "Failed to fetch".
      */

      let message =
        error?.message ||
        String(error);

      if (
        message.toLowerCase().includes(
          'failed to fetch'
        )
      ) {

        message =
          'Upload failed: Failed to fetch Supabase Storage. Check SUPABASE_URL, bucket name "ssc-files", internet connection and Storage policies.';
      }

      setUploadMessage(
        message
      );
    }
  };
}

/* =========================================================
   PUBLISH NOTICE
   ========================================================= */

if ($('publish')) {

  $('publish').onclick = async () => {

    if (!db) {
      setStatus(
        'Supabase is not configured.'
      );
      return;
    }

    if (!user) {
      user = await getCurrentUser();
    }

    if (!user) {
      setStatus(
        'Please login again.'
      );
      return;
    }

    ensureCategoryField();

    const title =
      ($('noticeTitle')?.value || '')
      .trim();

    const category =
      $('noticeCategory')
        ? $('noticeCategory').value
        : 'OTHERS';

    const noticeDate =
      $('noticeDate')?.value || null;

    if (!title) {
      setStatus(
        'Enter notice title.'
      );
      return;
    }

    if (!category) {
      setStatus(
        'Select a result category.'
      );
      return;
    }

    const filePath =
      uploadedPath ||
      (($('noticePath')?.value || '').trim());

    if (!filePath) {
      setStatus(
        'Upload a PDF first.'
      );
      return;
    }

    const fileSize =
      ($('noticeSize')?.value || '').trim() ||
      uploadedSize ||
      '';

    const payload = {
      title,
      notice_date: noticeDate,
      category,
      file_path: filePath,
      file_size: fileSize
    };

    setStatus(
      'Publishing notice...'
    );

    try {

      const {
        data,
        error
      } = await db
        .from('ssc_notices')
        .insert(payload)
        .select()
        .single();

      if (error) {

        console.error(
          'NOTICE INSERT ERROR:',
          error
        );

        setStatus(
          error.message
        );

        return;
      }

      console.log(
        'NOTICE INSERTED:',
        data
      );

      setStatus(
        `Notice published successfully in ${category} category.`
      );

      /* -----------------------------------------
         Reset form
         ----------------------------------------- */

      if ($('noticeTitle')) {
        $('noticeTitle').value = '';
      }

      if ($('noticeDate')) {
        $('noticeDate').value = '';
      }

      if ($('noticePath')) {
        $('noticePath').value = '';
      }

      if ($('noticeSize')) {
        $('noticeSize').value = '';
      }

      if ($('fileTitle')) {
        $('fileTitle').value = '';
      }

      if ($('uploadMsg')) {
        $('uploadMsg').textContent = '';
      }

      if ($('file')) {
        $('file').value = '';
      }

      if ($('noticeCategory')) {
        $('noticeCategory').value = 'OTHERS';
      }

      uploadedPath = '';
      uploadedSize = '';

      await loadNotices();

    } catch (error) {

      console.error(
        'PUBLISH EXCEPTION:',
        error
      );

      setStatus(
        error?.message ||
        'Could not publish notice.'
      );
    }
  };
}

/* =========================================================
   REFRESH
   ========================================================= */

if ($('refresh')) {

  $('refresh').onclick = async () => {
    await loadNotices();
  };
}

/* =========================================================
   LOGOUT
   ========================================================= */

if ($('logout')) {

  $('logout').onclick = async () => {

    try {

      if (db) {
        await db.auth.signOut();
      }

    } catch (error) {

      console.error(
        'LOGOUT ERROR:',
        error
      );

    } finally {

      location.reload();

    }
  };
}

/* =========================================================
   LOAD NOTICES
   ========================================================= */

async function loadNotices() {

  if (!db) return;

  if (!$('noticeList')) return;

  const {
    data,
    error
  } = await db
    .from('ssc_notices')
    .select('*')
    .order(
      'created_at',
      {
        ascending: false
      }
    );

  if (error) {

    console.error(
      'LOAD NOTICES ERROR:',
      error
    );

    $('noticeList').innerHTML =
      `<div class="muted">
        ${escapeHtml(error.message)}
       </div>`;

    return;
  }

  $('noticeList').innerHTML =
    (data || []).map(n => {

      const url =
        n.file_path
          ? db.storage
              .from('ssc-files')
              .getPublicUrl(
                n.file_path
              )
              .data.publicUrl
          : '#';

      const category =
        n.category || 'OTHERS';

      return `
        <article>

          <div>

            <b>
              ${escapeHtml(n.title)}
            </b>

            <div class="muted">

              ${escapeHtml(
                n.notice_date || ''
              )}

              ·

              ${escapeHtml(
                category
              )}

              ·

              ${escapeHtml(
                n.file_size || ''
              )}

            </div>

          </div>

          ${
            n.file_path
              ? `
                <a
                  href="${escapeHtml(url)}"
                  target="_blank"
                  rel="noopener noreferrer">
                  PDF
                </a>
              `
              : ''
          }

          <button
            data-delete="${escapeHtml(n.id)}">
            Delete
          </button>

        </article>
      `;

    }).join('') ||
    '<div class="muted">No notices published.</div>';

  document
    .querySelectorAll('[data-delete]')
    .forEach(button => {

      button.onclick = () => {
        deleteNotice(
          button.dataset.delete
        );
      };

    });
}

/* =========================================================
   DELETE NOTICE
   ========================================================= */

async function deleteNotice(id) {

  if (!db) return;

  if (
    !confirm(
      'Delete this notice?'
    )
  ) {
    return;
  }

  try {

    const {
      data,
      error
    } = await db
      .from('ssc_notices')
      .select('file_path')
      .eq('id', id)
      .single();

    if (error) {

      setStatus(
        error.message
      );

      return;
    }

    const {
      error: deleteError
    } = await db
      .from('ssc_notices')
      .delete()
      .eq('id', id);

    if (deleteError) {

      setStatus(
        deleteError.message
      );

      return;
    }

    if (data?.file_path) {

      const {
        error: storageError
      } = await db.storage
        .from('ssc-files')
        .remove([
          data.file_path
        ]);

      if (storageError) {

        console.error(
          'STORAGE DELETE ERROR:',
          storageError
        );

      }
    }

    setStatus(
      'Notice deleted.'
    );

    await loadNotices();

  } catch (error) {

    console.error(
      'DELETE EXCEPTION:',
      error
    );

    setStatus(
      error?.message ||
      'Could not delete notice.'
    );
  }
}

/* =========================================================
   PAGE LOAD
   ========================================================= */

window.addEventListener(
  'DOMContentLoaded',
  async () => {

    ensureCategoryField();

    if (!db) return;

    const currentUser =
      await getCurrentUser();

    if (currentUser) {

      user = currentUser;

      if ($('auth')) {
        $('auth').hidden = true;
      }

      if ($('manager')) {
        $('manager').hidden = false;
      }

      ensureCategoryField();

      await loadNotices();
    }
  }
);
