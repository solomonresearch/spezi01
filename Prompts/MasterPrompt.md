# Project: spezi01 - Romanian Legal Education Platform

I need you to help me build a comprehensive AI-powered case study platform for Romanian law students. This platform will allow students to practice legal cases with an AI tutor that guides them to solutions using the Socratic method.

## Constitutional Requirements (NON-NEGOTIABLE)

This project MUST strictly follow the spezi01 Constitution attached. Key principles include:

1. **Module-First Architecture**: Build every feature as a standalone, testable module
2. **API-First Design**: All modules expose well-defined APIs with consistent patterns
3. **Test-First Development**: Write tests BEFORE implementation (TDD strictly enforced)
4. **Supabase Database**: PostgreSQL with Row Level Security for all data
5. **Pedagogical AI Behavior**: AI tutor NEVER gives direct answers, only guides via questions
6. **Simplicity & YAGNI**: Start with MVP, add complexity only when proven necessary

## Project Overview

**What it does:**
- Romanian law students authenticate via email and access a library of legal case studies
- Students select cases by category (Civil, Criminal, Procedural, Roman Law), sub-discipline, and difficulty
- An AI tutor (GPT-4) converses with students in Romanian, using Gen Z slang + legal terminology
- The AI guides students to solutions through Socratic questioning (minimum 3 exchanges)
- Students get progressive hints and are assessed as PASS/FAIL based on legal reasoning
- Students can generate 10 new cases per day using AI
- All progress, conversations, and statistics are tracked and saved

**Romanian Voice Requirements:**
- Gen Z conversational: "bro", "vezi tu", "deci", "băi", "frate"
- Legal precision: "art. X alin. Y C.civ.", proper legal terminology
- Example: "Deci vezi, bro, aici avem o chestie de răspundere civilă delictuală, nu? Ce condiții trebuie îndeplinite conform art. 1357 alin. 1 C.civ.?"

## Tech Stack (MANDATORY)

- **Frontend**: Next.js 14+ (App Router), TypeScript 5+, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes with Supabase client
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth (email/password)
- **AI**: OpenAI GPT-4-turbo API
- **Hosting**: Vercel (frontend), Supabase (database)
- **Testing**: Jest, React Testing Library, Playwright (E2E)

## Implementation Phases

### Phase 1: Foundation & Database Setup (START HERE)

**Step 1: Project Initialization**
```bash
# Initialize Next.js project with TypeScript
npx create-next-app@latest spezi01 --typescript --tailwind --app --eslint

# Install dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install openai zod react-hook-form @hookform/resolvers
npm install -D @types/node jest @testing-library/react @testing-library/jest-dom

# Install Supabase CLI
npm install -g supabase
supabase init
```

**Step 2: Create Database Schema**

Create the following SQL migration file in `/supabase/migrations/`:
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  daily_case_count INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'admin'))
);

-- Cases table
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('civil', 'criminal', 'procedural', 'roman')),
  sub_discipline TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  content JSONB NOT NULL, -- { facts, questions, parties, dates, key_terms }
  solution TEXT NOT NULL,
  hints JSONB NOT NULL, -- ["hint1", "hint2", "hint3"]
  articles TEXT[] NOT NULL,
  is_generated BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  quality_score DECIMAL(3,2),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'passed', 'failed')),
  attempts INTEGER DEFAULT 0,
  conversation_history JSONB DEFAULT '[]'::jsonb,
  hints_used INTEGER DEFAULT 0,
  passed_at TIMESTAMPTZ,
  score DECIMAL(5,2),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, case_id)
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb, -- [{ role, content, timestamp }]
  current_step INTEGER DEFAULT 1,
  hints_used INTEGER[] DEFAULT '{}',
  assessment JSONB, -- { passed, feedback, articles_correct }
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_cases_category_difficulty ON cases(category, difficulty);
CREATE INDEX idx_cases_sub_discipline ON cases(sub_discipline);
CREATE INDEX idx_user_progress_user_status ON user_progress(user_id, status);
CREATE INDEX idx_conversations_user_case ON conversations(user_id, case_id);
CREATE INDEX idx_user_progress_updated ON user_progress(updated_at DESC);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Cases policies (all authenticated users can read)
CREATE POLICY "Authenticated users can view cases" ON cases
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can create cases" ON cases
  FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.tier = 'admin'
    )
  );

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to reset daily case count
CREATE OR REPLACE FUNCTION reset_daily_case_count()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET daily_case_count = 0, last_reset_date = CURRENT_DATE
  WHERE last_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to increment case usage
