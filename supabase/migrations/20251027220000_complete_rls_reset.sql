-- ============================================
-- COMPLETE RLS RESET FOR user_profiles
-- Removes all existing policies and creates clean set
-- ============================================

-- DROP ALL EXISTING POLICIES (by name from all migrations)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow profile creation during signup" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for signup" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON user_profiles;

-- Disable and re-enable RLS to ensure clean state
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- CREATE FRESH POLICIES

-- 1. SELECT policy: Users can view their own profile OR admins can view all
CREATE POLICY "user_profiles_select_policy" ON user_profiles
    FOR SELECT
    USING (
        auth.uid() = id
        OR
        EXISTS (
            SELECT 1 FROM user_profiles admin_check
            WHERE admin_check.id = auth.uid()
            AND admin_check.is_admin = TRUE
        )
    );

-- 2. INSERT policy: Allow signup to create profiles
CREATE POLICY "user_profiles_insert_policy" ON user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 3. UPDATE policy: Users can update their own profile
CREATE POLICY "user_profiles_update_policy" ON user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. DELETE policy: Users can delete their own profile (optional)
CREATE POLICY "user_profiles_delete_policy" ON user_profiles
    FOR DELETE
    USING (auth.uid() = id);

-- ============================================
-- CREATE MISSING PROFILES
-- ============================================

-- Insert profiles for auth users that don't have one
INSERT INTO user_profiles (id, email, name, username, university_code, university_category, university_name, is_admin)
SELECT
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', 'User'),
    COALESCE(au.raw_user_meta_data->>'username', SPLIT_PART(au.email, '@', 1)),
    'DEFAULT',
    'Other',
    'To be filled',
    false
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles up WHERE up.id = au.id
)
AND au.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ENSURE FIRST USER IS ADMIN
-- ============================================

DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- Get the first user by creation date
    SELECT id INTO first_user_id
    FROM user_profiles
    ORDER BY created_at ASC
    LIMIT 1;

    -- Make them admin if they exist
    IF first_user_id IS NOT NULL THEN
        UPDATE user_profiles
        SET is_admin = TRUE
        WHERE id = first_user_id;

        RAISE NOTICE 'Made user % admin', first_user_id;
    END IF;
END $$;
