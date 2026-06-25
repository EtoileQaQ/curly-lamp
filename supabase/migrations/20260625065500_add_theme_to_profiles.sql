ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS theme
TEXT DEFAULT 'light'
CHECK (theme IN ('light', 'dark', 'system'));
