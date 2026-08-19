-- Run in Supabase SQL Editor.
create table if not exists public.ssc_files (id uuid primary key default gen_random_uuid(),title text not null,storage_path text not null,created_at timestamptz not null default now());
create table if not exists public.ssc_notices (id uuid primary key default gen_random_uuid(),title text not null,notice_date date,file_path text,file_size text,created_at timestamptz not null default now());
alter table public.ssc_files enable row level security;
alter table public.ssc_notices enable row level security;
create policy "public read files" on public.ssc_files for select using (true);
create policy "public read notices" on public.ssc_notices for select using (true);
create policy "authenticated manage files" on public.ssc_files for all to authenticated using (true) with check (true);
create policy "authenticated manage notices" on public.ssc_notices for all to authenticated using (true) with check (true);
insert into storage.buckets (id,name,public) values ('ssc-files','ssc-files',true) on conflict (id) do nothing;
create policy "public read ssc files" on storage.objects for select using (bucket_id='ssc-files');
create policy "authenticated upload ssc files" on storage.objects for insert to authenticated with check (bucket_id='ssc-files');
create policy "authenticated update ssc files" on storage.objects for update to authenticated using (bucket_id='ssc-files') with check (bucket_id='ssc-files');
create policy "authenticated delete ssc files" on storage.objects for delete to authenticated using (bucket_id='ssc-files');
-- Then create your admin account in Supabase Authentication > Users.


drop policy if exists "Authenticated admins can update notices" on public.ssc_notices;
create policy "Authenticated admins can update notices" on public.ssc_notices for update to authenticated using(true) with check(true);
drop policy if exists "Authenticated admins can delete notices" on public.ssc_notices;
create policy "Authenticated admins can delete notices" on public.ssc_notices for delete to authenticated using(true);
