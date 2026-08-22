const cfg = window.SSC_CONFIG || {};

const has = !!(
  cfg.SUPABASE_URL &&
  cfg.SUPABASE_ANON_KEY &&
  window.supabase
);

const db = has
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

function status(message) {
  if ($('status')) {
    $('status').textContent = message;
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

  select.innerHTML = CATEGORIES
    .map(
      category =>
        `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`
    )
    .join('');

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
   INITIAL CONFIG
   ========================================================= */

ensureCategoryField();

if (!has) {
  status(
    'Supabase configuration is missing. Check config.js and make sure Supabase is loaded before admin.js.'
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
      status('Supabase is not configured.');
      return;
    }

    const email = $('email')
      ? $('email').value.trim()
      : '';

    const password = $('password')
      ? $('password').value
      : '';

    if (!email || !password) {
      status('Enter email and password.');
      return;
    }

    status('Checking Supabase configuration…');

    const {
      data,
      error
    } = await db.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      status(error.message);
      return;
    }

    user = data.user;

    if ($('auth')) {
      $('auth').hidden = true;
    }

    if ($('manager')) {
      $('manager').hidden = false;
    }

    ensureCategoryField();

    status(
      'Logged in. Upload a PDF/file, select its category, then publish it.'
    );

    await loadNotices();
  };
}

/* =========================================================
   RESTORE EXISTING SESSION
   ========================================================= */

async function restoreSession() {
  if (!db) return;

  try {
    const {
      data,
      error
    } = await db.auth.getSession();

    if (error) {
      console.error('Session error:', error);
      return;
    }

    if (data && data.session && data.session.user) {
      user = data.session.user;

      if ($('auth')) {
        $('auth').hidden = true;
      }

      if ($('manager')) {
        $('manager').hidden = false;
      }

      ensureCategoryField();

      status(
        'Logged in. Upload a PDF/file, select its category, then publish it.'
      );

      await loadNotices();
    }
  } catch (error) {
    console.error('Session restore error:', error);
  }
}

restoreSession();

/* =========================================================
   UPLOAD FILE
   ========================================================= */

if ($('upload')) {
  $('upload').onclick = async () => {
    if (!db) {
      if ($('uploadMsg')) {
        $('uploadMsg').textContent =
          'Supabase is not configured.';
      }
      return;
    }

    if (!user) {
      if ($('uploadMsg')) {
        $('uploadMsg').textContent =
          'Please login first.';
      }
      return;
    }

    const file = $('file')
      ? $('file').files[0]
      : null;

    if (!file) {
      if ($('uploadMsg')) {
        $('uploadMsg').textContent =
          'Choose a file first.';
      }
      return;
    }

    if ($('uploadMsg')) {
      $('uploadMsg').textContent =
        'Uploading file...';
    }

    const safe = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      '_'
    );

    const path =
      `${user.id}/${Date.now()}-${safe}`;

    try {
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
            contentType:
              file.type || 'application/pdf'
          }
        );

      if (error) {
        console.error(
          'Upload error:',
          error
        );

        if ($('uploadMsg')) {
          $('uploadMsg').textContent =
            'Upload failed: ' + error.message;
        }

        return;
      }

      console.log(
        'Upload successful:',
        data
      );

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
          file.name;
      }

      if ($('uploadMsg')) {
        $('uploadMsg').textContent =
          'Uploaded successfully. Select the result category and publish it.';
      }

      status(
        'File uploaded successfully.'
      );

    } catch (error) {
      console.error(
        'Upload exception:',
        error
      );

      if ($('uploadMsg')) {
        $('uploadMsg').textContent =
          'Upload failed: ' +
          (error.message || error);
      }
    }
  };
}

/* =========================================================
   PUBLISH NOTICE / RESULT
   ========================================================= */

