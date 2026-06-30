-- ============================================================
-- LedgerPayout — initial schema
-- ============================================================

-- Profiles (one per auth user)
create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  name            text,
  goals_daily     numeric default 100,
  goals_weekly    numeric default 700,
  goals_monthly   numeric default 5000,
  goals_annual    numeric default 50000,
  onboarded       boolean default false,
  created_at      timestamptz default now()
);

-- Prop firms
create table if not exists firms (
  id         text primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  created_at timestamptz default now()
);

-- Trading accounts under a firm
create table if not exists accounts (
  id         text primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  firm_id    text not null references firms(id) on delete cascade,
  label      text not null,
  health     text default 'active',
  created_at timestamptz default now()
);

-- Payouts
create table if not exists payouts (
  id         text primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  firm_id    text references firms(id) on delete set null,
  account_id text references accounts(id) on delete set null,
  amount     numeric not null,
  date       date not null,
  status     text default 'pending',
  notes      text,
  created_at timestamptz default now()
);

-- Spending / costs
create table if not exists spending (
  id         text primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  firm_id    text references firms(id) on delete set null,
  account_id text references accounts(id) on delete set null,
  amount     numeric not null,
  date       date not null,
  category   text default 'other',
  notes      text,
  created_at timestamptz default now()
);

-- Journal entries (one per user per day)
create table if not exists journal (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  date       date not null,
  text       text not null,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- ============================================================
-- Row Level Security — users only see their own data
-- ============================================================
alter table profiles enable row level security;
alter table firms    enable row level security;
alter table accounts enable row level security;
alter table payouts  enable row level security;
alter table spending enable row level security;
alter table journal  enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own firms"   on firms    for all using (auth.uid() = user_id);
create policy "own accounts" on accounts for all using (auth.uid() = user_id);
create policy "own payouts"  on payouts  for all using (auth.uid() = user_id);
create policy "own spending" on spending for all using (auth.uid() = user_id);
create policy "own journal"  on journal  for all using (auth.uid() = user_id);

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
