const cfg = window.SSC_CONFIG || {};

const has =
  !!(
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
    character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character])
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
  } else {
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

ensureCategoryField();


/* =========================================================
   SUPABASE CHECK
========================================================= */

if (!has) {
  status(
    'Supabase is not configured. Check SSC_CONFIG.'
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

    const email = $('email').value.trim();
    const password = $('password').value;

    if (!email || !password) {
      status('Enter email and password.');
      return;
    }

    status('Logging in...');

    try {
      const { data, error } =
        await db.auth.signInWithPassword({
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

    } catch (error) {
      console.error('LOGIN ERROR:', error);

      status(
        'Login failed: ' +
        (error?.message || String(error))
      );
    }
  };
}


/* =========================================================
   FILE UPLOAD
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

    const fileInput = $('file');

    if (!fileInput) {
      status('File input not found.');
      return;
    }

    const file = fileInput.files[0];

    if (!file) {
      if ($('uploadMsg')) {
        $('uploadMsg').textContent =
          'Choose a file first.';
      }
      return;
    }


    /* -----------------------------------------
       FILE INFORMATION
    ----------------------------------------- */

    const originalName = file.name;

    const safeName = originalName
      .replace(/[^a-zA-Z0-9._-]/g, '_');

    const fileSizeKB =
      (file.size / 1024).toFixed(2) + ' KB';

    const path =
      `${user.id}/${Date.now()}-${safeName}`;


    /* -----------------------------------------
       SHOW UPLOADING STATUS
    ----------------------------------------- */

    if ($('uploadMsg')) {
      $('uploadMsg').textContent =
        'Uploading file...';
    }

    if ($('upload')) {
      $('upload').disabled = true;
    }


    try {

      console.log('Starting upload...');
      console.log('Bucket: ssc-files');
      console.log('Path:', path);
      console.log('File:', originalName);
      console.log('Size:', file.size);
      console.log('Type:', file.type);


      /* -----------------------------------------
         SUPABASE STORAGE UPLOAD
      ----------------------------------------- */

      const result = await db.storage
        .from('ssc-files')
        .upload(
          path,
          file,
          {
            cacheControl: '3600',
            upsert: false,
            contentType:
              file.type ||
              'application/octet-stream'
          }
        );


      console.log('UPLOAD RESULT:', result);


      if (result.error) {

        console.error(
          'SUPABASE STORAGE ERROR:',
          result.error
        );

        if ($('uploadMsg')) {
          $('uploadMsg').textContent =
            'Upload failed: ' +
            result.error.message;
        }

        status(
          'Upload failed: ' +
          result.error.message
        );

        return;
      }


      /* -----------------------------------------
         UPLOAD SUCCESS
      ----------------------------------------- */

      uploadedPath = path;
      uploadedSize = fileSizeKB;

      if ($('noticePath')) {
        $('noticePath').value = path;
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
          'File uploaded successfully. Now select the category and publish.';
      }

      status(
        'File uploaded successfully.'
      );

    } catch (error) {

      console.error(
        'UPLOAD FETCH/NETWORK ERROR:',
        error
      );

      let message =
        error?.message ||
        String(error);

      /*
       * "Failed to fetch" usually means the browser
       * could not reach the Storage API.
       */
      if (
        message.toLowerCase().includes(
          'failed to fetch'
        )
      ) {
        message =
          'Failed to fetch. Supabase Storage connection/bucket configuration check karo.';
      }

      if ($('uploadMsg')) {
        $('uploadMsg').textContent =
          message;
      }

      status(message);

    } finally {

      if ($('upload')) {
        $('upload').disabled = false;
      }
    }
  };
}


/* =========================================================
   PUBLISH NOTICE
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

    const title =
      $('noticeTitle')
        ?.value
        .trim() || '';

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


    const payload = {

      title,

      notice_date:
        $('noticeDate')?.value ||
        null,

      category,

      file_path:
        filePath,

      file_size:
        $('noticeSize')?.value.trim() ||
        uploadedSize ||
        ''
    };


    if ($('publish')) {
      $('publish').disabled = true;
    }

    status(
      'Publishing notice...'
    );


    try {

      const { error } =
        await db
          .from('ssc_notices')
          .insert(payload);


      if (error) {

        console.error(
          'PUBLISH ERROR:',
          error
        );

        status(
          'Publish failed: ' +
          error.message
        );

        return;
      }


      status(
        `Notice published successfully in ${category} category.`
      );


      /* -----------------------------------------
         CLEAR FORM
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
        'PUBLISH NETWORK ERROR:',
        error
      );

      status(
        'Publish failed: ' +
        (error?.message || String(error))
      );

    } finally {

      if ($('publish')) {
        $('publish').disabled = false;
      }
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

    }

    location.reload();
  };
}


/* =========================================================
   LOAD NOTICES
========================================================= */

async function loadNotices() {

  if (!db) return;

  const { data, error } =
    await db
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

    if ($('noticeList')) {

      $('noticeList').innerHTML =
        `<div class="muted">
          ${escapeHtml(error.message)}
        </div>`;
    }

    return;
  }


  if (!$('noticeList')) return;


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

                ${escapeHtml(
                  category
                )}

                ·

                ${escapeHtml(
                  notice.file_size || ''
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
    .querySelectorAll('[data-delete]')
    .forEach(button => {

      button.onclick = () =>
        deleteNotice(
          button.dataset.delete
        );

    });
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

    const { data, error } =
      await db
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


    if (data?.file_path) {

      const storageDelete =
        await db.storage
          .from('ssc-files')
          .remove([
            data.file_path
          ]);


      if (storageDelete.error) {

        console.error(
          'STORAGE DELETE ERROR:',
          storageDelete.error
        );
      }
    }


    status(
      'Notice deleted.'
    );


    await loadNotices();

  } catch (error) {

    console.error(
      'DELETE ERROR:',
      error
    );

    status(
      error?.message ||
      String(error)
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
