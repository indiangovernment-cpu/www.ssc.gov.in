const c = window.SSC_CONFIG || {};
const $ = id => document.getElementById(id);

let db = null;
let user = null;

/*
  IMPORTANT:
  lastUpload sirf ek uploaded file ko hold karta hai.
  Publish hone ke baad ise null kar diya jata hai,
  taaki wahi file galti se Notice + Result dono me
  publish na ho.
*/
let lastUpload = null;

/* =========================================================
   SUPABASE
========================================================= */

if (
  c.SUPABASE_URL &&
  c.SUPABASE_ANON_KEY &&
  window.supabase
) {

  db = window.supabase.createClient(
    c.SUPABASE_URL,
    c.SUPABASE_ANON_KEY
  );

  if ($("status")) {
    $("status").textContent =
      "Supabase configured. Login as your admin user.";
  }

} else {

  if ($("status")) {
    $("status").textContent =
      "Demo mode: add Supabase URL + publishable/anon key in config.js";
  }

  if ($("login")) {
    $("login").disabled = true;
  }
}

/* =========================================================
   LOGIN
========================================================= */

$("login").onclick = async () => {

  const email =
    $("email").value.trim();

  const password =
    $("password").value;

  if (!email || !password) {

    $("status").textContent =
      "Enter admin email and password.";

    return;
  }

  $("status").textContent =
    "Logging in...";

  const { data, error } =
    await db.auth.signInWithPassword({
      email,
      password
    });

  if (error) {

    $("status").textContent =
      error.message;

    return;
  }

  user = data.user;

  $("auth").hidden = true;
  $("manager").hidden = false;

  $("status").textContent =
    "Logged in. You can now upload files and publish.";

  await load();
  await loadResults();
};

/* =========================================================
   UPLOAD FILE
========================================================= */

$("upload").onclick = async () => {

  if (!db || !user) {

    $("uploadMsg").textContent =
      "Please login first.";

    return;
  }

  const f =
    $("file").files[0];

  const title =
    $("fileTitle").value.trim();

  if (!f) {

    $("uploadMsg").textContent =
      "Choose a file first.";

    return;
  }

  if (!title) {

    $("uploadMsg").textContent =
      "Enter a display title.";

    return;
  }

  $("uploadMsg").textContent =
    "Uploading...";

  const name =
    f.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

  /*
    Separate folder for every uploaded file.
    This makes storage paths predictable.
  */

  const path =
    `uploads/${user.id}/${Date.now()}-${name}`;

  const { error } =
    await db.storage
      .from("ssc-files")
      .upload(
        path,
        f,
        {
          upsert: false,
          contentType: f.type || "application/octet-stream"
        }
      );

  if (error) {

    $("uploadMsg").textContent =
      error.message;

    return;
  }

  lastUpload = {
    path: path,
    title: title,
    size: size(f.size)
  };

  /*
    Fill both forms for convenience,
    but publishing one will invalidate
    lastUpload.
  */

  if ($("noticeTitle")) {
    $("noticeTitle").value =
      title;
  }

  if ($("noticeSize")) {
    $("noticeSize").value =
      lastUpload.size;
  }

  if ($("noticePath")) {
    $("noticePath").value =
      path;
  }

  if ($("resultTitle")) {
    $("resultTitle").value =
      title;
  }

  if ($("resultSize")) {
    $("resultSize").value =
      lastUpload.size;
  }

  $("uploadMsg").textContent =
    "Uploaded successfully. Choose Publish Notice OR Publish Result.";
};

/* =========================================================
   PUBLISH NOTICE
========================================================= */

$("publish").onclick = async () => {

  if (!db || !user) {

    $("status").textContent =
      "Please login first.";

    return;
  }

  if (!lastUpload) {

    $("status").textContent =
      "Please upload a new file first.";

    return;
  }

  const title =
    $("noticeTitle").value.trim();

  if (!title) {

    $("status").textContent =
      "Enter a notice title.";

    return;
  }

  $("status").textContent =
    "Publishing notice...";

  const upload =
    lastUpload;

  const { error } =
    await db
      .from("ssc_notices")
      .insert({
        title: title,
        notice_date:
          $("noticeDate").value || null,
        file_path: upload.path,
        file_size:
          $("noticeSize").value ||
          upload.size
      });

  if (error) {

    console.error(
      "Notice publish error:",
      error
    );

    $("status").textContent =
      error.message;

    return;
  }

  /*
    IMPORTANT:
    File ab Notice ke naam se publish ho gayi.
    lastUpload null karne se same upload ko
    Result me accidentally publish nahi kar sakte.
  */

  lastUpload = null;

  $("status").textContent =
    "Notice published successfully.";

  clearNoticeForm();

  if ($("file")) {
    $("file").value = "";
  }

  if ($("fileTitle")) {
    $("fileTitle").value = "";
  }

  await load();
};

