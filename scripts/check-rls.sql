-- Check all RLS policies on user_profiles
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'user_profiles';

-- Try to select from user_profiles (this will show what the current user can see)
SELECT id, email, name, username, is_admin, created_at
FROM user_profiles
ORDER BY created_at ASC;
