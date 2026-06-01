-- Users table (syncs with auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  scan_count int not null default 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text not null default 'inactive',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own data"
  on public.users for update
  using (auth.uid() = id);

-- Scans table
create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  resume_text text not null,
  job_description text not null,
  ats_score int,
  matched_keywords jsonb,
  missing_keywords jsonb,
  weak_bullets jsonb,
  summary text,
  created_at timestamptz not null default now()
);

alter table public.scans enable row level security;

create policy "Users can read own scans"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "Users can insert own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

-- Indexes
create index if not exists idx_users_plan_scan on public.users(plan, scan_count);
create index if not exists idx_scans_user_id on public.scans(user_id);
create index if not exists idx_scans_created_at on public.scans(created_at desc);

-- Function to handle new auth users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name'
  );
  return new;
end;
$$;

-- Trigger to create user record on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
