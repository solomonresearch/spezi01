-- ============================================
-- ADD GLOBAL CASE SEARCH FUNCTION
-- Search cases by code or title with ranking
-- ============================================

-- Step 1: Create search function for case code and title only
CREATE OR REPLACE FUNCTION search_cases(
  search_query TEXT,
  max_results INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  case_code TEXT,
  title TEXT,
  category TEXT,
  subcategory TEXT,
  level TEXT,
  verified BOOLEAN,
  rank REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.case_code,
    c.title,
    c.category,
    c.subcategory,
    c.level,
    c.verified,
    -- Calculate rank based on match quality (cast to REAL to match return type)
    (CASE
      -- Exact case code match (highest priority)
      WHEN LOWER(c.case_code) = LOWER(search_query) THEN 100.0
      -- Case code starts with query
      WHEN LOWER(c.case_code) LIKE LOWER(search_query) || '%' THEN 90.0
      -- Case code contains query
      WHEN LOWER(c.case_code) LIKE '%' || LOWER(search_query) || '%' THEN 80.0
      -- Exact title match
      WHEN LOWER(c.title) = LOWER(search_query) THEN 70.0
      -- Title starts with query
      WHEN LOWER(c.title) LIKE LOWER(search_query) || '%' THEN 60.0
      -- Title contains query
      WHEN LOWER(c.title) LIKE '%' || LOWER(search_query) || '%' THEN 50.0
      ELSE 0.0
    END)::REAL AS rank
  FROM cases c
  WHERE
    -- Search only in case_code and title
    (
      LOWER(c.case_code) LIKE '%' || LOWER(search_query) || '%'
      OR LOWER(c.title) LIKE '%' || LOWER(search_query) || '%'
    )
  ORDER BY
    rank DESC,
    c.created_at DESC
  LIMIT max_results;
END;
$$;

-- Step 2: Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION search_cases(TEXT, INT) TO authenticated;

-- Step 3: Add comment for documentation
COMMENT ON FUNCTION search_cases IS 'Search cases by case_code or title with relevance ranking. Returns up to max_results cases ordered by relevance.';