CREATE OR REPLACE FUNCTION increment_case_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cases 
  SET usage_count = usage_count + 1
  WHERE id = NEW.case_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_case_usage
AFTER INSERT ON user_progress
FOR EACH ROW
EXECUTE FUNCTION increment_case_usage();
```

**Step 3: Setup Environment Variables**

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

**Step 4: Create Supabase Client Utilities**

Create `/lib/supabase/client.ts`:
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'

export const createClient = () => createClientComponentClient<Database>()
```

Create `/lib/supabase/server.ts`:
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
```

**Step 5: Generate TypeScript Types**
```bash
supabase gen types typescript --local > types/database.types.ts
```

### Phase 2: Authentication Module (Module-First Principle)

**Requirements:**
- Email/password authentication using Supabase Auth
- Email verification mandatory before access
- Auto-create user record in users table on signup
- Session management with automatic token refresh
- Protected routes (redirect to login if not authenticated)

**Deliverables:**
1. `/lib/modules/auth/auth.service.ts` - Authentication business logic
2. `/lib/modules/auth/auth.types.ts` - TypeScript interfaces
3. `/lib/modules/auth/auth.test.ts` - Unit tests (WRITE TESTS FIRST)
4. `/app/(auth)/login/page.tsx` - Login UI
5. `/app/(auth)/signup/page.tsx` - Signup UI
6. `/middleware.ts` - Route protection

**Test Requirements (TDD - WRITE FIRST):**
```typescript
// auth.test.ts
describe('AuthService', () => {
  it('should sign up user with email and password', async () => {})
  it('should send verification email on signup', async () => {})
  it('should login user with valid credentials', async () => {})
  it('should reject login with invalid credentials', async () => {})
  it('should create user record in database on signup', async () => {})
  it('should handle session token refresh', async () => {})
  it('should logout user and clear session', async () => {})
})
```

### Phase 3: Case Engine Module

**Requirements:**
- Retrieve cases by category, sub-discipline, difficulty
- Display case with proper formatting (bold dates, parties, amounts)
- Parse case content JSON and render as structured markdown
- Track case usage statistics
- Filter and search functionality

**Deliverables:**
1. `/lib/modules/case-engine/case.service.ts` - Case retrieval logic
2. `/lib/modules/case-engine/case.types.ts` - Case interfaces
3. `/lib/modules/case-engine/case.test.ts` - Unit tests
4. `/components/case/CaseCard.tsx` - Case display component
5. `/components/case/CaseViewer.tsx` - Full case view with highlighting
6. `/app/cases/page.tsx` - Case library page
7. `/app/cases/[id]/page.tsx` - Individual case page

**Case Template Structure:**
```typescript
interface CaseContent {
  title: string;
  facts: {
    parties: string; // Bolded
    dates: string[]; // Bolded
    context: string; // 2-3 paragraphs with key_terms bolded
  };
  questions: string[];
  key_terms: string[]; // Terms to bold in context
}
```

**Test Requirements:**
```typescript
describe('CaseService', () => {
  it('should retrieve cases by category', async () => {})
  it('should filter cases by difficulty', async () => {})
  it('should retrieve single case by ID', async () => {})
  it('should format case content with proper highlighting', async () => {})
  it('should handle non-existent case ID gracefully', async () => {})
})
```

### Phase 4: AI Tutor Module (CRITICAL - Pedagogical Behavior)

**Requirements:**
- OpenAI GPT-4 integration with Romanian language support
- NEVER provide direct answers (validate responses)
- Socratic questioning approach (minimum 3 exchanges)
- Progressive hint system (3 levels)
- Gen Z Romanian + legal terminology mix
- Conversation state management
- Assessment logic (pass/fail based on rubric)

**Deliverables:**
1. `/lib/modules/ai-tutor/tutor.service.ts` - AI interaction logic
2. `/lib/modules/ai-tutor/tutor.prompts.ts` - System prompts
3. `/lib/modules/ai-tutor/tutor.types.ts` - Message interfaces
4. `/lib/modules/ai-tutor/tutor.test.ts` - Unit tests
5. `/components/chat/ChatInterface.tsx` - Conversation UI
6. `/components/chat/HintDropdown.tsx` - Progressive hints
7. `/app/api/chat/route.ts` - API endpoint for AI responses

**System Prompt Template:**
```typescript
const SYSTEM_PROMPT = `You are a Romanian law tutor helping students prepare for exams.

PERSONALITY:
- Use Gen Z Romanian: "bro", "vezi tu", "deci", "băi", "frate"
- Mix casual tone with precise legal terminology
- Be encouraging but NEVER give direct answers

RULES (NON-NEGOTIABLE):
1. NEVER provide direct answers or solutions
2. Guide through Socratic questions (minimum 3 exchanges before allowing assessment)
3. Cite articles precisely: "art. X alin. Y C.civ."
4. Provide hints progressively when requested
5. Assess only after thorough discussion

EXAMPLE GOOD RESPONSE:
"Deci vezi, bro, aici avem o situație interesantă de răspundere civilă delictuală. 
Care crezi că sunt condițiile esențiale pentru angajarea răspunderii conform 
art. 1357 C.civ.? Hint: gândește-te la trei elemente cheie."

EXAMPLE BAD RESPONSE (NEVER DO THIS):
"Răspunsul este aplicarea art. 1357 C.civ. pentru răspundere civilă delictuală."

Current case: {caseContent}
Student's last message: {studentMessage}
Conversation history: {conversationHistory}
Exchange count: {exchangeCount}
Hints used: {hintsUsed}/3

Your response (guide, don't answer):`;
```

**Assessment Rubric:**
```typescript
interface AssessmentCriteria {
  correctLegalReasoning: boolean; // Applied correct legal principles
  allArticlesCited: boolean; // Cited all relevant articles
  properApplication: boolean; // Applied law to facts correctly
  fundamentalErrors: boolean; // Major misunderstandings
}

