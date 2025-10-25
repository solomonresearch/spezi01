-- Quick table creation for civil code upload
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/pgprhlzpzegwfwcbsrww/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: code_types
CREATE TABLE IF NOT EXISTS code_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_id VARCHAR(50) UNIQUE NOT NULL,
    code_name_ro VARCHAR(100) NOT NULL,
    code_name_en VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: code_articles
CREATE TABLE IF NOT EXISTS code_articles (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique partial index (prevents duplicate articles for same code type)
CREATE UNIQUE INDEX IF NOT EXISTS idx_code_articles_unique
    ON code_articles(code_type, article_number)
    WHERE is_current = true;

-- Create indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_code_articles_number ON code_articles(article_number);
CREATE INDEX IF NOT EXISTS idx_code_articles_type ON code_articles(code_type);
CREATE INDEX IF NOT EXISTS idx_code_articles_keywords ON code_articles USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_code_articles_fulltext ON code_articles USING GIN(to_tsvector('romanian', article_text));

-- Insert code types
INSERT INTO code_types (code_id, code_name_ro, code_name_en, icon, description, sort_order)
VALUES
    ('civil_code', 'Codul Civil', 'Civil Code', '⚖️', 'Codul civil român reglementează raporturile patrimoniale și nepatrimoniale dintre persoane', 1),
    ('constitution', 'Constituția României', 'Romanian Constitution', '🏛️', 'Legea fundamentală a statului român', 2),
    ('criminal_code', 'Codul Penal', 'Criminal Code', '👮', 'Codul penal român reglementează infracțiunile și pedepsele', 3)
ON CONFLICT (code_id) DO NOTHING;

-- Success message
SELECT 'Tables created successfully!' AS status;
