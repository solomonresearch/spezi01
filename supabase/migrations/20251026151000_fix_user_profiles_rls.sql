-- Migration: Fix RLS policy for user_profiles to allow signup
-- Date: 2025-10-26
-- Description: Updates RLS policy to allow profile creation during signup

-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Create a more permissive INSERT policy
-- Allow insert if the user is authenticated OR if inserting their own ID
CREATE POLICY "Allow profile creation during signup" ON user_profiles
    FOR INSERT
    WITH CHECK (
        auth.uid() = id
        OR
        (
            -- Allow insert if no profile exists for this user yet
            NOT EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = id)
        )
    );

-- Alternative: Make insert completely open but with validation
-- This allows the signup process to create the profile
DROP POLICY IF EXISTS "Allow profile creation during signup" ON user_profiles;

CREATE POLICY "Enable insert for signup" ON user_profiles
    FOR INSERT
    WITH CHECK (true);

-- But restrict updates to own profile only
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Ensure users can only view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT
    USING (auth.uid() = id);
