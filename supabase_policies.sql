-- Run in Supabase SQL Editor AFTER creating the ssc_notices table and ssc-files bucket.
-- These policies allow authenticated admin users to publish notices and upload to the bucket.
alter table public.ssc_notices enable row level security;
drop policy if exists "authenticated can insert notices" on public.ssc_notices;
drop policy if exists "public can read notices" on public.ssc_notices;
create policy "public can read notices" on public.ssc_notices for select using (true);
create policy "authenticated can insert notices" on public.ssc_notices for insert to authenticated with check (auth.uid() is not null);

-- Storage policies for the ssc-files bucket.
drop policy if exists "authenticated upload ssc files" on storage.objects;
drop policy if exists "public read ssc files" on storage.objects;
create policy "authenticated upload ssc files" on storage.objects for insert to authenticated with check (bucket_id = 'ssc-files');
create policy "public read ssc files" on storage.objects for select using (bucket_id = 'ssc-files');
