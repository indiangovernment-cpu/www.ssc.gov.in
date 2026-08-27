-- SSC Candidate Portal - repair/setup migration
-- Safe to run in Supabase SQL Editor.
-- Uses only the publishable/anon browser key; never expose service_role in the website.

-- ---------------------------------------------------------
-- Data API privileges
-- ---------------------------------------------------------
grant select, insert, update on table public.ssc_candidates to authenticated;
grant select, insert, update, delete on table public.ssc_applications to authenticated;
grant select, insert, update, delete on table public.ssc_candidate_documents to authenticated;
grant select on table public.ssc_candidate_messages to authenticated;
grant select on table public.ssc_results to authenticated;
grant select on table public.ssc_admins to authenticated;

-- ---------------------------------------------------------
-- RLS
-- ---------------------------------------------------------
alter table public.ssc_candidates enable row level security;
alter table public.ssc_applications enable row level security;
alter table public.ssc_candidate_documents enable row level security;
alter table public.ssc_candidate_messages enable row level security;
alter table public.ssc_results enable row level security;
alter table public.ssc_admins enable row level security;

-- Remove only policies owned by this portal setup, then recreate them.
do $$
declare r record;
begin
  for r in
    select policyname, tablename
    from pg_policies
    where schemaname='public'
      and tablename in ('ssc_candidates','ssc_applications','ssc_candidate_documents','ssc_candidate_messages','ssc_results','ssc_admins')
      and policyname like 'ssc_portal_%'
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- Admin can see their own admin row. This also lets admin checks work under RLS.
create policy ssc_portal_admin_self
on public.ssc_admins for select
to authenticated
using ((select auth.uid()) = user_id);

-- Candidates: own profile.
create policy ssc_portal_candidate_select
on public.ssc_candidates for select
to authenticated
using ((select auth.uid()) = user_id);

create policy ssc_portal_candidate_insert
on public.ssc_candidates for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy ssc_portal_candidate_update
on public.ssc_candidates for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Applications: candidate owns candidate_id.
create policy ssc_portal_application_select
on public.ssc_applications for select
to authenticated
using ((select auth.uid()) = candidate_id);

create policy ssc_portal_application_insert
on public.ssc_applications for insert
to authenticated
with check ((select auth.uid()) = candidate_id);

create policy ssc_portal_application_update
on public.ssc_applications for update
to authenticated
using ((select auth.uid()) = candidate_id)
with check ((select auth.uid()) = candidate_id);

create policy ssc_portal_application_delete
on public.ssc_applications for delete
to authenticated
using ((select auth.uid()) = candidate_id);

-- Documents: candidate owns candidate_id.
create policy ssc_portal_document_select
on public.ssc_candidate_documents for select
to authenticated
using ((select auth.uid()) = candidate_id);

create policy ssc_portal_document_insert
on public.ssc_candidate_documents for insert
to authenticated
with check ((select auth.uid()) = candidate_id);

create policy ssc_portal_document_delete
on public.ssc_candidate_documents for delete
to authenticated
using ((select auth.uid()) = candidate_id);

-- Messages/results: candidate can only see their own published records.
create policy ssc_portal_message_select
on public.ssc_candidate_messages for select
to authenticated
using ((select auth.uid()) = candidate_id and published = true);

create policy ssc_portal_result_select
on public.ssc_results for select
to authenticated
using ((select auth.uid()) = candidate_id and published = true);

-- Helpful indexes.
create index if not exists ssc_candidates_user_id_idx on public.ssc_candidates(user_id);
create index if not exists ssc_applications_candidate_id_idx on public.ssc_applications(candidate_id);
create index if not exists ssc_candidate_documents_candidate_id_idx on public.ssc_candidate_documents(candidate_id);
create index if not exists ssc_candidate_messages_candidate_id_idx on public.ssc_candidate_messages(candidate_id);
create index if not exists ssc_results_candidate_id_idx on public.ssc_results(candidate_id);

-- ---------------------------------------------------------
-- Private candidate document bucket
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('ssc-candidate-files', 'ssc-candidate-files', false)
on conflict (id) do update set public=false;

-- Remove only this portal's storage policies.
do $$
declare r record;
begin
  for r in
    select policyname
    from pg_policies
    where schemaname='storage'
      and tablename='objects'
      and policyname like 'ssc_portal_candidate_%'
  loop
    execute format('drop policy if exists %I on storage.objects', r.policyname);
  end loop;
end $$;

create policy ssc_portal_candidate_upload
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'ssc-candidate-files'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy ssc_portal_candidate_read
on storage.objects for select
to authenticated
using (
  bucket_id = 'ssc-candidate-files'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy ssc_portal_candidate_delete_file
on storage.objects for delete
to authenticated
using (
  bucket_id = 'ssc-candidate-files'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- Existing public SSC files bucket remains separate.
