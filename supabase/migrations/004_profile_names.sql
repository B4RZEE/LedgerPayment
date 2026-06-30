-- Add first_name, last_name, and username to profiles
-- first_name and last_name are set at signup and never changed by the user
-- username is optional, unique (case-insensitive), and user-editable
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name  text,
  ADD COLUMN IF NOT EXISTS username   text;

-- Case-insensitive unique index for usernames (NULLs are excluded)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_ci_unique
  ON profiles (LOWER(username))
  WHERE username IS NOT NULL AND username <> '';
