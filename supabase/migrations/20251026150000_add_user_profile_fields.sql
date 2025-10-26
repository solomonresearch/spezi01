-- Migration: Add user profile fields (name, username, university)
-- Date: 2025-10-26
-- Description: Extends user profiles with display name, unique username, and university affiliation

-- Create user_profiles table to extend auth.users
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    university_code TEXT NOT NULL,
    university_category TEXT NOT NULL CHECK (university_category IN ('Public', 'Private', 'Other')),
    university_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for username lookups (must be unique and fast)
CREATE UNIQUE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_university ON user_profiles(university_code);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile (once, during signup)
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Public profiles view for leaderboards (limited fields)
CREATE OR REPLACE VIEW public_profiles AS
SELECT
    id,
    username,
    university_code,
    university_category,
    university_name,
    created_at
FROM user_profiles;

-- Grant access to authenticated users to view public profiles
GRANT SELECT ON public_profiles TO authenticated;

-- Function to check username availability
CREATE OR REPLACE FUNCTION is_username_available(p_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM user_profiles WHERE username = p_username
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Comments
COMMENT ON TABLE user_profiles IS 'Extended user profile information';
COMMENT ON COLUMN user_profiles.name IS 'User full name (display name)';
COMMENT ON COLUMN user_profiles.username IS 'Unique username for leaderboards and interactions';
COMMENT ON COLUMN user_profiles.university_code IS 'University abbreviation code (e.g., UB, UBB)';
COMMENT ON COLUMN user_profiles.university_category IS 'University category: Public, Private, or Other';
COMMENT ON COLUMN user_profiles.university_name IS 'Full university name with city';
