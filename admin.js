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
    .map(category => `
      <option value="${escapeHtml(category)}">
        ${escapeHtml(category)}
      </option>
    `)
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
   CONFIG CHECK
   ========================================================= */

if (!hasSupabase) {

  status(
    'Supabase configuration is missing.'
  );

  if ($('login')) {
    $('login').disabled = true;
  }
}


/* =========================================================
   RESTORE EXISTING SESSION
   ========================================================= */

async function restoreSession() {

  if (!db) return;

  try {

    const result =
      await db.auth.getSession();

    if (result.error) {
      console.error(
        'Session restore error:',
        result.error
      );
      return;
    }

    const session =
      result.data?.session;

    if (session?.user) {

      user = session.user;

      if ($('auth')) {
        $('auth').hidden = true;
      }

      if ($('manager')) {
        $('manager').hidden = false;
      }

      ensureCategoryField();

      status(
        'Logged in. Select a PDF, upload it, choose its result category, then publish it.'
      );

      await loadNotices();
    }

  } catch (error) {

    console.error(
      'Session restore exception:',
      error
    );
  }
}


/* =========================================================
   LOGIN
   ========================================================= */

if ($('login')) {

  $('login').onclick = async () => {

    if (!db) {

      status(
        'Supabase is not configured.'
      );

      return;
    }

    const email =
      $('email')?.value.trim() || '';

    const password =
      $('password')?.value || '';

    if (!email || !password) {

      status(
        'Enter email and password.'
      );

      return;
    }

    status(
      'Checking Supabase configuration…'
    );

    try {

      const result =
        await db.auth.signInWithPassword({
          email,
          password
        });

      if (result.error) {

        status(
          result.error.message
        );

        return;
      }

      user =
        result.data?.user || null;

      if (!user) {

        status(
          'Login succeeded but user session was not found.'
        );

        return;
      }

      if ($('auth')) {
        $('auth').hidden = true;
      }

      if ($('manager')) {
        $('manager').hidden = false;
      }

      ensureCategoryField();

      status(
        'Logged in. Select a PDF, upload it, choose its result category, then publish it.'
      );

      await loadNotices();

    } catch (error) {

      console.error(
        'Login error:',
        error
      );

      status(
        'Login failed: ' +
        (
          error?.message ||
          String(error)
        )
      );
    }
  };
}


/* =========================================================
   UPLOAD
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


    /* -----------------------------------------------------
       Get current session
       ----------------------------------------------------- */

    try {

      const sessionResult =
        await db.auth.getSession();

      if (sessionResult.error) {

        if ($('uploadMsg')) {
          $('uploadMsg').textContent =
            sessionResult.error.message;
        }

        return;
      }

      user =
        sessionResult.data?.session?.user ||
        user;

    } catch (error) {

      console.error(
        'Session error:',
        error
      );
    }


    if (!user) {

      if ($('uploadMsg')) {
        $('uploadMsg').textContent =
          'Please login first.';
      }

      return;
    }


    /* -----------------------------------------------------
       Get selected file
       ----------------------------------------------------- */

    const input = $('file');

    const file =
      input?.files?.[0];

    if (!file) {

      if ($('uploadMsg')) {
        $('uploadMsg').textContent =
          'Choose a PDF file first.';
      }

      return;
    }


    /* -----------------------------------------------------
       File information
       ----------------------------------------------------- */

    const originalName =
      file.name ||
      'document.pdf';

    const safeName =
      originalName
        .replace(
          /[^a-zA-Z0-9._-]/g,
          '_'
        );

    const extension =
      safeName
        .split('.')
        .pop()
        .toLowerCase();

    const contentType =
      file.type ||
      (
        extension === 'pdf'
          ? 'application/pdf'
          : 'application/octet-stream'
      );

    const fileSize =
      Number(file.size || 0);

    const readableSize =
      (fileSize / 1024).toFixed(2) +
      ' KB';


    /* -----------------------------------------------------
       Create storage path
       ----------------------------------------------------- */

    const path =
      `${user.id}/${Date.now()}-${safeName}`;


    if ($('uploadMsg')) {
      $('uploadMsg').textContent =
        'Reading file…';
    }


    console.log(
      'SSC upload file:',
      {
        name: originalName,
        type: contentType,
        size: fileSize,
        path
      }
    );


    try {

      /* ---------------------------------------------------
         IMPORTANT MOBILE FIX

         Read the selected File first.
         This avoids some mobile browser/file-picker
         problems where direct File upload can fail.
         --------------------------------------------------- */

      if (
        typeof file.arrayBuffer !== 'function'
      ) {

        throw new Error(
          'This browser cannot read the selected file.'
        );
      }

      const buffer =
        await file.arrayBuffer();


      if (!buffer || !buffer.byteLength) {

        throw new Error(
          'The selected file could not be read.'
        );
      }


      if ($('uploadMsg')) {
        $('uploadMsg').textContent =
          'Uploading… please wait.';
      }


      console.log(
        'SSC upload started:',
        {
          bucket: 'ssc-files',
          path,
          bytes: buffer.byteLength,
          type: contentType,
          user: user.id
        }
      );


      /* ---------------------------------------------------
         Upload ArrayBuffer instead of File
         --------------------------------------------------- */

      const result =
        await db.storage
          .from('ssc-files')
          .upload(
            path,
            buffer,
            {
              cacheControl: '3600',
              contentType: contentType,
              upsert: false
            }
          );


      console.log(
        'SSC upload response:',
        result
      );


      if (result.error) {

        console.error(
          'Supabase Storage error:',
          result.error
        );

        if ($('uploadMsg')) {
          $('uploadMsg').textContent =
            'Upload failed: ' +
            (
              result.error.message ||
              'Storage upload error'
            );
        }

        return;
      }


      /* ---------------------------------------------------
         SUCCESS
         --------------------------------------------------- */

      uploadedPath =
        path;

      uploadedSize =
        readableSize;


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


      if ($('uploadMsg')) {
        $('uploadMsg').textContent =
          'Upload successful. Now select the result category and click Publish.';
      }

      status(
        'PDF uploaded successfully.'
      );


    } catch (error) {

      console.error(
        'SSC upload exception:',
        error
      );

      let message =
        error?.message ||
        String(error) ||
        'Unknown upload error';


      if (
        message
          .toLowerCase()
          .includes('failed to fetch')
      ) {

        message =
          'Failed to fetch. The mobile browser could not complete the Storage request. Check internet connection and HTTPS.';
      }


      if ($('uploadMsg')) {
        $('uploadMsg').textContent =
          'Upload failed: ' +
          message;
      }

      status(
        'Upload failed.'
      );
    }
  };
}


