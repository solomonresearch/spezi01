-- ============================================
-- FIX CASES RLS POLICIES
-- Remove conflicting policies and allow authenticated users to view all cases
-- ============================================

-- Drop all existing case-related policies
DROP POLICY IF EXISTS "Anyone can view published cases" ON cases;
DROP POLICY IF EXISTS "Users can view own draft cases" ON cases;
DROP POLICY IF EXISTS "Authenticated users can create cases" ON cases;
DROP POLICY IF EXISTS "Users can update own cases" ON cases;
DROP POLICY IF EXISTS "Allow authenticated users to read cases" ON cases;

-- Create simple, clean policies for cases
-- Allow all authenticated users to view all cases
CREATE POLICY "cases_select_policy" ON cases
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow admins to insert cases
CREATE POLICY "cases_insert_policy" ON cases
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Allow admins to update cases
CREATE POLICY "cases_update_policy" ON cases
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- Same for case_articles, analysis_steps, and hints
DROP POLICY IF EXISTS "Allow authenticated users to read case articles" ON case_articles;
DROP POLICY IF EXISTS "Allow authenticated users to read analysis steps" ON analysis_steps;
DROP POLICY IF EXISTS "Allow authenticated users to read hints" ON hints;

CREATE POLICY "case_articles_select_policy" ON case_articles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "analysis_steps_select_policy" ON analysis_steps
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "hints_select_policy" ON hints
    FOR SELECT TO authenticated USING (true);
