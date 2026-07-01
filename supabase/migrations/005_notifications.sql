-- User notification inbox (upcoming payouts, achievement unlocks, etc.)
create table if not exists notifications (
  id         text primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       text not null,
  title      text not null,
  body       text,
  payload    jsonb,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_idx
  on notifications (user_id, created_at desc);

alter table notifications enable row level security;

create policy "own notifications" on notifications
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Tracks which achievement ids have already fired an "unlocked" notification,
-- so achievements a user already earned before this feature shipped don't all
-- notify at once the next time their state is saved.
alter table profiles
  add column if not exists unlocked_achievements text[] not null default '{}';