// PASS = correctLegalReasoning && allArticlesCited && properApplication && !fundamentalErrors
// FAIL = fundamentalErrors || !correctLegalReasoning || missing key articles
```

**Test Requirements:**
```typescript
describe('TutorService', () => {
  it('should never provide direct answers in responses', async () => {})
  it('should guide with questions for at least 3 exchanges', async () => {})
  it('should use Romanian Gen Z language mixed with legal terms', async () => {})
  it('should provide progressive hints when requested', async () => {})
  it('should assess PASS when all criteria met', async () => {})
  it('should assess FAIL when fundamental errors exist', async () => {})
  it('should require case restart on FAIL', async () => {})
})
```

### Phase 5: Progress Tracker Module

**Requirements:**
- Track all user case attempts and outcomes
- Calculate statistics (pass rate, average attempts, hints used)
- Implement streak tracking (consecutive days)
- Achievement system (e.g., "Master of Art. 1350")
- Analytics dashboard with SQL aggregations

**Deliverables:**
1. `/lib/modules/progress/progress.service.ts`
2. `/lib/modules/progress/progress.types.ts`
3. `/lib/modules/progress/progress.test.ts`
4. `/components/dashboard/StatsCard.tsx`
5. `/components/dashboard/ProgressChart.tsx`
6. `/app/dashboard/page.tsx`

### Phase 6: Case Generator Module

**Requirements:**
- Generate new cases using GPT-4 based on user selections
- Daily limit enforcement (10 cases per user per day)
- Validate generated cases (check article numbers exist)
- Store generated cases in database with metadata
- Quality scoring system

**Deliverables:**
1. `/lib/modules/generator/generator.service.ts`
2. `/lib/modules/generator/generator.prompts.ts`
3. `/lib/modules/generator/generator.test.ts`
4. `/app/api/generate-case/route.ts`
5. `/components/generator/CaseGeneratorForm.tsx`

**Generation Prompt Template:**
```typescript
const CASE_GENERATION_PROMPT = `Generate a Romanian law case study for educational purposes.

REQUIREMENTS:
- Category: {category}
- Sub-discipline: {subDiscipline}
- Difficulty: {difficulty}
- Topic: {topic}

OUTPUT FORMAT (JSON):
{
  "title": "Descriptive case title",
  "content": {
    "facts": {
      "parties": "Reclamant vs Pârât",
      "dates": ["2023-05-15", "2023-06-20"],
      "context": "2-3 paragraph realistic scenario with key facts in **bold**"
    },
    "questions": [
      "Identifică temeiul juridic aplicabil",
      "Determină articolele relevante"
    ],
    "key_terms": ["contract", "prejudiciu", "daune"]
  },
  "solution": "Detailed solution with legal reasoning",
  "hints": [
    "Hint 1: Think about the category of law",
    "Hint 2: Look in articles 1349-1395 C.civ.",
    "Hint 3: Focus on art. 1357 about civil liability conditions"
  ],
  "articles": ["art. 1357 alin. 1 C.civ.", "art. 1358 C.civ."]
}

Make it realistic, educational, and aligned with Romanian Civil Code.`;
```

### Phase 7: Pre-Written Case Library

**Requirements:**
- Create minimum 50 high-quality pre-written cases
- Distribution: 20 civil, 15 criminal, 10 procedural, 5 Roman law
- Cover common exam topics and article ranges
- Legal expert validation before inclusion

**Seed Data Structure:**
```sql
-- Example civil law case
INSERT INTO cases (title, category, sub_discipline, difficulty, content, solution, hints, articles) VALUES (
  'Răspundere pentru daune cauzate de animal',
  'civil',
  'Răspundere civilă',
  'beginner',
  '{
    "facts": {
      "parties": "Ion Popescu (reclamant) vs Maria Ionescu (pârâtă)",
      "dates": ["2023-03-15"],
      "context": "Ion Popescu a fost mușcat de câinele Mariei Ionescu în timp ce trecea pe trotuar. **Câinele nu era ținut în lesă** și a provocat **răni care au necesitat 10 zile de îngrijiri medicale**. Ion solicită despăgubiri în valoare de **5000 RON** pentru prejudiciul suferit."
    },
    "questions": [
      "Care este temeiul juridic pentru acțiunea lui Ion?",
      "Ce condiții trebuie îndeplinite pentru angajarea răspunderii Mariei?",
      "Maria poate invoca vreo cauză exoneratoare?"
    ],
    "key_terms": ["câinele", "mușcat", "răni", "10 zile", "5000 RON", "lesă"]
  }',
  'Conform art. 1375 C.civ., deținătorul unui animal răspunde pentru daunele cauzate de acesta, indiferent dacă animalul era sub supravegherea sa sau rătăcise. Răspunderea este obiectivă. Condițiile: fapta ilicită (mușcătura), prejudiciu (răni + cheltuieli medicale), legătură de cauzalitate. Maria poate fi exonerată doar dacă probează forța majoră, fapta victimei sau a unui terț.',
  '["Gândește-te la răspunderea pentru fapta lucrurilor și animalelor", "Caută în secțiunea despre răspundere specială, art. 1374-1376 C.civ.", "Art. 1375 C.civ. reglementează răspunderea deținătorului de animal"]',
  ARRAY['art. 1375 C.civ.', 'art. 1357 C.civ.', 'art. 1349 C.civ.']
);
```

## Key Implementation Guidelines

### 1. TDD Workflow (NON-NEGOTIABLE)
For EVERY module:
1. Write test file FIRST with describe/it blocks
2. Run tests (they should fail - red phase)
3. Get stakeholder/legal expert approval on test cases
4. Implement minimum code to pass tests (green phase)
5. Refactor while keeping tests green

### 2. Module Structure Template
```
/lib/modules/[module-name]/
  ├── [module].service.ts    # Business logic
  ├── [module].types.ts      # TypeScript interfaces
  ├── [module].test.ts       # Unit tests
  ├── [module].utils.ts      # Helper functions (optional)
  └── index.ts               # Public API exports
