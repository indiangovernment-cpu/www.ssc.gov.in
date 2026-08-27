const c = window.SSC_CONFIG || {};
const $ = id => document.getElementById(id);

let db = null;
let user = null;
let last = null;

if (
  c.SUPABASE_URL &&
  c.SUPABASE_ANON_KEY &&
  window.supabase
) {
  db = supabase.createClient(
    c.SUPABASE_URL,
    c.SUPABASE_ANON_KEY
  );

  $("status").textContent =
    "Supabase configured. Login as your admin user.";
} else {
  $("status").textContent =
    "Demo mode: add Supabase URL + publishable/anon key in config.js";

  $("login").disabled = true;
}


/* =========================
   LOGIN
========================= */

$("login").onclick = async () => {
  const email = $("email").value.trim();
  const password = $("password").value;

  if (!email || !password) {
    $("status").textContent =
      "Enter admin email and password.";
    return;
  }

  $("status").textContent = "Logging in...";

  const { data, error } =
    await db.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    $("status").textContent = error.message;
    return;
  }

  user = data.user;

  $("auth").hidden = true;
  $("manager").hidden = false;

  $("status").textContent =
    "Logged in. You can now upload files and publish.";

  load();
  loadResults();
};


/* =========================
   UPLOAD FILE
========================= */

$("upload").onclick = async () => {
  if (!db || !user) {
    $("uploadMsg").textContent =
      "Please login first.";
    return;
  }

  const f = $("file").files[0];
  const title = $("fileTitle").value.trim();

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

  $("uploadMsg").textContent = "Uploading...";

  const name = f.name.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );

  const path =
    `${user.id}/${Date.now()}-${name}`;

  const { error } = await db.storage
    .from("ssc-files")
    .upload(path, f, {
      upsert: false
    });

  if (error) {
    $("uploadMsg").textContent =
      error.message;
    return;
  }

  last = {
    path: path,
    title: title,
    size: size(f.size)
  };

  $("noticeTitle").value =
    $("noticeTitle").value || title;

  $("noticeSize").value =
    $("noticeSize").value || last.size;

  $("noticePath").value = path;

  $("resultTitle").value =
    $("resultTitle").value || title;

  $("resultSize").value =
    $("resultSize").value || last.size;

  $("uploadMsg").textContent =
    "Uploaded successfully. Now publish it as Notice or Result.";
};


/* =========================
   PUBLISH NOTICE
========================= */

$("publish").onclick = async () => {
  if (!last) {
    $("status").textContent =
      "Please upload a file first.";
    return;
  }

  const title =
    $("noticeTitle").value.trim();

  if (!title) {
    $("status").textContent =
      "Enter a notice title.";
    return;
  }

  const { error } = await db
    .from("ssc_notices")
    .insert({
      title: title,
      notice_date:
        $("noticeDate").value || null,
      file_path: last.path,
      file_size:
        $("noticeSize").value || last.size
    });

  if (error) {
    $("status").textContent = error.message;
    return;
  }

  $("status").textContent =
    "Notice published successfully.";

  clearNoticeForm();

  load();
};


/* =========================
   PUBLISH RESULT
========================= */

