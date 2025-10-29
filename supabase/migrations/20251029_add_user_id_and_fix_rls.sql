-- ============================================
-- ADD user_id COLUMN AND FIX RLS POLICIES
-- Allow all authenticated users to create cases
-- ============================================

-- Step 0: Create is_admin helper function if it doesn't exist
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

-- Step 1: Add user_id column to cases table
ALTER TABLE cases
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);

-- Step 3: Update existing cases to have a user_id (set to first admin or first user)
-- This is for backward compatibility with existing cases
UPDATE cases
SET user_id = (
    SELECT id FROM user_profiles WHERE is_admin = TRUE LIMIT 1
)
WHERE user_id IS NULL;

-- Step 4: Drop old restrictive policies
DROP POLICY IF EXISTS "cases_insert_policy" ON cases;
DROP POLICY IF EXISTS "cases_update_policy" ON cases;
DROP POLICY IF EXISTS "cases_delete_policy" ON cases;

-- Step 5: Create new RLS policies

-- Allow ALL authenticated users to insert their own cases
CREATE POLICY "cases_insert_policy" ON cases
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
    );

-- Allow users to update their own cases, admins can update any
CREATE POLICY "cases_update_policy" ON cases
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id
        OR is_admin(auth.uid())
    );

-- Allow users to delete their own cases, admins can delete any
CREATE POLICY "cases_delete_policy" ON cases
    FOR DELETE
    TO authenticated
    USING (
        auth.uid() = user_id
        OR is_admin(auth.uid())
    );

-- Step 6: Update child table policies

-- case_articles policies
DROP POLICY IF EXISTS "case_articles_insert_policy" ON case_articles;
DROP POLICY IF EXISTS "case_articles_update_policy" ON case_articles;
DROP POLICY IF EXISTS "case_articles_delete_policy" ON case_articles;

CREATE POLICY "case_articles_insert_policy" ON case_articles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cases
            WHERE cases.id = case_articles.case_id
            AND cases.user_id = auth.uid()
        )
    );

CREATE POLICY "case_articles_update_policy" ON case_articles
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cases
            WHERE cases.id = case_articles.case_id
            AND (cases.user_id = auth.uid() OR is_admin(auth.uid()))
        )
    );

CREATE POLICY "case_articles_delete_policy" ON case_articles
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cases
            WHERE cases.id = case_articles.case_id
            AND (cases.user_id = auth.uid() OR is_admin(auth.uid()))
        )
    );

-- case_analysis_steps policies
DROP POLICY IF EXISTS "case_analysis_steps_insert_policy" ON case_analysis_steps;
DROP POLICY IF EXISTS "case_analysis_steps_update_policy" ON case_analysis_steps;
DROP POLICY IF EXISTS "case_analysis_steps_delete_policy" ON case_analysis_steps;

CREATE POLICY "case_analysis_steps_insert_policy" ON case_analysis_steps
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cases
            WHERE cases.id = case_analysis_steps.case_id
            AND cases.user_id = auth.uid()
        )
    );

CREATE POLICY "case_analysis_steps_update_policy" ON case_analysis_steps
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cases
            WHERE cases.id = case_analysis_steps.case_id
            AND (cases.user_id = auth.uid() OR is_admin(auth.uid()))
        )
    );

CREATE POLICY "case_analysis_steps_delete_policy" ON case_analysis_steps
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cases
            WHERE cases.id = case_analysis_steps.case_id
            AND (cases.user_id = auth.uid() OR is_admin(auth.uid()))
        )
    );

-- case_hints policies
DROP POLICY IF EXISTS "case_hints_insert_policy" ON case_hints;
DROP POLICY IF EXISTS "case_hints_update_policy" ON case_hints;
DROP POLICY IF EXISTS "case_hints_delete_policy" ON case_hints;

CREATE POLICY "case_hints_insert_policy" ON case_hints
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cases
            WHERE cases.id = case_hints.case_id
            AND cases.user_id = auth.uid()
        )
    );

CREATE POLICY "case_hints_update_policy" ON case_hints
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cases
            WHERE cases.id = case_hints.case_id
            AND (cases.user_id = auth.uid() OR is_admin(auth.uid()))
        )
    );

CREATE POLICY "case_hints_delete_policy" ON case_hints
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cases
            WHERE cases.id = case_hints.case_id
            AND (cases.user_id = auth.uid() OR is_admin(auth.uid()))
        )
    );