/* =========================================================
   PUBLISH RESULT
========================================================= */

$("publishResult").onclick = async () => {

  if (!db || !user) {

    $("resultMsg").textContent =
      "Please login first.";

    return;
  }

  if (!lastUpload) {

    $("resultMsg").textContent =
      "Upload a new result file first.";

    return;
  }

  const title =
    $("resultTitle").value.trim();

  const category =
    $("resultCategory").value;

  if (!title) {

    $("resultMsg").textContent =
      "Enter a result title.";

    return;
  }

  if (!category) {

    $("resultMsg").textContent =
      "Select a result category.";

    return;
  }

  $("resultMsg").textContent =
    "Publishing result...";

  const upload =
    lastUpload;

  const { error } =
    await db
      .from("ssc_results")
      .insert({
        category: category,
        title: title,
        result_date:
          $("resultDate").value || null,
        file_path: upload.path,
        file_size:
          $("resultSize").value ||
          upload.size
      });

  if (error) {

    console.error(
      "Result publish error:",
      error
    );

    if (
      error.message &&
      error.message.includes(
        "candidate_id"
      )
    ) {

      $("resultMsg").textContent =
        "Database error: candidate_id column is still NOT NULL. Supabase result table needs to be fixed.";

    } else {

      $("resultMsg").textContent =
        error.message;
    }

    return;
  }

  /*
    IMPORTANT:
    Result publish successful.
    Upload is consumed and cannot be
    published again accidentally.
  */

  lastUpload = null;

  $("resultMsg").textContent =
    "Result published successfully.";

  clearResultForm();

  if ($("file")) {
    $("file").value = "";
  }

  if ($("fileTitle")) {
    $("fileTitle").value = "";
  }

  await loadResults();
};

/* =========================================================
   REFRESH
========================================================= */

$("refresh").onclick = async () => {

  await load();
  await loadResults();
};

/* =========================================================
   CLEAR NOTICE
========================================================= */

function clearNoticeForm() {

  if ($("noticeTitle")) {
    $("noticeTitle").value = "";
  }

  if ($("noticeDate")) {
    $("noticeDate").value = "";
  }

  if ($("noticeSize")) {
    $("noticeSize").value = "";
  }

  if ($("noticePath")) {
    $("noticePath").value = "";
  }
}

/* =========================================================
   CLEAR RESULT
========================================================= */

function clearResultForm() {

  if ($("resultTitle")) {
    $("resultTitle").value = "";
  }

  if ($("resultDate")) {
    $("resultDate").value = "";
  }

  if ($("resultSize")) {
    $("resultSize").value = "";
  }

  if ($("resultMsg")) {
    $("resultMsg").textContent = "";
  }
}

/* =========================================================
   RESET
========================================================= */

function resetAll() {

  if ($("file")) {
    $("file").value = "";
  }

  if ($("fileTitle")) {
    $("fileTitle").value = "";
  }

  clearNoticeForm();
  clearResultForm();

  if ($("uploadMsg")) {
    $("uploadMsg").textContent = "";
  }

  lastUpload = null;
}

/* =========================================================
   SIZE
========================================================= */

function size(bytes) {

  const kb =
    bytes / 1024;

  return kb < 1024
    ? kb.toFixed(2) + " KB"
    : (kb / 1024).toFixed(2) + " MB";
}

/* =========================================================
   LOAD NOTICES
========================================================= */

async function load() {

  if (!db) return;

  const { data, error } =
    await db
      .from("ssc_notices")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {

    $("noticeList").textContent =
      error.message;

    return;
  }

  $("noticeList").innerHTML =
    (data || [])
      .map(n => `
        <article class="admin-file-row">

          <div class="file-info">

            <b>
              ${esc(n.title)}
            </b>

            <small>
              ${esc(n.notice_date || "")}
              ·
              ${esc(n.file_size || "")}
            </small>

            ${
              n.file_path
                ? `
                  <a
                    target="_blank"
                    rel="noopener"
                    href="${esc(
                      publicUrl(n.file_path)
                    )}">
                    Open / Download File
                  </a>
                `
                : ""
            }

          </div>

          <button
            type="button"
            class="deleteBtn"
            data-delete-notice="${esc(n.id)}"
            data-file-path="${esc(
              n.file_path || ""
            )}">
            Delete
          </button>

        </article>
      `)
      .join("")
    ||
    "<p>No notices yet.</p>";

  document
    .querySelectorAll(
      "[data-delete-notice]"
    )
    .forEach(button => {

      button.onclick = async () => {

        await deleteNotice(
          button.dataset.deleteNotice,
          button.dataset.filePath
        );
      };
    });
}