if ($('publish')) {
  $('publish').onclick = async () => {
    if (!db) {
      status(
        'Supabase is not configured.'
      );
      return;
    }

    if (!user) {
      status(
        'Please login first.'
      );
      return;
    }

    ensureCategoryField();

    const title = $('noticeTitle')
      ? $('noticeTitle').value.trim()
      : '';

    const category =
      $('noticeCategory')
        ? $('noticeCategory').value
        : 'OTHERS';

    if (!title) {
      status(
        'Enter notice title.'
      );
      return;
    }

    if (!category) {
      status(
        'Select a result category.'
      );
      return;
    }

    const filePath =
      uploadedPath ||
      ($('noticePath')
        ? $('noticePath').value.trim()
        : '');

    if (!filePath) {
      status(
        'Upload a file first.'
      );
      return;
    }

    const payload = {
      title: title,

      notice_date:
        $('noticeDate') &&
        $('noticeDate').value
          ? $('noticeDate').value
          : null,

      category: category,

      file_path: filePath,

      file_size:
        $('noticeSize') &&
        $('noticeSize').value.trim()
          ? $('noticeSize').value.trim()
          : uploadedSize || ''
    };

    status(
      'Publishing notice...'
    );

    try {
      const {
        error
      } = await db
        .from('ssc_notices')
        .insert(payload);

      if (error) {
        console.error(
          'Publish error:',
          error
        );

        status(
          error.message
        );

        return;
      }

      status(
        `Notice published successfully in ${category} category.`
      );

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

      if ($('uploadMsg')) {
        $('uploadMsg').textContent = '';
      }

      if ($('file')) {
        $('file').value = '';
      }

      if ($('fileTitle')) {
        $('fileTitle').value = '';
      }

      if ($('noticeCategory')) {
        $('noticeCategory').value =
          'OTHERS';
      }

      uploadedPath = '';
      uploadedSize = '';

      await loadNotices();

    } catch (error) {
      console.error(
        'Publish exception:',
        error
      );

      status(
        error.message ||
        'Unable to publish notice.'
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
        'Logout error:',
        error
      );
    }

    location.reload();
  };
}

/* =========================================================
   LOAD NOTICES
   ========================================================= */

async function loadNotices() {
  if (!db) return;

  if (!$('noticeList')) return;

  $('noticeList').innerHTML =
    '<div class="muted">Loading notices...</div>';

  try {
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
        'Load notices error:',
        error
      );

      $('noticeList').innerHTML =
        `<div class="muted">${escapeHtml(error.message)}</div>`;

      return;
    }

    $('noticeList').innerHTML =
      (data || [])
        .map(notice => {

          const url =
            notice.file_path
              ? db.storage
                  .from('ssc-files')
                  .getPublicUrl(
                    notice.file_path
                  )
                  .data.publicUrl
              : '#';

          const category =
            notice.category ||
            'OTHERS';

          return `
            <article>

              <div>
                <b>
                  ${escapeHtml(notice.title)}
                </b>

                <div class="muted">
                  ${escapeHtml(
                    notice.notice_date || ''
                  )}
                  ·
                  ${escapeHtml(category)}
                  ·
                  ${escapeHtml(
                    notice.file_size || ''
                  )}
                </div>
              </div>

              ${
                notice.file_path
                  ? `
                    <a
                      href="${escapeHtml(url)}"
                      target="_blank"
                      rel="noopener"
                    >
                      PDF
                    </a>
                  `
                  : ''
              }

              <button
                data-delete="${escapeHtml(
                  notice.id
                )}"
              >
                Delete
              </button>

            </article>
          `;

        })
        .join('') ||
      '<div class="muted">No notices published.</div>';

    document
      .querySelectorAll(
        '[data-delete]'
      )
      .forEach(button => {

        button.onclick = () => {
          deleteNotice(
            button.dataset.delete
          );
        };

      });

  } catch (error) {

    console.error(
      'Load notices exception:',
      error
    );

    $('noticeList').innerHTML =
      `<div class="muted">${escapeHtml(
        error.message ||
        'Unable to load notices.'
      )}</div>`;
  }
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
      status(
        error.message
      );
      return;
    }

    const del =
      await db
        .from('ssc_notices')
        .delete()
        .eq('id', id);

    if (del.error) {
      status(
        del.error.message
      );
      return;
    }

    if (data && data.file_path) {

      const {
        error: storageError
      } = await db.storage
        .from('ssc-files')
        .remove([
          data.file_path
        ]);

      if (storageError) {
        console.error(
          'Storage delete error:',
          storageError
        );
      }
    }

    status(
      'Notice deleted.'
    );

    await loadNotices();

  } catch (error) {

    console.error(
      'Delete exception:',
      error
    );

    status(
      error.message ||
      'Unable to delete notice.'
    );
  }
}

/* =========================================================
   DOM READY
   ========================================================= */

window.addEventListener(
  'DOMContentLoaded',
  () => {
    ensureCategoryField();
  }
);
