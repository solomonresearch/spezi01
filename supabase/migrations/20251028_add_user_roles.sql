-- Migration: Add user roles system (user, moderator, admin)
-- Created: 2025-10-28

-- Step 1: Create enum type for user roles
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');

-- Step 2: Add role column to user_profiles with default 'user'
ALTER TABLE public.user_profiles
ADD COLUMN role user_role NOT NULL DEFAULT 'user';

-- Step 3: Migrate existing admin users to 'admin' role
UPDATE public.user_profiles
SET role = 'admin'
WHERE is_admin = true;

-- Step 4: Create index on role for faster queries
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);

-- Step 5: Create function to keep is_admin in sync with role (for backward compatibility)
CREATE OR REPLACE FUNCTION sync_is_admin_with_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Update is_admin based on role
  NEW.is_admin := (NEW.role = 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create trigger to automatically sync is_admin when role changes
CREATE TRIGGER trigger_sync_is_admin
BEFORE INSERT OR UPDATE OF role ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION sync_is_admin_with_role();

-- Step 7: Add comment explaining the new column
COMMENT ON COLUMN public.user_profiles.role IS 'User role: user (default), moderator, or admin. Admins can manage all users and moderators. Moderators have elevated permissions. All users can generate cases.';

-- Note: is_admin column is kept for backward compatibility and is automatically synced with role column
