-- Legal Cases (Spete) Database Schema for Supabase

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS case_hints CASCADE;
DROP TABLE IF EXISTS case_analysis_steps CASCADE;
DROP TABLE IF EXISTS case_articles CASCADE;
DROP TABLE IF EXISTS cases CASCADE;

-- Main Cases Table
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('uor', 'mediu', 'dificil', 'Uor', 'Mediu', 'Dificil')),
    week_number INTEGER NOT NULL,
    legal_problem TEXT NOT NULL,
    case_description TEXT NOT NULL, -- Speta
    question TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case Relevant Articles (Many-to-Many relationship)
CREATE TABLE case_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    article_number TEXT NOT NULL, -- e.g., "34", "38", "41", etc.
    article_reference TEXT, -- Full reference like "Art. 34"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case Analysis Steps
CREATE TABLE case_analysis_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    step_description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(case_id, step_number)
);

-- Case Hints
CREATE TABLE case_hints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    hint_number INTEGER NOT NULL,
    hint_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(case_id, hint_number)
);

-- Indexes for better performance
CREATE INDEX idx_cases_level ON cases(level);
CREATE INDEX idx_cases_week ON cases(week_number);
CREATE INDEX idx_case_articles_case_id ON case_articles(case_id);
CREATE INDEX idx_case_articles_article_number ON case_articles(article_number);
CREATE INDEX idx_case_analysis_steps_case_id ON case_analysis_steps(case_id);
CREATE INDEX idx_case_hints_case_id ON case_hints(case_id);

-- Enable Row Level Security (RLS)
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_analysis_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_hints ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow authenticated users to read all cases
CREATE POLICY "Allow authenticated users to read cases"
    ON cases FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to read case articles"
    ON case_articles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to read analysis steps"
    ON case_analysis_steps FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to read hints"
    ON case_hints FOR SELECT
    TO authenticated
    USING (true);

-- Insert the example case
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 1: Cumprarea unei biciclete',
    'Uor',
    3,
    'Validitatea unui contract de vânzare-cumprare încheiat de un minor cu capacitate de exerciiu restrâns fr încuviinarea printelui.',
    'Andrei, în vârst de 15 ani, i-a cumprat o biciclet de curse de la vecinul su, David, pentru suma de 3.000 lei, bani pe care îi economisise din alocaia lunar. Tatl lui Andrei, aflând despre cumprare dup o sptmân, consider c preul este prea mare i dorete anularea tranzaciei. David refuz, spunând c Andrei a fost de acord i c banii au fost deja cheltuii.',
    'Este valabil cumprarea bicicletei încheiat între Andrei i David?'
) RETURNING id;

-- Note: Save the returned ID to use in the following inserts
-- For demonstration, we'll use a variable approach

DO $$
DECLARE
    case_id UUID;
BEGIN
    -- Get the ID of the case we just inserted
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 1: Cumprarea unei biciclete';

    -- Insert relevant articles
    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'),
        (case_id, '38', 'Art. 38'),
        (case_id, '41', 'Art. 41'),
        (case_id, '42', 'Art. 42'),
        (case_id, '79', 'Art. 79');

    -- Insert analysis steps
    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacitii de exerciiu a lui Andrei (15 ani - capacitate de exerciiu restrâns conform art. 41)'),
        (case_id, 2, 'Analiza naturii juridice a actului (cumprare biciclet 3.000 lei - act de dispoziie care depete valoarea mic)'),
        (case_id, 3, 'Verificarea îndeplinirii condiiilor legale (lipsa încuviinrii printelui conform art. 41 alin. 2)'),
        (case_id, 4, 'Stabilirea consecinelor juridice (anulabilitatea actului pentru lipsa capacitii)');

    -- Insert hints
    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Verificai vârsta lui Andrei i ce tip de capacitate de exerciiu are conform art. 41 Cod civil'),
        (case_id, 2, 'Analizai dac cumprarea unei biciclete de 3.000 lei poate fi considerat act de dispoziie de mic valoare conform art. 41 alin. 3'),
        (case_id, 3, 'Tatl lui Andrei trebuia s îi dea acordul pentru aceast cumprare?'),
        (case_id, 4, 'Ce se întâmpl cu un act juridic încheiat fr respectarea condiiilor de capacitate?');
END $$;

-- Create a view for easy querying of complete case information
CREATE OR REPLACE VIEW cases_complete AS
SELECT
    c.id,
    c.title,
    c.level,
    c.week_number,
    c.legal_problem,
    c.case_description,
    c.question,
    c.created_at,
    c.updated_at,
    -- Array of article references
    ARRAY_AGG(DISTINCT ca.article_reference ORDER BY ca.article_reference) FILTER (WHERE ca.article_reference IS NOT NULL) AS articles,
    -- Array of analysis steps (ordered)
    ARRAY_AGG(DISTINCT ROW(cas.step_number, cas.step_description)::TEXT ORDER BY cas.step_number) FILTER (WHERE cas.step_number IS NOT NULL) AS analysis_steps,
    -- Array of hints (ordered)
    ARRAY_AGG(DISTINCT ROW(ch.hint_number, ch.hint_text)::TEXT ORDER BY ch.hint_number) FILTER (WHERE ch.hint_number IS NOT NULL) AS hints
FROM cases c
LEFT JOIN case_articles ca ON c.id = ca.case_id
LEFT JOIN case_analysis_steps cas ON c.id = cas.case_id
LEFT JOIN case_hints ch ON c.id = ch.case_id
GROUP BY c.id, c.title, c.level, c.week_number, c.legal_problem, c.case_description, c.question, c.created_at, c.updated_at;

-- Grant permissions on the view
GRANT SELECT ON cases_complete TO authenticated;

COMMENT ON TABLE cases IS 'Legal case studies (spete) for civil law education';
COMMENT ON TABLE case_articles IS 'Relevant civil code articles for each case';
COMMENT ON TABLE case_analysis_steps IS 'Expected analysis steps for solving each case';
COMMENT ON TABLE case_hints IS 'Hints to guide students in analyzing cases';
