const cfg = window.SSC_CONFIG || {};

const hasSupabase =
!!(
cfg.SUPABASE_URL &&
cfg.SUPABASE_ANON_KEY &&
window.supabase
);

let client = null;
let user = null;

const $ = id => document.getElementById(id);
const status = $('status');

if (hasSupabase) {

client = supabase.createClient(
cfg.SUPABASE_URL,
cfg.SUPABASE_ANON_KEY
);

status.textContent =
'Supabase configured. Login as your admin user.';

} else {

$('authPanel').querySelector('button').disabled = true;

status.textContent =
'Demo mode: add Supabase URL + publishable/anon key in config.js.';

}

/* ================================
ADMIN LOGIN
================================ */

$('login').onclick = async () => {

if (!client) return;

const email = $('email').value.trim();
const password = $('password').value;

if (!email || !password) {

status.textContent =
  'Enter admin email and password.';

return;

}

status.textContent = 'Logging in...';

const { data, error } =
await client.auth.signInWithPassword({
email,
password
});

if (error) {

status.textContent = error.message;

return;

}

user = data.user;

openManager();

await loadNotices();

};

/* ================================
OPEN MANAGER
================================ */

function openManager() {

$('authPanel').hidden = true;
$('manager').hidden = false;
$('contentPanel').hidden = false;

status.textContent =
'Logged in. You can now upload files and publish notices.';
}

/* ================================
UPLOAD FILE
================================ */

$('upload').onclick = async () => {

if (!client || !user) {

$('uploadMsg').textContent =
  'Please login first.';

return;

}

const file = $('file').files[0];

const displayTitle =
$('title').value.trim();

if (!file) {

$('uploadMsg').textContent =
  'Choose a file first.';

return;

}

if (!displayTitle) {

$('uploadMsg').textContent =
  'Enter a display title.';

return;

}

$('uploadMsg').textContent =
'Uploading...';

const safeName =
file.name.replace(
/[^a-zA-Z0-9.-]/g,
''
);

const path =
"${user.id}/${Date.now()}-${safeName}";

const { error: uploadError } =
await client
.storage
.from('ssc-files')
.upload(
path,
file,
{
upsert: false
}
);

if (uploadError) {

$('uploadMsg').textContent =
  uploadError.message;

return;

}

const { data: publicData } =
client
.storage
.from('ssc-files')
.getPublicUrl(path);

const publicUrl =
publicData.publicUrl;

/*
Save the latest uploaded file
information temporarily so that
Save Notice can attach this file.
*/

window.SSC_LAST_UPLOAD = {
path: path,
url: publicUrl,
title: displayTitle,
size: formatFileSize(file.size)
};

/*
Automatically put the detected
file size into the Notice field
if the field is empty.
*/

if (!$('noticeSize').value.trim()) {

$('noticeSize').value =
  formatFileSize(file.size);

}

/*
Automatically use Display Title
as Notice Title if empty.
*/

if (!$('noticeTitle').value.trim()) {

$('noticeTitle').value =
  displayTitle;

}

$('uploadMsg').textContent =
'Uploaded successfully. File is ready to publish as a Notice.';

};

/* ================================
FILE SIZE
================================ */

function formatFileSize(bytes) {

if (!bytes) return '0 KB';

const kb = bytes / 1024;

if (kb < 1024) {

return kb.toFixed(2) + ' KB';

}

return (
kb / 1024
).toFixed(2) + ' MB';

}

/* ================================
SAVE NOTICE
================================ */

$('saveNotice').onclick = async () => {

if (!client || !user) {

status.textContent =
  'Please login first.';

return;

}

const noticeTitle =
$('noticeTitle').value.trim();

const noticeDate =
$('noticeDate').value;

const noticeSize =
$('noticeSize').value.trim();

const uploaded =
window.SSC_LAST_UPLOAD;

if (!noticeTitle) {

status.textContent =
  'Enter a notice title.';

return;

}

if (!uploaded) {

status.textContent =
  'Please upload a file first.';

return;

}

status.textContent =
'Publishing notice...';

const { error } =
await client
.from('ssc_notices')
.insert({

    title: noticeTitle,

    notice_date:
      noticeDate || null,

    file_path:
      uploaded.url,

    file_size:
      noticeSize ||
      uploaded.size

  });

if (error) {

status.textContent =
  error.message;

return;

}

status.textContent =
'Notice published successfully.';

/*
Clear form
*/

$('file').value = '';
$('title').value = '';
$('noticeTitle').value = '';
$('noticeDate').value = '';
$('noticeSize').value = '';

$('uploadMsg').textContent =
'';

/*
Clear last uploaded reference
*/

window.SSC_LAST_UPLOAD = null;

await loadNotices();

};

/* ================================
LOAD PUBLISHED NOTICES
================================ */

async function loadNotices() {

if (!client) return;

const {
data,
error
} = await client
.from('ssc_notices')
.select('*')
.order(
'created_at',
{
ascending: false
}
);

if (error) {

$('noticeList').innerHTML =
  `
  <div class="muted">
    ${escapeHtml(error.message)}
  </div>
  `;

return;

}

if (!data || data.length === 0) {

$('noticeList').innerHTML =
  `
  <div class="muted">
    No notices yet.
  </div>
  `;

return;

}

$('noticeList').innerHTML =
data.map(n => `

  <div class="notice">

    <b>
      ${escapeHtml(n.title || 'Untitled Notice')}
    </b>

    <div class="muted">

      ${escapeHtml(n.notice_date || '')}

      ·

      ${escapeHtml(n.file_size || '')}

    </div>

    ${
      n.file_path
      ?
      `
      <div style="margin-top:8px">

        <a
          href="${escapeHtml(n.file_path)}"
          target="_blank"
          rel="noopener"
        >
          Open PDF
        </a>

      </div>
      `
      :
      ''
    }

  </div>

`).join('');

}

/* ================================
ESCAPE HTML
================================ */

function escapeHtml(value) {

return String(value || '')
.replace(
/[&<>"']/g,
m => ({
'&': '&',
'<': '<',
'>': '>',
'"': '"',
"'": '''
}[m])
);

}
