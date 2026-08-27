(() => {
  'use strict';

  const cfg = window.SSC_CONFIG || {};
  const db = (cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase)
    ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
        auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
      })
    : null;

  const $ = id => document.getElementById(id);
  let currentUser = null;
  let currentCandidate = null;
  let busy = false;

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  function setMsg(text, ok = false) {
    const el = $('authMsg');
    if (el) {
      el.textContent = text || '';
      el.style.color = ok ? '#27865b' : '#9a4448';
    }
  }

  function setBusy(form, value, label) {
    busy = value;
    if (!form) return;
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      if (value) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = label || 'Please wait…';
      } else if (btn.dataset.originalText) {
        btn.textContent = btn.dataset.originalText;
      }
      btn.disabled = value;
    }
  }

  function toast(text) {
    const el = $('toast');
    if (!el) return;
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(window.__sscToast);
    window.__sscToast = setTimeout(() => el.classList.remove('show'), 2800);
  }

  function registrationNo() {
    return 'SSC' + new Date().getFullYear() + Date.now().toString().slice(-8);
  }

  async function getSession() {
    if (!db) return null;
    const r = await db.auth.getSession();
    if (r.error) throw r.error;
    return r.data?.session || null;
  }

  function switchAuth(type, clear = true) {
    document.querySelectorAll('[data-auth]').forEach(b => {
      b.classList.toggle('active', b.dataset.auth === type);
    });
    if ($('loginForm')) $('loginForm').hidden = type !== 'login';
    if ($('signupForm')) $('signupForm').hidden = type !== 'signup';
    if (clear) setMsg('');
    if (type === 'signup') $('signupName')?.focus();
    else $('loginEmail')?.focus();
  }

  async function ensureCandidate() {
    if (!db || !currentUser) return null;

    const found = await db.from('ssc_candidates')
      .select('*')
      .eq('user_id', currentUser.id)
      .maybeSingle();

    if (found.error) throw found.error;
    if (found.data) {
      currentCandidate = found.data;
      return currentCandidate;
    }

    const name = $('signupName')?.value.trim() || currentUser.user_metadata?.full_name || 'Candidate';
    const phone = $('signupPhone')?.value.trim() || null;

    const payload = {
      user_id: currentUser.id,
      registration_no: registrationNo(),
      full_name: name,
      email: currentUser.email || '',
      phone,
      status: 'Active'
    };

    const ins = await db.from('ssc_candidates').insert(payload).select().single();
    if (ins.error) throw ins.error;
    currentCandidate = ins.data;
    return currentCandidate;
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (busy) return;
    if (!db) return setMsg('Supabase configuration is missing.');

    const email = $('loginEmail')?.value.trim() || '';
    const password = $('loginPassword')?.value || '';
    if (!email || !password) return setMsg('Enter your email and password.');

    setBusy(e.currentTarget, true, 'Signing in…');
    setMsg('Signing in…', true);

    try {
      const r = await db.auth.signInWithPassword({ email, password });
      if (r.error) throw r.error;
      currentUser = r.data?.user || null;
      if (!currentUser) throw new Error('Login succeeded, but no user session was returned.');
      await ensureCandidate();
      await openPortal();
    } catch (err) {
      console.error(err);
      const text = err?.message || String(err);
      setMsg(text.includes('Invalid login credentials')
        ? 'Email or password is incorrect.'
        : text);
    } finally {
      setBusy(e.currentTarget, false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (busy) return;
    if (!db) return setMsg('Supabase configuration is missing.');

    const form = e.currentTarget;
    const name = $('signupName')?.value.trim() || '';
    const email = $('signupEmail')?.value.trim() || '';
    const phone = $('signupPhone')?.value.trim() || '';
    const password = $('signupPassword')?.value || '';

    if (!name) return setMsg('Enter your full name.');
    if (!email) return setMsg('Enter your email address.');
    if (password.length < 6) return setMsg('Password must be at least 6 characters.');

    setBusy(form, true, 'Creating account…');
    setMsg('Creating your candidate account…', true);

    try {
      const redirect = new URL('candidate.html', location.href).href;
      const r = await db.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, phone },
          emailRedirectTo: redirect
        }
      });

      if (r.error) throw r.error;

      // Supabase may require email confirmation. In that case there is no session yet,
      // so the candidate row is intentionally created after the first authenticated login.
      if (!r.data?.session) {
        switchAuth('login', false);
        if ($('loginEmail')) $('loginEmail').value = email;
        setMsg('Account created successfully. Check your email, confirm the account, then login here.', true);
        return;
      }

      currentUser = r.data.user;
      await ensureCandidate();
      await openPortal();
    } catch (err) {
      console.error(err);
      const text = err?.message || String(err);
      if (/already registered|already exists/i.test(text)) {
        switchAuth('login', false);
        if ($('loginEmail')) $('loginEmail').value = email;
        setMsg('This email is already registered. Please login instead.');
      } else {
        setMsg(text);
      }
    } finally {
      setBusy(form, false);
    }
  }

  async function forgotPassword() {
    if (!db) return setMsg('Supabase configuration is missing.');
    const email = prompt('Enter your registered email address');
    if (!email?.trim()) return;
    try {
      const redirect = new URL('candidate.html?mode=login', location.href).href;
      const r = await db.auth.resetPasswordForEmail(email.trim(), { redirectTo: redirect });
      if (r.error) throw r.error;
      setMsg('Password reset email sent. Check your inbox.', true);
    } catch (err) {
      setMsg(err?.message || String(err));
    }
  }

  async function openPortal() {
    if (!currentCandidate) await ensureCandidate();
    if (!currentCandidate) throw new Error('Candidate profile could not be created.');

    $('authCard').hidden = true;
    $('portal').hidden = false;
    $('welcome').textContent = 'Welcome, ' + (currentCandidate.full_name || 'Candidate');
    $('regLine').textContent = 'Registration No: ' + (currentCandidate.registration_no || '—');
    fillProfile();

    await Promise.allSettled([loadApplications(), loadResults(), loadDocuments(), loadMessages()]);
  }

  function fillProfile() {
    const c = currentCandidate || {};
    [['pReg',c.registration_no],['pRoll',c.roll_no],['pName',c.full_name],['pEmail',c.email],['pPhone',c.phone],['pDob',c.dob],['pFather',c.father_name],['pMother',c.mother_name],['pCategory',c.category],['pAddress',c.address],['pCity',c.city],['pState',c.state],['pPincode',c.pincode]].forEach(([id,v]) => {
      const el = $(id); if (el) el.value = v || '';
    });
    if ($('profileStatus')) $('profileStatus').textContent = c.status || '';
  }

  async function saveProfile(e) {
    e.preventDefault();
    if (!currentUser || !db) return toast('Please login again.');
    const p = {
      roll_no:$('pRoll').value.trim()||null,
      full_name:$('pName').value.trim(),
      phone:$('pPhone').value.trim()||null,
      dob:$('pDob').value||null,
      father_name:$('pFather').value.trim()||null,
      mother_name:$('pMother').value.trim()||null,
      category:$('pCategory').value||null,
      address:$('pAddress').value.trim()||null,
      city:$('pCity').value.trim()||null,
      state:$('pState').value.trim()||null,
      pincode:$('pPincode').value.trim()||null,
      updated_at:new Date().toISOString()
    };
    const r = await db.from('ssc_candidates').update(p).eq('user_id', currentUser.id);
    if (r.error) return toast(r.error.message);
    currentCandidate = {...currentCandidate,...p};
    $('welcome').textContent = 'Welcome, ' + currentCandidate.full_name;
    toast('Profile saved');
  }

  async function loadApplications() {
    const el = $('applicationList'); if (!el || !currentUser) return;
    const r = await db.from('ssc_applications').select('*').eq('candidate_id', currentUser.id).order('created_at',{ascending:false});
    if (r.error) return el.innerHTML = '<div class="item">'+esc(r.error.message)+'</div>';
    const a = r.data || [];
    el.innerHTML = a.map(n => {
      const f = n.form_data || {};
      return `<article class="item"><div class="itemhead"><div><h3>${esc(n.exam_name)}</h3><div class="meta">Application: ${esc(n.application_no||'—')} · Post: ${esc(n.post_name||'—')}</div></div><span class="pill">${esc(n.status)}</span></div><div class="meta">Qualification: ${esc(f.qualification||'—')} · Year: ${esc(f.year||'—')} · Centre: ${esc(f.centre||'—')}</div><button class="outline editapp" data-id="${esc(n.id)}" style="margin-top:9px">Edit</button></article>`;
    }).join('') || '<div class="item">No applications yet. Click “New Application” to start.</div>';
    document.querySelectorAll('.editapp').forEach(b => b.onclick = () => editApplication(a.find(x => x.id === b.dataset.id)));
  }

  function editApplication(n) {
    if (!n) return;
    const f = n.form_data || {};
    $('aId').value=n.id;$('aExam').value=n.exam_name||'';$('aPost').value=n.post_name||'';$('aNo').value=n.application_no||'';
    $('aQualification').value=f.qualification||'';$('aYear').value=f.year||'';$('aBoard').value=f.board||'';$('aPercentage').value=f.percentage||'';$('aCentre').value=f.centre||'';$('aAdditional').value=f.additional||'';
    $('applicationForm').hidden=false;
  }

  async function saveApplication(e) {
    e.preventDefault();
    const form_data={qualification:$('aQualification').value.trim(),year:$('aYear').value.trim(),board:$('aBoard').value.trim(),percentage:$('aPercentage').value.trim(),centre:$('aCentre').value.trim(),additional:$('aAdditional').value.trim()};
    const id=$('aId').value;
    const payload={application_no:$('aNo').value.trim()||null,exam_name:$('aExam').value.trim(),post_name:$('aPost').value.trim()||null,status:'draft',form_data,updated_at:new Date().toISOString()};
    const r=id ? await db.from('ssc_applications').update(payload).eq('id',id).eq('candidate_id',currentUser.id) : await db.from('ssc_applications').insert({...payload,candidate_id:currentUser.id});
    if (r.error) return toast(r.error.message);
    $('applicationForm').hidden=true; toast('Application saved'); await loadApplications();
  }

  async function loadResults() {
    const el=$('resultList'); if(!el||!currentUser)return;
    const r=await db.from('ssc_results').select('*').eq('candidate_id',currentUser.id).eq('published',true).order('result_date',{ascending:false});
    if(r.error)return el.innerHTML='<div class="item">'+esc(r.error.message)+'</div>';
    const a=r.data||[];
    el.innerHTML=a.map((n,i)=>`<article class="item"><div class="itemhead"><div><h3>${esc(n.exam_name)}</h3><div class="meta">${esc(n.result_date||'')}</div></div><span class="pill">${esc(n.selection_status||'Published')}</span></div><div class="meta">Post: ${esc(n.post_name||'—')} · Marks: ${esc(n.marks??'—')}/${esc(n.max_marks??'—')} · Rank: ${esc(n.rank||'—')} · Percentile: ${esc(n.percentile??'—')}</div><p>${esc(n.remarks||'')}</p>${n.file_path?`<p><a href="#" data-result-pdf="${esc(n.file_path)}">Open Result PDF</a></p>`:''}</article>`).join('')||'<div class="item">No published result is available.</div>';
    document.querySelectorAll('[data-result-pdf]').forEach(a=>a.onclick=async e=>{e.preventDefault();const x=await db.storage.from('ssc-result-files').createSignedUrl(a.dataset.resultPdf,300);if(x.error)return toast(x.error.message);window.open(x.data.signedUrl,'_blank','noopener');});
  }

  async function loadDocuments() {
    const el=$('documentList'); if(!el||!currentUser)return;
    const r=await db.from('ssc_candidate_documents').select('*').eq('candidate_id',currentUser.id).order('created_at',{ascending:false});
    if(r.error)return el.innerHTML='<div class="item">'+esc(r.error.message)+'</div>';
    const a=r.data||[];
    el.innerHTML=a.map(n=>`<article class="item"><div class="itemhead"><div><h3>${esc(n.title||n.document_type)}</h3><div class="meta">${esc(n.document_type)} · ${n.verified?'Verified':'Pending verification'}</div></div><span class="pill">${n.verified?'Verified':'Pending'}</span></div><a href="#" data-doc="${esc(n.file_path)}">Open document</a></article>`).join('')||'<div class="item">No documents uploaded.</div>';
    document.querySelectorAll('[data-doc]').forEach(a=>a.onclick=async e=>{e.preventDefault();const x=await db.storage.from('ssc-candidate-files').createSignedUrl(a.dataset.doc,300);if(x.error)return toast(x.error.message);window.open(x.data.signedUrl,'_blank','noopener');});
  }

  async function uploadDocument(e) {
    e.preventDefault();
    const file=$('docFile')?.files?.[0]; if(!file||!currentUser)return toast('Choose a document first.');
    const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
    const path=`${currentUser.id}/${Date.now()}-${safe}`;
    $('docMsg').textContent='Uploading…';
    try {
      const up=await db.storage.from('ssc-candidate-files').upload(path,await file.arrayBuffer(),{contentType:file.type||'application/octet-stream',upsert:false});
      if(up.error)throw up.error;
      const ins=await db.from('ssc_candidate_documents').insert({candidate_id:currentUser.id,document_type:$('docType').value,title:$('docTitle').value.trim()||file.name,file_path:path,verified:false});
      if(ins.error){await db.storage.from('ssc-candidate-files').remove([path]);throw ins.error;}
      $('docMsg').textContent='Upload successful.';$('docFile').value='';$('docTitle').value='';await loadDocuments();
    } catch(err) { $('docMsg').textContent=err?.message||String(err); }
  }

  async function loadMessages() {
    const el=$('messageList'); if(!el||!currentUser)return;
    const r=await db.from('ssc_candidate_messages').select('*').eq('candidate_id',currentUser.id).eq('published',true).order('created_at',{ascending:false});
    if(r.error)return el.innerHTML='<div class="item">'+esc(r.error.message)+'</div>';
    const a=r.data||[];
    el.innerHTML=a.map(n=>`<article class="item"><h3>${esc(n.title)}</h3><div class="meta">${esc(new Date(n.created_at).toLocaleString())}</div><p>${esc(n.body||'')}</p>${n.attachment_path?`<a href="#" data-msgfile="${esc(n.attachment_path)}">Open attachment</a>`:''}</article>`).join('')||'<div class="item">No messages.</div>';
  }

  async function logout() { try { await db?.auth.signOut(); } finally { location.reload(); } }

  function bind() {
    document.querySelectorAll('[data-auth]').forEach(b => b.addEventListener('click', () => switchAuth(b.dataset.auth)));
    $('loginForm')?.addEventListener('submit', handleLogin);
    $('signupForm')?.addEventListener('submit', handleSignup);
    $('forgotBtn')?.addEventListener('click', forgotPassword);
    $('logout')?.addEventListener('click', logout);
    $('profileForm')?.addEventListener('submit', saveProfile);

    document.querySelectorAll('.sidebtn').forEach(b=>b.addEventListener('click',()=>{
      document.querySelectorAll('.sidebtn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      document.querySelectorAll('.view').forEach(v=>v.hidden=true);
      $(b.dataset.section).hidden=false;
    }));

    $('newApplication')?.addEventListener('click',()=>{
      $('applicationForm').hidden=false;
      ['aId','aExam','aPost','aNo','aQualification','aYear','aBoard','aPercentage','aCentre','aAdditional'].forEach(id=>{if($(id))$(id).value='';});
    });
    $('cancelApplication')?.addEventListener('click',()=>{$('applicationForm').hidden=true;});
    $('applicationForm')?.addEventListener('submit',saveApplication);
    $('docForm')?.addEventListener('submit',uploadDocument);

    document.addEventListener('click',async e=>{
      const a=e.target.closest('[data-msgfile]'); if(!a)return;
      e.preventDefault(); const x=await db.storage.from('ssc-candidate-files').createSignedUrl(a.dataset.msgfile,300); if(x.error)return toast(x.error.message); window.open(x.data.signedUrl,'_blank','noopener');
    });

    const mode = new URLSearchParams(location.search).get('mode');
    if (mode === 'signup' || mode === 'register') switchAuth('signup', false);
    else switchAuth('login', false);
  }

  window.addEventListener('DOMContentLoaded', async () => {
    bind();
    if (!db) return setMsg('Supabase configuration is missing.');
    try {
      const s = await getSession();
      if (s?.user) {
        currentUser=s.user;
        await ensureCandidate();
        await openPortal();
      }
    } catch(err) {
      console.error(err);
      setMsg(err?.message || String(err));
    }
  });
})();
