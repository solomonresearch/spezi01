-- Migration: Add function for admins to update user roles
-- Created: 2025-10-28
-- Purpose: Allow admins to update user roles, bypassing RLS

-- Create function to update user role (only callable by admins)
CREATE OR REPLACE FUNCTION update_user_role(
  p_user_id uuid,
  p_new_role user_role
)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_calling_user_id uuid;
  v_is_admin boolean;
  v_updated_user json;
BEGIN
  -- Get the ID of the user calling this function
  v_calling_user_id := auth.uid();

  -- Check if the calling user is an admin
  SELECT is_admin INTO v_is_admin
  FROM public.user_profiles
  WHERE id = v_calling_user_id;

  -- Only admins can update user roles
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Only admins can update user roles';
  END IF;

  -- Update the user's role
  UPDATE public.user_profiles
  SET
    role = p_new_role,
    updated_at = now()
  WHERE id = p_user_id;

  -- Return the updated user data
  SELECT json_build_object(
    'id', id,
    'email', email,
    'name', name,
    'username', username,
    'role', role,
    'is_admin', is_admin
  ) INTO v_updated_user
  FROM public.user_profiles
  WHERE id = p_user_id;

  RETURN v_updated_user;
END;
$$;

-- Add comment explaining the function
COMMENT ON FUNCTION update_user_role(uuid, user_role) IS
'Allows admin users to update the role of any user. This function bypasses RLS policies using SECURITY DEFINER.';
