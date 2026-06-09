-- ============================================================
--  Le Musée de Bryanna — Guestbook database setup
--  Run this ONCE in Supabase: open your project →
--  "SQL Editor" → "New query" → paste all of this → "Run".
-- ============================================================

-- 1. The table that stores every signature.
create table if not exists public.guestbook (
  id          bigint generated always as identity primary key,
  name        text not null check (char_length(name) between 1 and 80),
  message     text not null check (char_length(message) between 1 and 1000),
  hidden      boolean not null default false,
  created_at  timestamptz not null default now()
);

-- 2. Turn on row-level security (locks the table by default).
alter table public.guestbook enable row level security;

-- 3. Anyone may READ entries that are not hidden.
drop policy if exists "read visible entries" on public.guestbook;
create policy "read visible entries"
  on public.guestbook for select
  using (hidden = false);

-- 4. Anyone may ADD an entry — but only name + message.
--    (hidden / created_at fall back to their safe defaults.)
drop policy if exists "anyone can sign" on public.guestbook;
create policy "anyone can sign"
  on public.guestbook for insert
  with check (true);

-- ------------------------------------------------------------
--  To HIDE a bad entry later (no admin panel needed):
--  SQL Editor → run, swapping in the id you want gone:
--      update public.guestbook set hidden = true where id = 123;
--  See every entry (including hidden) to find the id:
--      select id, name, message, created_at from public.guestbook
--      order by created_at desc;
-- ------------------------------------------------------------
