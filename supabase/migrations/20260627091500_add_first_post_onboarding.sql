CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id text UNIQUE,
  clerk_user_id text UNIQUE
);

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS user_id text,
ADD COLUMN IF NOT EXISTS clerk_user_id text,
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS persona text CHECK (
  persona IS NULL OR persona IN ('freelance', 'dirigeant', 'consultant', 'autre')
),
ADD COLUMN IF NOT EXISTS first_post_idea text,
ADD COLUMN IF NOT EXISTS first_post_generated text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

UPDATE profiles
SET clerk_user_id = COALESCE(clerk_user_id, user_id)
WHERE clerk_user_id IS NULL
  AND user_id IS NOT NULL;

UPDATE profiles
SET user_id = COALESCE(user_id, clerk_user_id)
WHERE user_id IS NULL
  AND clerk_user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_id_unique
ON profiles (user_id)
WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_clerk_user_id_unique
ON profiles (clerk_user_id)
WHERE clerk_user_id IS NOT NULL;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can read their own profile"
ON profiles
FOR SELECT
USING (clerk_user_id = auth.uid()::text OR user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
WITH CHECK (clerk_user_id = auth.uid()::text OR user_id = auth.uid()::text);

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (clerk_user_id = auth.uid()::text OR user_id = auth.uid()::text)
WITH CHECK (clerk_user_id = auth.uid()::text OR user_id = auth.uid()::text);