```

### 3. Error Handling Pattern
```typescript
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string; code: ErrorCode }

enum ErrorCode {
  AUTH_FAILED = 'AUTH_FAILED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_CASE_ID = 'INVALID_CASE_ID',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED'
}
```

### 4. Logging Requirements
Use structured logging at every critical point:
```typescript
logger.info('case_selected', {
  userId: user.id,
  caseId: case.id,
  category: case.category,
  difficulty: case.difficulty,
  timestamp: new Date().toISOString()
});
```

### 5. Romanian Language Validation
- Every AI response must be validated for proper Romanian legal terminology
- Gen Z slang must be appropriate and natural
- Legal terms must be precise (use official Codul Civil/Penal terminology)
- Test with Romanian-speaking legal expert before deployment

## Deliverable Checklist

After completing all phases, ensure:

- [ ] All modules have 90%+ test coverage
- [ ] All tests pass (unit + integration + E2E)
- [ ] Database migrations run successfully on local Supabase
- [ ] RLS policies tested (cannot access other users' data)
- [ ] Authentication flow complete (signup, login, email verification, logout)
- [ ] Case library with 50+ pre-written cases seeded
- [ ] AI tutor validated (never gives direct answers, proper Romanian voice)
- [ ] Progress tracking and dashboard functional
- [ ] Case generator with daily limit enforcement
- [ ] TypeScript strict mode (no `any` types)
- [ ] Responsive UI (mobile-first with Tailwind CSS)
- [ ] Performance: <2s page load, <5s AI responses
- [ ] Security: SQL injection prevention, XSS prevention, CSRF tokens
- [ ] Documentation: README with setup instructions, API documentation
- [ ] Legal expert reviewed all case content
- [ ] Romanian language accuracy validated

## Development Commands
```bash
# Local development
npm run dev