/* =========================================================
   LOAD RESULTS
========================================================= */

async function loadResults() {

  if (!db) return;

  const { data, error } =
    await db
      .from("ssc_results")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

  if (error) {

    $("resultList").textContent =
      "Unable to load results: " +
      error.message;

    console.error(error);

    return;
  }

  $("resultList").innerHTML =
    (data || [])
      .map(r => `
        <article class="admin-file-row">

          <div class="file-info">

            <b>
              ${esc(r.category)}
              —
              ${esc(r.title)}
            </b>

            <small>
              ${esc(r.result_date || "")}
              ·
              ${esc(r.file_size || "")}
            </small>

            ${
              r.file_path
                ? `
                  <a
                    target="_blank"
                    rel="noopener"
                    href="${esc(
                      publicUrl(r.file_path)
                    )}">
                    Open Result File
                  </a>
                `
                : ""
            }

          </div>

          <button
            type="button"
            class="deleteBtn"
            data-delete-result="${esc(r.id)}"
            data-file-path="${esc(
              r.file_path || ""
            )}">
            Delete
          </button>

        </article>
      `)
      .join("")
    ||
    "<p>No results yet.</p>";

  document
    .querySelectorAll(
      "[data-delete-result]"
    )
    .forEach(button => {

      button.onclick = async () => {

        await deleteResult(
          button.dataset.deleteResult,
          button.dataset.filePath
        );
      };
    });
}

/* =========================================================
   DELETE NOTICE
========================================================= */

async function deleteNotice(
  id,
  filePath
) {

  const ok =
    confirm(
      "Are you sure you want to delete this Notice and its file?"
    );

  if (!ok) return;

  $("status").textContent =
    "Deleting notice...";

  const { error } =
    await db
      .from("ssc_notices")
      .delete()
      .eq("id", id);

  if (error) {

    $("status").textContent =
      "Delete failed: " +
      error.message;

    return;
  }

  await deleteStorageFileIfUnused(
    filePath
  );

  $("status").textContent =
    "Notice deleted successfully.";

  await load();
  await loadResults();
}

/* =========================================================
   DELETE RESULT
========================================================= */

async function deleteResult(
  id,
  filePath
) {

  const ok =
    confirm(
      "Are you sure you want to delete this Result and its file?"
    );

  if (!ok) return;

  $("resultMsg").textContent =
    "Deleting result...";

  const { error } =
    await db
      .from("ssc_results")
      .delete()
      .eq("id", id);

  if (error) {

    $("resultMsg").textContent =
      "Delete failed: " +
      error.message;

    return;
  }

  await deleteStorageFileIfUnused(
    filePath
  );

  $("resultMsg").textContent =
    "Result deleted successfully.";

  await loadResults();
  await load();
}

/* =========================================================
   SAFE STORAGE DELETE
========================================================= */

async function deleteStorageFileIfUnused(
  filePath
) {

  if (!filePath) return;

  try {

    const {
      data: notices,
      error: noticeError
    } = await db
      .from("ssc_notices")
      .select("id")
      .eq("file_path", filePath)
      .limit(1);

    const {
      data: results,
      error: resultError
    } = await db
      .from("ssc_results")
      .select("id")
      .eq("file_path", filePath)
      .limit(1);

    if (noticeError) {
      console.error(
        "Notice file check error:",
        noticeError
      );
    }

    if (resultError) {
      console.error(
        "Result file check error:",
        resultError
      );
    }

    const noticeStillUsesFile =
      notices &&
      notices.length > 0;

    const resultStillUsesFile =
      results &&
      results.length > 0;

    if (
      noticeStillUsesFile ||
      resultStillUsesFile
    ) {
      return;
    }

    const { error } =
      await db.storage
        .from("ssc-files")
        .remove([
          filePath
        ]);

    if (error) {

      console.error(
        "Storage delete error:",
        error
      );
    }

  } catch (error) {

    console.error(
      "Storage cleanup error:",
      error
    );
  }
}

/* =========================================================
   PUBLIC URL
========================================================= */

function publicUrl(path) {

  if (!db || !path) {
    return "#";
  }

  return db.storage
    .from("ssc-files")
    .getPublicUrl(path)
    .data.publicUrl;
}

/* =========================================================
   ESC
========================================================= */

function esc(v) {

  return String(v ?? "")
    .replace(
      /[&<>"']/g,
      m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[m])
    );
}
