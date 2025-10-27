-- ============================================
-- FIX CIRCULAR REFERENCE IN RLS POLICIES
-- The admin check was causing infinite recursion
-- ============================================

-- Drop the problematic policy
DROP POLICY IF EXISTS "user_profiles_select_policy" ON user_profiles;

-- Create a simple SELECT policy without circular reference
-- Users can ALWAYS view their own profile
-- We'll handle admin access separately in the application layer
CREATE POLICY "user_profiles_select_policy" ON user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Create separate policy for admins using a security definer function
-- This breaks the circular reference
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = user_id AND is_admin = TRUE
    );
END;
$$;

-- Now create admin policy using the function
DROP POLICY IF EXISTS "admin_can_view_all_profiles" ON user_profiles;

CREATE POLICY "admin_can_view_all_profiles" ON user_profiles
    FOR SELECT
    USING (is_admin(auth.uid()));
