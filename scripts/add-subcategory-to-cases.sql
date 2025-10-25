-- Add subcategory field to cases table
-- This allows cases to be associated with specific legal subcategories

ALTER TABLE cases
ADD COLUMN subcategory TEXT;

-- Create index for better query performance
CREATE INDEX idx_cases_subcategory ON cases(subcategory);

-- Update existing cases to have the "Capacitatea de exercițiu" subcategory
UPDATE cases
SET subcategory = 'Persoana fizică (Capacitatea de exercițiu)'
WHERE week_number IN (3, 4, 5);