# Run Supabase locally
supabase start
supabase db reset  # Reset and re-seed database

# Generate types
supabase gen types typescript --local > types/database.types.ts

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Database migrations
supabase migration new [migration_name]
supabase db push

# Build for production
npm run build
npm start

# Deploy
vercel deploy
```

## Success Criteria

The application is complete when:
1. A law student can signup, login, and browse 50+ cases
2. Student can select a case and have a meaningful 5+ exchange conversation with AI tutor
3. AI tutor NEVER gives direct answers, only guides via questions
4. Student receives accurate pass/fail assessment based on legal reasoning
5. Progress is saved and visible in dashboard with statistics
6. Student can generate 10 new cases per day (rate limited)
7. All data is isolated per user (RLS working correctly)
8. Application is fast (<2s loads), secure (no vulnerabilities), and bug-free
9. Romanian language is natural and legally accurate
10. All tests pass with 90%+ coverage

## Next Steps After MVP

Once core functionality is working:
- Add real-time conversation updates with Supabase Realtime
- Implement achievement badges and gamification
- Add case difficulty auto-adjustment based on student performance
- Create admin panel for case management
- Add PDF export for completed cases
- Implement case bookmarking and favorites
- Add collaborative study mode (students can discuss cases)
- Mobile app with React Native

---

## Current Request

Please start with **Phase 1: Foundation & Database Setup**. 

Create:
1. Complete database schema SQL migration
2. Supabase client utilities
3. Environment variable template
4. TypeScript types generation
5. Basic Next.js project structure

Then, for **Phase 2: Authentication Module**, follow TDD:
1. Write auth.test.ts FIRST with all test cases
2. Show me the tests for approval
3. Implement auth.service.ts to pass the tests
4. Create login/signup UI components

Follow the spezi01 Constitution strictly, especially:
- Module-First Architecture
- Test-First Development
- Simplicity & YAGNI
- Database-First with Supabase

Let's build this step-by-step, ensuring quality at each phase before moving forward.