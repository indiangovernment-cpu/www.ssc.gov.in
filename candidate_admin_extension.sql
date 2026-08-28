-- SSC Candidate/Admin extension
-- Run after candidate_setup.sql.
-- Adds storage metadata for candidate-specific Admit Cards and Answer Keys.

create table if not exists public.ssc_candidate_admit_cards (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null,
  exam_name text not null,
  post_name text,
  file_path text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.ssc_candidate_answer_keys (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null,
  exam_name text not null,
  post_name text,
  title text,
  file_path text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.ssc_candidate_admit_cards enable row level security;
alter table public.ssc_candidate_answer_keys enable row level security;

drop policy if exists "candidate reads own admit cards" on public.ssc_candidate_admit_cards;
create policy "candidate reads own admit cards"
on public.ssc_candidate_admit_cards for select
to authenticated
using (candidate_id = auth.uid());

drop policy if exists "candidate reads own answer keys" on public.ssc_candidate_answer_keys;
create policy "candidate reads own answer keys"
on public.ssc_candidate_answer_keys for select
to authenticated
using (candidate_id = auth.uid());
