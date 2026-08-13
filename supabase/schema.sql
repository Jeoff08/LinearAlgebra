-- Run this in the Supabase SQL editor so online sync has matching tables.

create table if not exists public.notes (
  id text primary key,
  title text not null default '',
  content text not null default '',
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz
);

create table if not exists public.documents (
  id text primary key,
  name text not null default '',
  file_path text,
  meta_json text not null default '{}',
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz
);

alter table public.notes enable row level security;
alter table public.documents enable row level security;

-- Dev-friendly policies (tighten for production auth)
create policy "Allow all notes" on public.notes for all using (true) with check (true);
create policy "Allow all documents" on public.documents for all using (true) with check (true);
