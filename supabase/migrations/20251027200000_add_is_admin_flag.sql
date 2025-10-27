-- ============================================
-- ADD is_admin FLAG TO user_profiles
-- Simple boolean flag for admin users
-- ============================================

-- Add is_admin column
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- Create index for faster admin checks
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin ON user_profiles(is_admin) WHERE is_admin = TRUE;

-- Update RLS policies to allow admins to view all profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'user_profiles' AND policyname = 'Admins can view all profiles'
    ) THEN
        CREATE POLICY "Admins can view all profiles"
            ON user_profiles FOR SELECT
            USING (
                auth.uid() = id OR
                EXISTS (
                    SELECT 1 FROM user_profiles
                    WHERE id = auth.uid() AND is_admin = TRUE
                )
            );
    END IF;
END $$;

-- Grant admin access to first user (oldest account)
UPDATE user_profiles
SET is_admin = TRUE
WHERE id = (
    SELECT id FROM user_profiles
    ORDER BY created_at ASC
    LIMIT 1
);
