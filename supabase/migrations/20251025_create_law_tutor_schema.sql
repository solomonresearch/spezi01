-- Migration: Law Tutor Database Schema
-- Created: 2025-10-25
-- Description: Creates tables for legal case management, code articles, user progress tracking

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: legal_branches
-- Stores main branches of law (Civil, Criminal, Constitutional, etc.)
CREATE TABLE legal_branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_code VARCHAR(50) UNIQUE NOT NULL,
    branch_name_ro VARCHAR(100) NOT NULL,
    branch_name_en VARCHAR(100) NOT NULL,
    description TEXT,
    primary_code VARCHAR(50),
    icon VARCHAR(50),
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: legal_domains
-- Stores sub-domains within legal branches (Contracts, Torts, etc.)
CREATE TABLE legal_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain_code VARCHAR(50) UNIQUE NOT NULL,
    domain_name_ro VARCHAR(100) NOT NULL,
    domain_name_en VARCHAR(100) NOT NULL,
    legal_branch VARCHAR(50) REFERENCES legal_branches(branch_code) ON DELETE CASCADE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: code_articles
-- Stores legal code articles (Civil Code, Criminal Code, etc.)
CREATE TABLE code_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_type VARCHAR(50) NOT NULL,
    legal_branch VARCHAR(50),
    book_number INTEGER,
    title_number INTEGER,
    chapter_number INTEGER,
    article_number VARCHAR(20) NOT NULL,
    article_text TEXT NOT NULL,
    article_title VARCHAR(200),
    article_description TEXT,
    effective_date DATE,
    is_current BOOLEAN DEFAULT true,
    keywords JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(code_type, article_number) WHERE is_current = true
);

-- Create index for article search
CREATE INDEX idx_code_articles_number ON code_articles(article_number);
CREATE INDEX idx_code_articles_keywords ON code_articles USING GIN(keywords);

-- Table: users (extends Supabase auth.users)
-- Note: This is for additional user profile data. Auth is handled by Supabase Auth
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(200),
    role VARCHAR(50) DEFAULT 'student',
    specialization VARCHAR(100),
    is_verified_professional BOOLEAN DEFAULT false,
    professional_credentials TEXT,
    institution VARCHAR(200),
    academic_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: cases
-- Stores legal case studies for students
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    source_type VARCHAR(50) DEFAULT 'hardcoded',
    legal_branch VARCHAR(50) NOT NULL,
    legal_domain VARCHAR(100),
    applicable_codes JSONB,
    procedural_phase VARCHAR(50),
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    scenario_text TEXT NOT NULL,
    parties_involved JSONB,
    legal_questions JSONB,
    sample_solution TEXT,
    reasoning_explanation TEXT,
    learning_objectives JSONB,
    hints JSONB,
    verification_status VARCHAR(50) DEFAULT 'unverified',
    verified_by_id UUID REFERENCES user_profiles(id),
    verification_date TIMESTAMP WITH TIME ZONE,
    quality_score DECIMAL(3,2),
    version_number INTEGER DEFAULT 1,
    times_solved INTEGER DEFAULT 0,
    times_attempted INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2),
    average_completion_time INTEGER,
    average_user_rating DECIMAL(3,2),
    total_ratings_count INTEGER DEFAULT 0,
    bookmarked_count INTEGER DEFAULT 0,
    estimated_time INTEGER,
    prerequisites JSONB,
    curriculum_alignment VARCHAR(100),
    academic_year_level INTEGER,
    status VARCHAR(50) DEFAULT 'draft',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_id UUID REFERENCES user_profiles(id)
);

-- Create indexes for cases table
CREATE INDEX idx_cases_legal_branch ON cases(legal_branch);
CREATE INDEX idx_cases_difficulty ON cases(difficulty_level);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_featured ON cases(featured) WHERE featured = true;

-- Table: case_article_mappings
-- Links cases to relevant code articles
CREATE TABLE case_article_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    article_id UUID REFERENCES code_articles(id) ON DELETE CASCADE,
    relevance_type VARCHAR(50) DEFAULT 'primary',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(case_id, article_id)
);

-- Table: user_case_progress
-- Tracks user progress on cases
CREATE TABLE user_case_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not_started',
    user_answer TEXT,
    time_spent INTEGER DEFAULT 0,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    feedback_comment TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, case_id)
);

-- Create indexes for user progress
CREATE INDEX idx_user_progress_user ON user_case_progress(user_id);
CREATE INDEX idx_user_progress_case ON user_case_progress(case_id);
CREATE INDEX idx_user_progress_status ON user_case_progress(status);

-- Function: Generate Case ID
-- Format: CIV-25-ART-3 (Branch-Year-CodeType-Difficulty)
CREATE OR REPLACE FUNCTION generate_case_id(
    branch_code VARCHAR,
    case_year INTEGER,
    code_type VARCHAR,
    difficulty INTEGER
)
RETURNS VARCHAR AS $$
DECLARE
    year_short VARCHAR(2);
