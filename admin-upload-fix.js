/* Robust Supabase Storage uploader for SSC Admin */
(() => {
  const BUCKET = "ssc-files";
  const projectUrl = (window.SSC_CONFIG || {}).SUPABASE_URL || "";
  const apiKey = (window.SSC_CONFIG || {}).SUPABASE_ANON_KEY || "";

  function setMsg(text) {
    const el = document.getElementById("uploadMsg");
    if (el) el.textContent = text;
  }

  function fillAfterUpload(path, title, file) {
    lastUpload = { path, title, size: size(file.size) };
    if ($("noticeTitle")) $("noticeTitle").value = title;
    if ($("noticeSize")) $("noticeSize").value = lastUpload.size;
    if ($("noticePath")) $("noticePath").value = path;
    if ($("resultTitle")) $("resultTitle").value = title;
    if ($("resultSize")) $("resultSize").value = lastUpload.size;
    setMsg("Uploaded successfully. Choose Publish Notice OR Publish Result.");
  }

  async function getAccessToken() {
    const { data, error } = await db.auth.getSession();
    if (error) throw error;
    if (!data.session || !data.session.access_token) {
      throw new Error("Admin session expired. Please login again.");
    }
    return data.session.access_token;
  }

  async function tusUpload(file, path) {
    if (!window.tus) throw new Error("Resumable upload library failed to load. Please refresh the page.");
    const token = await getAccessToken();
    const projectRef = new URL(projectUrl).hostname.split(".")[0];
    const endpoint = `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`;

    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint,
        retryDelays: [0, 2000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${token}`,
          apikey: apiKey,
          "x-upsert": "false"
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        chunkSize: 6 * 1024 * 1024,
        metadata: {
          bucketName: BUCKET,
          objectName: path,
          contentType: file.type || "application/octet-stream",
          cacheControl: "3600"
        },
        onError: reject,
        onProgress: (uploaded, total) => {
          const pct = total ? Math.round((uploaded / total) * 100) : 0;
          setMsg(`Uploading... ${pct}%`);
        },
        onSuccess: () => resolve()
      });
      upload.start();
    });
  }

  const uploadButton = $("upload");
  if (!uploadButton) return;

  uploadButton.onclick = async () => {
    if (!db || !user) {
      setMsg("Please login first.");
      return;
    }

    const fileInput = $("file");
    const titleInput = $("fileTitle");
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;
    const title = titleInput ? titleInput.value.trim() : "";

    if (!file) {
      setMsg("Choose a file first.");
      return;
    }
    if (!title) {
      setMsg("Enter a display title.");
      return;
    }

    uploadButton.disabled = true;
    setMsg("Preparing upload...");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `uploads/${user.id}/${Date.now()}-${safeName}`;

    try {
      await tusUpload(file, path);
      fillAfterUpload(path, title, file);
    } catch (tusError) {
      console.error("Resumable upload failed:", tusError);
      setMsg(`Upload failed: ${tusError && tusError.message ? tusError.message : "Network error. Please try again."}`);
    } finally {
      uploadButton.disabled = false;
    }
  };
})();