/* =========================================================
   PUBLISH
   ========================================================= */

if ($('publish')) {

  $('publish').onclick = async () => {

    if (!db) {

      status(
        'Supabase is not configured.'
      );

      return;
    }


    try {

      const sessionResult =
        await db.auth.getSession();

      user =
        sessionResult.data?.session?.user ||
        user;

    } catch (error) {

      console.error(
        'Session check failed:',
        error
      );
    }


    if (!user) {

      status(
        'Please login first.'
      );

      return;
    }


    ensureCategoryField();


    const title =
      $('noticeTitle')?.value.trim() ||
      '';

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
      ($('noticePath')?.value || '');


    if (!filePath) {

      status(
        'Upload a file first.'
      );

      return;
    }


    const fileSize =
      $('noticeSize')?.value.trim() ||
      uploadedSize ||
      '';


    const noticeDate =
      $('noticeDate')?.value ||
      null;


    const payload = {

      title,

      notice_date:
        noticeDate,

      category,

      file_path:
        filePath,

      file_size:
        fileSize
    };


    status(
      'Publishing notice…'
    );


    try {

      const result =
        await db
          .from('ssc_notices')
          .insert(payload);


      if (result.error) {

        console.error(
          'Publish error:',
          result.error
        );

        status(
          result.error.message
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
        'Publish failed: ' +
        (
          error?.message ||
          String(error)
        )
      );
    }
  };
}


/* =========================================================
   REFRESH
   ========================================================= */

if ($('refresh')) {

  $('refresh').onclick =
    loadNotices;
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


  try {

    const result =
      await db
        .from('ssc_notices')
        .select('*')
        .order(
          'created_at',
          {
            ascending: false
          }
        );


    if (result.error) {

      console.error(
        'Load notices error:',
        result.error
      );

      $('noticeList').innerHTML =
        `<div class="muted">
          ${escapeHtml(result.error.message)}
        </div>`;

      return;
    }


    const data =
      result.data || [];


    $('noticeList').innerHTML =
      data
        .map(n => {

          const url =
            n.file_path
              ? db.storage
                  .from('ssc-files')
                  .getPublicUrl(
                    n.file_path
                  )
                  .data
                  .publicUrl
              : '#';


          const category =
            n.category ||
            'OTHERS';


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


              <a
                href="${escapeHtml(url)}"
                target="_blank"
                rel="noopener"
              >
                PDF
              </a>


              <button
                data-delete="${escapeHtml(n.id)}"
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
      `<div class="muted">
        ${escapeHtml(
          error?.message ||
          String(error)
        )}
      </div>`;
  }
}


/* =========================================================
   DELETE NOTICE
   ========================================================= */

async function deleteNotice(id) {

  if (
    !db ||
    !confirm(
      'Delete this notice?'
    )
  ) {
    return;
  }


  try {

    const result =
      await db
        .from('ssc_notices')
        .select('file_path')
        .eq('id', id)
        .single();


    if (result.error) {

      status(
        result.error.message
      );

      return;
    }


    const filePath =
      result.data?.file_path ||
      '';


    const deleted =
      await db
        .from('ssc_notices')
        .delete()
        .eq('id', id);


    if (deleted.error) {

      status(
        deleted.error.message
      );

      return;
    }


    if (filePath) {

      const storageResult =
        await db.storage
          .from('ssc-files')
          .remove([
            filePath
          ]);


      if (storageResult.error) {

        console.warn(
          'Storage file could not be removed:',
          storageResult.error
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
      'Delete failed: ' +
      (
        error?.message ||
        String(error)
      )
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

    await restoreSession();

  }
);