BEGIN
    year_short := RIGHT(case_year::TEXT, 2);
    RETURN CONCAT(
        UPPER(branch_code), '-',
        year_short, '-',
        UPPER(LEFT(code_type, 3)), '-',
        difficulty::TEXT
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_legal_branches_updated_at BEFORE UPDATE ON legal_branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_domains_updated_at BEFORE UPDATE ON legal_domains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_code_articles_updated_at BEFORE UPDATE ON code_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_case_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_case_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

-- RLS Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- RLS Policy: Everyone can view published cases
CREATE POLICY "Anyone can view published cases"
    ON cases FOR SELECT
    USING (status = 'published');

-- RLS Policy: Users can view their own draft cases
CREATE POLICY "Users can view own draft cases"
    ON cases FOR SELECT
    USING (auth.uid() = created_by_id);

-- RLS Policy: Users can create cases
CREATE POLICY "Authenticated users can create cases"
    ON cases FOR INSERT
    WITH CHECK (auth.uid() = created_by_id);

-- RLS Policy: Users can update their own cases
CREATE POLICY "Users can update own cases"
    ON cases FOR UPDATE
    USING (auth.uid() = created_by_id);

-- RLS Policy: Users can view their own progress
CREATE POLICY "Users can view own progress"
    ON user_case_progress FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own progress
CREATE POLICY "Users can insert own progress"
    ON user_case_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own progress
CREATE POLICY "Users can update own progress"
    ON user_case_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Insert seed data for legal branches
INSERT INTO legal_branches (branch_code, branch_name_ro, branch_name_en, description, primary_code, icon, color, sort_order) VALUES
    ('CIV', 'Drept Civil', 'Civil Law', 'Dreptul civil reglementează raporturile patrimoniale și nepatrimoniale dintre persoane fizice și juridice', 'civil_code', '⚖️', '#667eea', 1),
    ('CON', 'Drept Constitutional', 'Constitutional Law', 'Dreptul constituțional reglementează organizarea și funcționarea statului', 'constitution', '🏛️', '#764ba2', 2),
    ('ROM', 'Drept Roman', 'Roman Law', 'Dreptul roman reprezintă baza sistemului juridic european', 'roman_law', '🏺', '#9333ea', 3);

-- Insert seed data for legal domains (Civil Law subcategories)
INSERT INTO legal_domains (domain_code, domain_name_ro, domain_name_en, legal_branch, description, sort_order) VALUES
    ('civil_capacity_use', 'Persoana fizică (Capacitatea de folosință)', 'Natural Person (Legal Capacity)', 'CIV', 'Capacitatea de a avea drepturi și obligații', 1),
    ('civil_capacity_exercise', 'Persoana fizică (Capacitatea de exercițiu)', 'Natural Person (Capacity to Exercise)', 'CIV', 'Capacitatea de a exercita drepturile și obligațiile', 2),
    ('legal_entity_notion', 'Persoana juridică (Noțiune, Capacitate)', 'Legal Person (Notion, Capacity)', 'CIV', 'Definiția și capacitatea persoanei juridice', 3),
    ('legal_entity_function', 'Persoana juridică (Funcționarea persoanei juridice)', 'Legal Person (Functioning)', 'CIV', 'Modul de funcționare a persoanei juridice', 4),
    ('civil_status', 'Persoana fizică (Elemente de identificare. Starea civilă)', 'Natural Person (Identification. Civil Status)', 'CIV', 'Elemente de identificare și starea civilă', 5),
    ('incapacity_protection', 'Persoana fizică (Ocrotirea incapabilului)', 'Natural Person (Protection of Incapacitated)', 'CIV', 'Măsuri de protecție pentru persoanele incapabile', 6),
    ('subjective_rights', 'Exercitarea drepturilor subiective civile. Abuzul de drept', 'Exercise of Civil Rights. Abuse of Rights', 'CIV', 'Modalități de exercitare a drepturilor și limitele acestora', 7),
    ('non_patrimonial', 'Apărarea drepturilor nepatrimoniale', 'Protection of Non-Patrimonial Rights', 'CIV', 'Apărarea drepturilor personale nepatrimoniale', 8),
    ('law_application_1', 'Aplicarea legii civile în timp și spațiu I', 'Application of Civil Law in Time and Space I', 'CIV', 'Principii de aplicare a legii civile - Partea I', 9),
    ('law_application_2', 'Aplicarea legii civile în timp și spațiu II', 'Application of Civil Law in Time and Space II', 'CIV', 'Principii de aplicare a legii civile - Partea II', 10);

-- Comments for documentation
COMMENT ON TABLE legal_branches IS 'Main branches of law (Civil, Criminal, Constitutional, etc.)';
COMMENT ON TABLE legal_domains IS 'Sub-domains within legal branches';
COMMENT ON TABLE code_articles IS 'Legal code articles from various Romanian codes';
COMMENT ON TABLE user_profiles IS 'Extended user profile information beyond Supabase Auth';
COMMENT ON TABLE cases IS 'Legal case studies for educational purposes';
COMMENT ON TABLE case_article_mappings IS 'Links between cases and relevant code articles';
COMMENT ON TABLE user_case_progress IS 'Tracks user progress and performance on cases';
