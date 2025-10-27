-- ============================================
-- FIX RLS POLICIES AND CREATE MISSING PROFILES
-- Fixes duplicate SELECT policies and ensures all auth users have profiles
-- ============================================

-- Drop the old SELECT policy that was conflicting
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

-- Drop the admin policy and recreate it properly
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Create a single, comprehensive SELECT policy
CREATE POLICY "Users can view profiles" ON user_profiles
    FOR SELECT
    USING (
        -- Users can always see their own profile
        auth.uid() = id
        OR
        -- Admins can see all profiles
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Create profiles for any auth users that don't have one yet
INSERT INTO user_profiles (id, email, name, username, university_code, university_category, university_name, is_admin)
SELECT
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', 'User'),
    COALESCE(au.raw_user_meta_data->>'username', SPLIT_PART(au.email, '@', 1)),
    'DEFAULT',
    'Other',
    'N/A',
    false
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles up WHERE up.id = au.id
)
AND au.email IS NOT NULL;

-- Update the first user to be admin if no admin exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE is_admin = TRUE) THEN
        UPDATE user_profiles
        SET is_admin = TRUE
        WHERE id = (
            SELECT id FROM user_profiles
            ORDER BY created_at ASC
            LIMIT 1
        );
    END IF;
END $$;
