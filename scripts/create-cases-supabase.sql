-- Legal Cases (Spete) Database Schema for Supabase
-- Run this script in Supabase SQL Editor

-- Drop existing tables if they exist
DROP TABLE IF EXISTS case_hints CASCADE;
DROP TABLE IF EXISTS case_analysis_steps CASCADE;
DROP TABLE IF EXISTS case_articles CASCADE;
DROP TABLE IF EXISTS cases CASCADE;

-- Main Cases Table
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('ușor', 'mediu', 'dificil', 'Ușor', 'Mediu', 'Dificil')),
    week_number INTEGER NOT NULL,
    legal_problem TEXT NOT NULL,
    case_description TEXT NOT NULL,
    question TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case Relevant Articles (Many-to-Many relationship)
CREATE TABLE case_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    article_number TEXT NOT NULL,
    article_reference TEXT,
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
    'Caz 1: Cumpărarea unei biciclete',
    'Ușor',
    3,
    'Validitatea unui contract de vânzare-cumpărare încheiat de un minor cu capacitate de exercițiu restrânsă fără încuviințarea părintelui.',
    'Andrei, în vârstă de 15 ani, și-a cumpărat o bicicletă de curse de la vecinul său, David, pentru suma de 3.000 lei, bani pe care îi economisise din alocația lunară. Tatăl lui Andrei, aflând despre cumpărare după o săptămână, consideră că prețul este prea mare și dorește anularea tranzacției. David refuză, spunând că Andrei a fost de acord și că banii au fost deja cheltuiți.',
    'Este valabilă cumpărarea bicicletei încheiată între Andrei și David?'
);

-- Insert related data for the example case
DO $$
DECLARE
    case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 1: Cumpărarea unei biciclete';

    -- Insert relevant articles
    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'),
        (case_id, '38', 'Art. 38'),
        (case_id, '41', 'Art. 41'),
        (case_id, '42', 'Art. 42'),
        (case_id, '79', 'Art. 79');

    -- Insert analysis steps
    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a lui Andrei (15 ani - capacitate de exercițiu restrânsă conform art. 41)'),
        (case_id, 2, 'Analiza naturii juridice a actului (cumpărare bicicletă 3.000 lei - act de dispoziție care depășește valoarea mică)'),
        (case_id, 3, 'Verificarea îndeplinirii condițiilor legale (lipsa încuviințării părintelui conform art. 41 alin. 2)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (anulabilitatea actului pentru lipsa capacității)');

    -- Insert hints
    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Verificați vârsta lui Andrei și ce tip de capacitate de exercițiu are conform art. 41 Cod civil'),
        (case_id, 2, 'Analizați dacă cumpărarea unei biciclete de 3.000 lei poate fi considerată act de dispoziție de mică valoare conform art. 41 alin. 3'),
        (case_id, 3, 'Tatăl lui Andrei trebuia să își dea acordul pentru această cumpărare?'),
        (case_id, 4, 'Ce se întâmplă cu un act juridic încheiat fără respectarea condițiilor de capacitate?');
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
    ARRAY_AGG(ca.article_reference ORDER BY ca.article_reference) FILTER (WHERE ca.article_reference IS NOT NULL) AS articles,
    ARRAY_AGG(ROW(cas.step_number, cas.step_description)::TEXT ORDER BY cas.step_number) FILTER (WHERE cas.step_number IS NOT NULL) AS analysis_steps,
    ARRAY_AGG(ROW(ch.hint_number, ch.hint_text)::TEXT ORDER BY ch.hint_number) FILTER (WHERE ch.hint_number IS NOT NULL) AS hints
FROM cases c
LEFT JOIN case_articles ca ON c.id = ca.case_id
LEFT JOIN case_analysis_steps cas ON c.id = cas.case_id
LEFT JOIN case_hints ch ON c.id = ch.case_id
GROUP BY c.id, c.title, c.level, c.week_number, c.legal_problem, c.case_description, c.question, c.created_at, c.updated_at;

-- Grant permissions on the view
GRANT SELECT ON cases_complete TO authenticated;

-- Add comments
COMMENT ON TABLE cases IS 'Legal case studies (spete) for civil law education';
COMMENT ON TABLE case_articles IS 'Relevant civil code articles for each case';
COMMENT ON TABLE case_analysis_steps IS 'Expected analysis steps for solving each case';
COMMENT ON TABLE case_hints IS 'Hints to guide students in analyzing cases';
