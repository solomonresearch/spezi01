-- Add verified flag and case_code to cases table
-- Migration: 20251026_add_verified_and_case_code

-- Add new columns
ALTER TABLE cases
ADD COLUMN verified BOOLEAN DEFAULT FALSE,
ADD COLUMN case_code TEXT UNIQUE;

-- Create index for case_code
CREATE INDEX idx_cases_code ON cases(case_code);

-- Update existing cases to set verified = false (already default, but explicit)
UPDATE cases SET verified = FALSE WHERE verified IS NULL;

-- Function to generate case code based on category, year, and sequence
-- Format: CIV1AAA, CIV1AAB, etc.
-- CIV = Civil Law, 1 = Year 1, AAA-ZZZ = Sequential

CREATE OR REPLACE FUNCTION generate_case_code(
    p_subcategory TEXT,
    p_week_number INTEGER
) RETURNS TEXT AS $$
DECLARE
    category_code TEXT;
    year_code TEXT;
    sequence_code TEXT;
    case_count INTEGER;
    final_code TEXT;
BEGIN
    -- Determine category code based on subcategory
    -- For now, all current cases are Civil Law
    category_code := 'CIV';

    -- Determine year based on week number (approximate)
    -- Weeks 1-14 = Year 1, Weeks 15-28 = Year 2, etc.
    IF p_week_number <= 14 THEN
        year_code := '1';
    ELSIF p_week_number <= 28 THEN
        year_code := '2';
    ELSIF p_week_number <= 42 THEN
        year_code := '3';
    ELSE
        year_code := '4';
    END IF;

    -- Count existing cases with this prefix to determine next sequence
    SELECT COUNT(*) INTO case_count
    FROM cases
    WHERE case_code LIKE (category_code || year_code || '%');

    -- Generate sequence code (AAA, AAB, AAC, ... AAZ, ABA, ABB, etc.)
    -- This is a base-26 encoding
    sequence_code := chr(65 + (case_count / 676)) ||
                     chr(65 + ((case_count / 26) % 26)) ||
                     chr(65 + (case_count % 26));

    final_code := category_code || year_code || sequence_code;

    RETURN final_code;
END;
$$ LANGUAGE plpgsql;

-- Generate case codes for all existing cases that don't have one
DO $$
DECLARE
    case_record RECORD;
    new_code TEXT;
BEGIN
    FOR case_record IN
        SELECT id, subcategory, week_number
        FROM cases
        WHERE case_code IS NULL
        ORDER BY week_number, created_at
    LOOP
        new_code := generate_case_code(case_record.subcategory, case_record.week_number);

        UPDATE cases
        SET case_code = new_code
        WHERE id = case_record.id;
    END LOOP;
END $$;

-- Add NOT NULL constraint after populating existing rows
ALTER TABLE cases ALTER COLUMN case_code SET NOT NULL;

-- Update the view to include new fields
DROP VIEW IF EXISTS cases_complete;
CREATE OR REPLACE VIEW cases_complete AS
SELECT
    c.id,
    c.title,
    c.case_code,
    c.verified,
    c.level,
    c.week_number,
    c.subcategory,
    c.legal_problem,
    c.case_description,
    c.question,
    c.created_at,
    c.updated_at,
    -- Array of article references
    ARRAY_AGG(DISTINCT ca.article_reference ORDER BY ca.article_reference) FILTER (WHERE ca.article_reference IS NOT NULL) AS articles,
    -- Array of analysis steps (ordered)
    ARRAY_AGG(ROW(cas.step_number, cas.step_description)::TEXT ORDER BY cas.step_number) FILTER (WHERE cas.step_number IS NOT NULL) AS analysis_steps,
    -- Array of hints (ordered)
    ARRAY_AGG(ROW(ch.hint_number, ch.hint_text)::TEXT ORDER BY ch.hint_number) FILTER (WHERE ch.hint_number IS NOT NULL) AS hints
FROM cases c
LEFT JOIN case_articles ca ON c.id = ca.case_id
LEFT JOIN case_analysis_steps cas ON c.id = cas.case_id
LEFT JOIN case_hints ch ON c.id = ch.case_id
GROUP BY c.id, c.title, c.case_code, c.verified, c.level, c.week_number, c.subcategory, c.legal_problem, c.case_description, c.question, c.created_at, c.updated_at;

-- Grant permissions on the updated view
GRANT SELECT ON cases_complete TO authenticated;

COMMENT ON COLUMN cases.verified IS 'Whether this case has been verified by a legal professional';
COMMENT ON COLUMN cases.case_code IS 'Unique case code in format: CATEGORYDIGITAAA (e.g., CIV1AAA)';