$("publishResult").onclick = async () => {
  if (!last) {
    $("resultMsg").textContent =
      "Upload a file first using Upload File above.";
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

  $("resultMsg").textContent =
    "Publishing result...";

  const { error } = await db
    .from("ssc_results")
    .insert({
      category: category,
      title: title,
      result_date:
        $("resultDate").value || null,
      file_path: last.path,
      file_size:
        $("resultSize").value || last.size
    });

  if (error) {
    console.error("Result publish error:", error);

    if (
      error.message &&
      error.message.includes("candidate_id")
    ) {
      $("resultMsg").textContent =
        "Database error: candidate_id column is still NOT NULL. The Supabase table must be fixed first.";
    } else {
      $("resultMsg").textContent =
        error.message;
    }

    return;
  }

  $("resultMsg").textContent =
    "Result published successfully.";

  clearResultForm();

  loadResults();
};


/* =========================
   REFRESH
========================= */

$("refresh").onclick = () => {
  load();
  loadResults();
};


/* =========================
   CLEAR FORMS
========================= */

function clearNoticeForm() {
  $("noticeTitle").value = "";
  $("noticeDate").value = "";
  $("noticeSize").value = "";
  $("noticePath").value = "";

  /*
    File is intentionally NOT deleted here.
    Same uploaded file can still be used
    for publishing a Result.
  */
}


function clearResultForm() {
  $("resultTitle").value = "";
  $("resultDate").value = "";
  $("resultSize").value = "";
  $("resultMsg").textContent = "";
}


/* =========================
   COMPLETE RESET
========================= */

function resetAll() {
  $("file").value = "";
  $("fileTitle").value = "";

  clearNoticeForm();
  clearResultForm();

  $("uploadMsg").textContent = "";

  last = null;
}


/* =========================
   FILE SIZE
========================= */

function size(bytes) {
  let kb = bytes / 1024;

  return kb < 1024
    ? kb.toFixed(2) + " KB"
    : (kb / 1024).toFixed(2) + " MB";
}


/* =========================
   LOAD NOTICES
========================= */

async function load() {
  if (!db) return;

  const { data, error } = await db
    .from("ssc_notices")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) {
    $("noticeList").textContent =
      error.message;
    return;
  }

  $("noticeList").innerHTML =
    (data || []).map(n => `
      <article class="admin-file-row">
        <div class="file-info">
          <b>${esc(n.title)}</b>

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
                  href="${esc(publicUrl(n.file_path))}"
                >
                  Open / Download File
                </a>
              `
              : ""
          }
        </div>

        <button
          class="deleteBtn"
          data-delete-notice="${esc(n.id)}"
          data-file-path="${esc(n.file_path || "")}"
        >
          Delete
        </button>
      </article>
    `).join("")
    || "<p>No notices yet.</p>";

  document
    .querySelectorAll("[data-delete-notice]")
    .forEach(button => {
      button.onclick = async () => {
        await deleteNotice(
          button.dataset.deleteNotice,
          button.dataset.filePath
        );
      };
    });
}


/* =========================
   LOAD RESULTS
========================= */

async function loadResults() {
  if (!db) return;

  const { data, error } = await db
    .from("ssc_results")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) {
    $("resultList").textContent =
      "Run the updated Supabase SQL once, then refresh.";

    console.error(error);
    return;
  }

  $("resultList").innerHTML =
    (data || []).map(r => `
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
                  href="${esc(publicUrl(r.file_path))}"
                >
                  Open Result File
                </a>
              `
              : ""
          }
        </div>

        <button
          class="deleteBtn"
          data-delete-result="${esc(r.id)}"
          data-file-path="${esc(r.file_path || "")}"
        >
          Delete
        </button>
      </article>
    `).join("")
    || "<p>No results yet.</p>";

  document
    .querySelectorAll("[data-delete-result]")
    .forEach(button => {
      button.onclick = async () => {
        await deleteResult(
          button.dataset.deleteResult,
          button.dataset.filePath
        );
      };
    });
}


/* =========================
   DELETE NOTICE
========================= */

async function deleteNotice(id, filePath) {
  const ok = confirm(
    "Are you sure you want to delete this Notice and its file?"
  );

  if (!ok) return;

  $("status").textContent =
    "Deleting notice...";

  const { error } = await db
    .from("ssc_notices")
    .delete()
    .eq("id", id);

  if (error) {
    $("status").textContent =
      "Delete failed: " + error.message;

    return;
  }

  await deleteStorageFileIfUnused(
    filePath
  );

  $("status").textContent =
    "Notice deleted successfully.";

  load();
  loadResults();
}


/* =========================
   DELETE RESULT
========================= */

async function deleteResult(id, filePath) {
  const ok = confirm(
    "Are you sure you want to delete this Result and its file?"
  );

  if (!ok) return;

  $("resultMsg").textContent =
    "Deleting result...";

  const { error } = await db
    .from("ssc_results")
    .delete()
    .eq("id", id);

  if (error) {
    $("resultMsg").textContent =
      "Delete failed: " + error.message;

    return;
  }

  await deleteStorageFileIfUnused(
    filePath
  );

  $("resultMsg").textContent =
    "Result deleted successfully.";

  loadResults();
  load();
}


/* =========================
   SAFE STORAGE DELETE

   File tab delete hone ke baad
   Notice aur Result dono check karega.
   Agar same file kahin aur use ho rahi hai
   to Storage se delete nahi karega.
========================= */

async function deleteStorageFileIfUnused(filePath) {
  if (!filePath) return;

  try {
    const { data: notices } = await db
      .from("ssc_notices")
      .select("id")
      .eq("file_path", filePath)
      .limit(1);

    const { data: results } = await db
      .from("ssc_results")
      .select("id")
      .eq("file_path", filePath)
      .limit(1);

    const noticeStillUsesFile =
      notices && notices.length > 0;

    const resultStillUsesFile =
      results && results.length > 0;

    if (
      noticeStillUsesFile ||
      resultStillUsesFile
    ) {
      return;
    }

    const { error } = await db.storage
      .from("ssc-files")
      .remove([filePath]);

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


/* =========================
   PUBLIC FILE URL
========================= */

function publicUrl(path) {
  return db.storage
    .from("ssc-files")
    .getPublicUrl(path)
    .data.publicUrl;
}


/* =========================
   HTML SAFETY
========================= */

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
