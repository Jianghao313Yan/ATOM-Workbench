-- ATOM Workbench: Supabase initialization
-- Run this in Supabase Dashboard -> SQL Editor.
-- The app uses the anon/publishable key only. Never place service_role keys in the browser.

create table if not exists public.atom_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  cards jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint atom_workspaces_cards_is_array check (jsonb_typeof(cards) = 'array')
);

alter table public.atom_workspaces enable row level security;

drop policy if exists "Users can read their own ATOM workspace" on public.atom_workspaces;
create policy "Users can read their own ATOM workspace"
on public.atom_workspaces for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own ATOM workspace" on public.atom_workspaces;
create policy "Users can insert their own ATOM workspace"
on public.atom_workspaces for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own ATOM workspace" on public.atom_workspaces;
create policy "Users can update their own ATOM workspace"
on public.atom_workspaces for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant select, insert, update on public.atom_workspaces to authenticated;
