-- Add subscription tier to profiles
alter table profiles
  add column if not exists subscription_tier    text    not null default 'free',
  add column if not exists stripe_customer_id   text,
  add column if not exists subscription_status  text    not null default 'active',
  add column if not exists subscription_expires_at timestamptz;

-- Constrain valid tiers
alter table profiles
  drop constraint if exists profiles_subscription_tier_check;
alter table profiles
  add constraint profiles_subscription_tier_check
  check (subscription_tier in ('free', 'pro', 'max'));
