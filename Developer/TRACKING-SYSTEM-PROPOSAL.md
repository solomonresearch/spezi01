# User Activity Tracking System - Architecture Proposal

**Date:** 2025-10-27
**Status:** Proposal - Not Yet Implemented
**Aligns with:** bestpractices01.md (API-First, Privacy-First, Supabase-backed)

---

## 1. Overview

This proposal outlines a comprehensive tracking system to monitor and analyze student activity on the Spezi legal education platform, including:

- ✅ Assessment scores and attempts
- ✅ Solution submissions with full text
- ✅ **COMPLETE AI feedback and evaluation results** (every AI response saved)
- ✅ **Detailed score breakdowns** (all 10 rubric criteria tracked individually)
- ✅ **ALL AI messages tracked** (chat tutor + assessment evaluator)
- ✅ Chat conversations with AI tutor (every message logged)
- ✅ Progress tracking and points system
- ✅ Per-case attempt counters
- ✅ Time-on-task analytics
- ✅ **Unified AI interaction audit log** (all AI calls platform-wide)

---

## 2. KEY FEATURE: Comprehensive AI Message Tracking

**EVERY AI INTERACTION IS TRACKED AND STORED:**

### 2.1. What AI Messages Are Tracked

1. **AI Tutor Chat Messages** (`chat_messages` table)
   - Every user question sent to AI tutor
   - Every AI response in chat conversations
   - Model used, tokens consumed, timestamps

2. **AI Detection Reviews** (logged to `ai_interactions`)
   - Student solution text submitted
   - AI detection prompt and system prompt
   - AI's analysis and probability percentage
   - Justification for detection decision

3. **Full Legal Assessments** (stored in multiple tables)
   - Complete evaluation feedback in `user_solutions.feedback_text`
   - Detailed score breakdown in `assessment_evaluations` table:
     * All 10 rubric criteria scores (understanding, identification, chronology, etc.)
     * Strong points identified by AI
     * Weak points identified by AI
     * Improvement recommendations
     * General commentary
   - Full unstructured AI response preserved

4. **Unified Audit Log** (`ai_interactions` table)
   - **EVERY AI API CALL** across the platform
   - Request prompts (user + system)
   - Complete AI responses
   - Model metadata (name, tokens, cost)
   - Performance metrics (response time)
   - Success/failure status

### 2.2. Why This Matters

✅ **Transparency:** Students can see exactly what AI said about their work
✅ **Auditability:** Admin can review all AI feedback for quality control
✅ **Analytics:** Track which rubric criteria students struggle with most
✅ **Cost Management:** Monitor AI API usage and costs
✅ **Debugging:** Reproduce exact AI responses for support
✅ **Academic Integrity:** Full audit trail of all AI interactions
✅ **Compliance:** Meet data retention and transparency requirements

---

## 3. Database Schema (Supabase PostgreSQL)

### 3.1. Core Tracking Tables

```sql
-- ============================================
-- USER SOLUTIONS TABLE
-- Stores every solution attempt by students
-- ============================================
CREATE TABLE user_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,

    -- Solution content
    solution_text TEXT NOT NULL,
    difficulty_level INTEGER NOT NULL CHECK (difficulty_level IN (1, 3, 5)),

    -- AI Detection results
    ai_detection_passed BOOLEAN,
    ai_detection_probability INTEGER, -- 0-100
    ai_detection_justification TEXT, -- Why AI was/wasn't detected

    -- Assessment results
    total_score INTEGER CHECK (total_score >= 0 AND total_score <= 100),
    feedback_text TEXT, -- FULL assessment feedback from Claude (complete evaluation)

    -- AI Assessment metadata
    assessment_model TEXT DEFAULT 'claude-sonnet-4-20250514',
    assessment_tokens_used INTEGER,
    assessment_duration_ms INTEGER, -- How long evaluation took

    -- Metadata
    attempt_number INTEGER NOT NULL DEFAULT 1,
    time_spent_seconds INTEGER, -- Optional: time from case open to submit
    submitted_at TIMESTAMPTZ DEFAULT NOW(),

    -- Indexes
    CONSTRAINT unique_user_case_attempt UNIQUE (user_id, case_id, attempt_number)
);

CREATE INDEX idx_user_solutions_user ON user_solutions(user_id);
CREATE INDEX idx_user_solutions_case ON user_solutions(case_id);
CREATE INDEX idx_user_solutions_submitted ON user_solutions(submitted_at DESC);


-- ============================================
-- CHAT SESSIONS TABLE
-- Tracks AI tutor conversations
-- ============================================
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    case_id UUID REFERENCES cases(id) ON DELETE SET NULL,

    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    total_messages INTEGER DEFAULT 0,
    total_interactions INTEGER DEFAULT 0, -- User messages only

    -- Context
    case_code TEXT,
    case_title TEXT
);

CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_case ON chat_sessions(case_id);


-- ============================================
-- CHAT MESSAGES TABLE
-- Stores every message in tutor conversations
-- ============================================
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,

    -- Metadata
    tokens_used INTEGER,
    model_name TEXT DEFAULT 'claude-sonnet-4-20250514',
    timestamp TIMESTAMPTZ DEFAULT NOW(),

    -- Audit
    message_sequence INTEGER NOT NULL
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id, message_sequence);
CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_timestamp ON chat_messages(timestamp DESC);


-- ============================================
-- ASSESSMENT EVALUATIONS TABLE
-- Stores detailed breakdown of AI assessment scores
-- ============================================
CREATE TABLE assessment_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solution_id UUID NOT NULL REFERENCES user_solutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Breakdown scores (from the 100-point rubric)
    -- I. Operațiuni Intelectuale (40 points)
    score_understanding INTEGER, -- 1.1 Citirea și înțelegerea (5p)
    score_identification INTEGER, -- 1.2 Identificarea elementelor (8p)
    score_chronology INTEGER, -- 1.3 Ordonarea cronologică (5p)
    score_summary INTEGER, -- 1.4 Rezumatul faptelor (7p)
    score_legal_qualification INTEGER, -- 1.5 Calificarea juridică (10p)
    score_problem_determination INTEGER, -- 1.6 Determinarea problemei (5p)

    -- II. Redactarea Soluției (60 points)
    score_introduction INTEGER, -- 2.1 Introducere (10p)
    score_major_premise INTEGER, -- 2.2.1 Premisa majoră (20p)
    score_minor_premise INTEGER, -- 2.2.2 Premisa minoră (15p)
    score_conclusion INTEGER, -- 2.2.3 Concluzia (15p)

    -- Parsed feedback sections
    strong_points TEXT[], -- Array of strong points identified
    weak_points TEXT[], -- Array of weak points identified
    recommendations TEXT[], -- Array of improvement recommendations
    general_commentary TEXT, -- Overall evaluation commentary

    -- AI response metadata
    full_response TEXT NOT NULL, -- Complete unstructured AI response
    response_tokens INTEGER,
    response_time_ms INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assessment_evaluations_solution ON assessment_evaluations(solution_id);
CREATE INDEX idx_assessment_evaluations_user ON assessment_evaluations(user_id);


-- ============================================
-- AI INTERACTIONS AUDIT LOG
-- Unified log of ALL AI interactions across the platform
-- ============================================
CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Interaction type
    interaction_type TEXT NOT NULL CHECK (interaction_type IN (
        'chat_message',           -- AI tutor chat
        'ai_detection',           -- AI detection check
        'assessment_evaluation',  -- Full legal assessment
        'system_message'          -- Other AI-generated content
    )),

    -- Context
    context_type TEXT, -- 'case', 'general', 'admin'
    context_id UUID, -- Reference to case_id, session_id, etc.

    -- Request
    user_prompt TEXT, -- What user submitted (if applicable)
    system_prompt TEXT, -- System prompt used

    -- Response
    ai_response TEXT NOT NULL, -- Full AI response
    model_name TEXT NOT NULL DEFAULT 'claude-sonnet-4-20250514',
    tokens_used INTEGER,
    response_time_ms INTEGER,

    -- Metadata
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT, -- If failed
    api_call_cost_usd DECIMAL(10, 6), -- Track API costs

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX idx_ai_interactions_type ON ai_interactions(interaction_type);
CREATE INDEX idx_ai_interactions_created ON ai_interactions(created_at DESC);
CREATE INDEX idx_ai_interactions_context ON ai_interactions(context_type, context_id);


-- ============================================
-- USER PROGRESS TABLE
-- Aggregated progress and points per user
-- ============================================
CREATE TABLE user_progress (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Points and scoring
    total_points INTEGER DEFAULT 0,
    total_cases_attempted INTEGER DEFAULT 0,
    total_cases_passed INTEGER DEFAULT 0, -- Score >= 60
    total_solutions_submitted INTEGER DEFAULT 0,

    -- Averages
    average_score DECIMAL(5,2), -- e.g., 87.50
    best_score INTEGER,

    -- Activity
    total_chat_messages INTEGER DEFAULT 0,
    total_chat_sessions INTEGER DEFAULT 0,
    last_active_at TIMESTAMPTZ,

    -- Streak tracking
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    last_activity_date DATE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_progress_points ON user_progress(total_points DESC);
CREATE INDEX idx_user_progress_average ON user_progress(average_score DESC);


-- ============================================
-- CASE ATTEMPTS TABLE
-- Per-case attempt tracking
-- ============================================
CREATE TABLE case_attempts (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,

    -- Counters
    total_attempts INTEGER DEFAULT 0,
    passed_attempts INTEGER DEFAULT 0,
    failed_attempts INTEGER DEFAULT 0,

    -- Scores
    best_score INTEGER,
    latest_score INTEGER,
    average_score DECIMAL(5,2),

    -- Status
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'passed', 'failed')),
    first_attempt_at TIMESTAMPTZ,
    last_attempt_at TIMESTAMPTZ,

    -- Time analytics
    total_time_spent_seconds INTEGER DEFAULT 0,

    PRIMARY KEY (user_id, case_id)
);

CREATE INDEX idx_case_attempts_user ON case_attempts(user_id);
CREATE INDEX idx_case_attempts_case ON case_attempts(case_id);


-- ============================================
-- DAILY ACTIVITY LOG
-- Daily snapshot for analytics
-- ============================================
CREATE TABLE daily_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,

    -- Daily counters
    solutions_submitted INTEGER DEFAULT 0,
    chat_messages_sent INTEGER DEFAULT 0,
    cases_viewed INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,

    -- Time
    total_active_seconds INTEGER DEFAULT 0,

    CONSTRAINT unique_user_date UNIQUE (user_id, activity_date)
);

CREATE INDEX idx_daily_activity_user_date ON daily_activity(user_id, activity_date DESC);


-- ============================================
-- ACHIEVEMENT UNLOCKS (Gamification)
-- ============================================
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- emoji
    points INTEGER DEFAULT 0,
    criteria_json JSONB, -- Flexible criteria definition
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id, unlocked_at DESC);
```

---

## 3. Row Level Security (RLS) Policies

Following the privacy-first principle, students can only see their own data, while instructors/admins have broader access.

```sql
-- ============================================
-- RLS POLICIES
-- ============================================

-- user_solutions: Students see only their own
ALTER TABLE user_solutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own solutions"
    ON user_solutions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own solutions"
    ON user_solutions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- chat_sessions: Students see only their own
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat sessions"
    ON chat_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chat sessions"
    ON chat_sessions FOR ALL
    USING (auth.uid() = user_id);

-- chat_messages: Students see only their own
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
    ON chat_messages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
    ON chat_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- user_progress: Students see only their own
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
    ON user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can update progress"
    ON user_progress FOR ALL
    USING (true); -- Updated by triggers/functions

-- case_attempts: Students see only their own
ALTER TABLE case_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attempts"
    ON case_attempts FOR SELECT
    USING (auth.uid() = user_id);

-- daily_activity: Students see only their own
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
    ON daily_activity FOR SELECT
    USING (auth.uid() = user_id);

-- user_achievements: Students see only their own
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

-- assessment_evaluations: Students see only their own
ALTER TABLE assessment_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own evaluations"
    ON assessment_evaluations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert evaluations"
    ON assessment_evaluations FOR INSERT
    WITH CHECK (true); -- System-generated

-- ai_interactions: Students see only their own
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI interactions"
    ON ai_interactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can log AI interactions"
    ON ai_interactions FOR INSERT
    WITH CHECK (true); -- System audit log


-- ============================================
-- ADMIN POLICIES (Add role column to user_profiles first)
-- ============================================

-- Add role to user_profiles if not exists
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student'
    CHECK (role IN ('student', 'instructor', 'admin'));

-- Admin view all policies (example for user_solutions)
CREATE POLICY "Admins can view all solutions"
    ON user_solutions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'instructor')
        )
    );
```

---

## 4. Database Functions & Triggers

Auto-update aggregated tables when new data arrives.

```sql
-- ============================================
-- FUNCTION: Update user progress after solution submission
-- ============================================
CREATE OR REPLACE FUNCTION update_user_progress_on_solution()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user_progress aggregates
    INSERT INTO user_progress (user_id, total_solutions_submitted, total_cases_attempted, updated_at)
    VALUES (NEW.user_id, 1, 1, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        total_solutions_submitted = user_progress.total_solutions_submitted + 1,
        total_cases_attempted = CASE
            WHEN NEW.attempt_number = 1 THEN user_progress.total_cases_attempted + 1
            ELSE user_progress.total_cases_attempted
        END,
        total_cases_passed = CASE
            WHEN NEW.total_score >= 60 THEN user_progress.total_cases_passed + 1
            ELSE user_progress.total_cases_passed
        END,
        average_score = (
            SELECT AVG(total_score) FROM user_solutions
            WHERE user_id = NEW.user_id AND total_score IS NOT NULL
        ),
        best_score = GREATEST(user_progress.best_score, COALESCE(NEW.total_score, 0)),
        last_active_at = NOW(),
        updated_at = NOW();

    -- Update case_attempts
    INSERT INTO case_attempts (user_id, case_id, total_attempts, first_attempt_at, last_attempt_at)
    VALUES (NEW.user_id, NEW.case_id, 1, NOW(), NOW())
    ON CONFLICT (user_id, case_id) DO UPDATE SET
        total_attempts = case_attempts.total_attempts + 1,
        passed_attempts = CASE
            WHEN NEW.total_score >= 60 THEN case_attempts.passed_attempts + 1
            ELSE case_attempts.passed_attempts
        END,
        failed_attempts = CASE
            WHEN NEW.total_score < 60 THEN case_attempts.failed_attempts + 1
            ELSE case_attempts.failed_attempts
        END,
        best_score = GREATEST(case_attempts.best_score, COALESCE(NEW.total_score, 0)),
        latest_score = NEW.total_score,
        last_attempt_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_progress
    AFTER INSERT ON user_solutions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_progress_on_solution();


-- ============================================
-- FUNCTION: Update chat session on new message
-- ============================================
CREATE OR REPLACE FUNCTION update_chat_session_on_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_sessions
    SET
        total_messages = total_messages + 1,
        total_interactions = CASE
            WHEN NEW.role = 'user' THEN total_interactions + 1
            ELSE total_interactions
        END,
        ended_at = NOW()
    WHERE id = NEW.session_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chat_session
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_session_on_message();
```

---

## 5. API Endpoints (RESTful, Versioned)

Following API-first principles from constitution.

### 5.1. Student-Facing Endpoints

```
POST   /v1/solutions
    - Submit a new solution for assessment
    - Body: { case_id, solution_text, difficulty_level, time_spent_seconds }
    - Response: { solution_id, ai_detection_passed, score?, feedback? }

GET    /v1/solutions/me
    - Get all my solution submissions (paginated)
    - Query params: ?case_id, ?limit, ?offset
    - Response: { solutions: [...], total, has_more }

GET    /v1/solutions/:id
    - Get details of a specific solution
    - Response: { solution, feedback, score, attempt_number }

GET    /v1/progress/me
    - Get my overall progress and stats
    - Response: { total_points, average_score, cases_attempted, streak, ... }

GET    /v1/progress/case/:case_id
    - Get my attempts and progress on a specific case
    - Response: { attempts, best_score, latest_score, status }

POST   /v1/chat/sessions
    - Start a new chat session for a case
    - Body: { case_id }
    - Response: { session_id }

POST   /v1/chat/sessions/:session_id/messages
    - Send a message in the chat session
    - Body: { content }
    - Response: { message_id, assistant_response }

GET    /v1/chat/sessions/me
    - Get all my chat sessions (paginated)
    - Response: { sessions: [...], total }

GET    /v1/chat/sessions/:session_id/messages
    - Get all messages in a session
    - Response: { messages: [...] }

GET    /v1/achievements/me
    - Get my unlocked achievements
    - Response: { achievements: [...] }

GET    /v1/leaderboard
    - Get top students by points (anonymized)
    - Query params: ?limit=50
    - Response: { rankings: [{ username, points, rank }] }

GET    /v1/assessments/:solution_id/evaluation
    - Get detailed score breakdown for a solution
    - Response: { scores: { understanding: 4, identification: 7, ... }, strong_points: [...] }

GET    /v1/ai-interactions/me
    - Get my AI interaction history (audit log)
    - Query params: ?type, ?limit, ?offset
    - Response: { interactions: [...], total_tokens, total_cost }
```

### 5.2. Admin/Instructor Endpoints

```
GET    /v1/admin/users
    - List all users with basic stats
    - Query params: ?role, ?limit, ?offset
    - Response: { users: [...], total }

GET    /v1/admin/users/:user_id/progress
    - Get detailed progress for a specific user
    - Response: { progress, solutions, chat_history }

GET    /v1/admin/users/:user_id/solutions
    - Get all solutions by a user (for review)
    - Response: { solutions: [...] }

GET    /v1/admin/analytics/cases
    - Case-level analytics
    - Response: { case_id, avg_score, attempt_count, pass_rate, ... }

GET    /v1/admin/analytics/overview
    - Platform-wide metrics
    - Response: { total_users, active_users, avg_completion_rate, ... }

POST   /v1/admin/achievements
    - Create a new achievement
    - Body: { code, name, description, points, criteria }

GET    /v1/admin/activity/recent
    - Recent activity feed (last 100 actions)
    - Response: { activities: [{ user, action, timestamp }] }

GET    /v1/admin/ai-interactions
    - Get all AI interactions platform-wide
    - Query params: ?type, ?user_id, ?date_from, ?date_to, ?limit
    - Response: { interactions: [...], total_tokens, total_cost }

GET    /v1/admin/ai-interactions/costs
    - Get AI usage costs and metrics
    - Query params: ?period=day|week|month
    - Response: { total_cost, cost_by_type, cost_by_user, tokens_used }

GET    /v1/admin/assessments/:solution_id/evaluation
    - Get full evaluation details for any solution
    - Response: { evaluation, scores, feedback, ai_metadata }

GET    /v1/admin/assessments/analytics
    - Get assessment analytics
    - Response: { avg_scores_by_criteria, common_weak_points, ai_detection_stats }
```

---

## 6. User Views (Where Students See Their Data)

### 6.1. Student Dashboard (New Page/Tab)

Create a new **"Progresul Meu"** (My Progress) page accessible from the main navigation.

**Location:** `/progress` route

**Components:**

```tsx
<StudentProgressDashboard>

  {/* Overview Cards */}
  <ProgressOverview>
    - Total Points: 1,250 🏆
    - Average Score: 82.5/100 📊
    - Cases Completed: 15/28 ✅
    - Current Streak: 7 days 🔥
  </ProgressOverview>

  {/* Score Chart */}
  <ScoreHistoryChart>
    - Line chart showing scores over time
    - Filter by difficulty level
  </ScoreHistoryChart>

  {/* Recent Solutions */}
  <RecentSolutions>
    - Table: Case | Score | Date | View Details
    - Click to see full feedback
  </RecentSolutions>

  {/* Per-Case Progress */}
  <CaseProgressList>
    - Each case shows: attempts, best score, status
    - Click to view all attempts for that case
  </CaseProgressList>

  {/* Achievements */}
  <AchievementsSection>
    - Grid of unlocked achievements
    - Locked achievements shown as silhouettes
  </AchievementsSection>

  {/* Activity Heatmap */}
  <ActivityHeatmap>
    - GitHub-style contribution calendar
    - Shows daily activity intensity
  </ActivityHeatmap>

</StudentProgressDashboard>
```

### 6.2. In-Case View (Existing Dashboard)

Add a small **"Încercările Mele"** (My Attempts) section at the bottom of the assessment module when expanded:

```tsx
{assessmentExpanded && caseData && (
  <>
    {/* Existing assessment UI */}

    {/* New: My Attempts for This Case */}
    <div className="my-attempts-section">
      <h4>📊 Încercările Tale la Acest Caz</h4>
      <div className="attempts-summary">
        <span>Încercări: {attempts.total}</span>
        <span>Cel mai bun scor: {attempts.bestScore}/100</span>
        <span>Ultimul scor: {attempts.latestScore}/100</span>
      </div>

      {/* List of previous attempts */}
      <div className="attempts-list">
        {previousAttempts.map(attempt => (
          <div className="attempt-card" key={attempt.id}>
            <span>Încercarea #{attempt.attemptNumber}</span>
            <span>{attempt.score}/100</span>
            <span>{formatDate(attempt.submittedAt)}</span>
            <button onClick={() => viewAttempt(attempt.id)}>Vezi detalii</button>
          </div>
        ))}
      </div>
    </div>
  </>
)}
```

### 6.3. Chat History View

Add a button to view past chat sessions:

```tsx
<ChatContainer>
  <div className="chat-header">
    <h3>AI Assistant</h3>
    <button onClick={openChatHistory}>📜 Istoric Conversații</button>
  </div>

  {/* Modal/Drawer with past sessions */}
  {showChatHistory && (
    <ChatHistoryModal>
      <SessionsList>
        {sessions.map(session => (
          <SessionCard
            key={session.id}
            caseTitle={session.caseTitle}
            messageCount={session.totalMessages}
            date={session.startedAt}
            onClick={() => loadSession(session.id)}
          />
        ))}
      </SessionsList>
    </ChatHistoryModal>
  )}
</ChatContainer>
```

---

## 7. Admin Views (Where Admins See Data)

### 7.1. Admin Dashboard (New Protected Route)

**Location:** `/admin` route (protected by role check)

**Components:**

```tsx
<AdminDashboard>

  {/* Platform-Wide Metrics */}
  <MetricsOverview>
    - Total Users: 342
    - Active Today: 87
    - Solutions Submitted Today: 156
    - Average Platform Score: 76.8
    - AI Detection Rate: 8.2%
  </MetricsOverview>

  {/* Recent Activity Feed */}
  <ActivityFeed>
    - "User @john123 submitted solution for CIV1AAO - Score: 85"
    - "User @maria_ro completed 5 day streak 🔥"
    - "New user @alex_d registered"
    - Real-time or near-real-time updates
  </ActivityFeed>

  {/* User Management */}
  <UserManagement>
    - Search/filter users
    - Click user to see detailed profile
    - Actions: View progress, View solutions, Send message
  </UserManagement>

  {/* Case Analytics */}
  <CaseAnalytics>
    - Table: Case | Attempts | Avg Score | Pass Rate | AI Detect %
    - Sort by any column
    - Identify difficult cases (low pass rate)
  </CaseAnalytics>

  {/* Score Distribution */}
  <ScoreDistribution>
    - Histogram of all scores
    - Filter by case, difficulty, date range
  </ScoreDistribution>

</AdminDashboard>
```

### 7.2. Individual User Review Page

**Location:** `/admin/users/:user_id`

```tsx
<UserDetailView>

  {/* User Header */}
  <UserHeader>
    - Name, Email, Username, University
    - Join Date, Last Active
    - Total Points, Rank
  </UserHeader>

  {/* Progress Overview */}
  <UserProgressOverview>
    - Charts showing progress over time
    - Cases completed, average score trend
  </UserProgressOverview>

  {/* All Solutions */}
  <AllSolutionsTable>
    - Sortable, filterable table
    - Click to view full solution + feedback
    - Flag suspicious patterns (too many AI detections)
  </AllSolutionsTable>

  {/* Chat History */}
  <ChatHistoryViewer>
    - All chat sessions
    - Search within conversations
    - Export functionality
  </ChatHistoryViewer>

  {/* Activity Timeline */}
  <ActivityTimeline>
    - Chronological view of all actions
    - "Submitted solution", "Started chat", "Viewed case"
  </ActivityTimeline>

  {/* AI Interactions Log */}
  <AIInteractionsLog>
    - All AI calls made by this user
    - Type: Chat, Detection, Assessment
    - Tokens used, cost tracking
    - Success/failure status
    - Export for analysis
  </AIInteractionsLog>

</UserDetailView>
```

### 7.3. AI Detection Monitor

**Location:** `/admin/ai-detection`

```tsx
<AIDetectionDashboard>

  {/* Detection Rate Trend */}
  <DetectionRateTrend>
    - Line chart showing % of solutions flagged over time
    - Identify spikes or patterns
  </DetectionRateTrend>

  {/* Flagged Solutions */}
  <FlaggedSolutionsList>
    - All solutions where AI was detected
    - User, Case, Date, Probability %
    - Actions: Review, Contact User, Dismiss
  </FlaggedSolutionsList>

  {/* User AI Detection Stats */}
  <UserAIStats>
    - Users with highest AI detection rates
    - Potential academic integrity concerns
  </UserAIStats>

</AIDetectionDashboard>
```

### 7.4. AI Interactions Monitor

**Location:** `/admin/ai-interactions`

```tsx
<AIInteractionsDashboard>

  {/* Usage Metrics */}
  <AIUsageMetrics>
    - Total API calls today/week/month
    - Total tokens consumed
    - Estimated costs (USD)
    - By type: Chat vs Assessment vs Detection
  </AIUsageMetrics>

  {/* Cost Tracking */}
  <CostAnalysis>
    - Line chart of daily API costs
    - Cost per user breakdown
    - Most expensive operations
    - Budget alerts
  </CostAnalysis>

  {/* Interaction Log */}
  <InteractionLog>
    - Real-time feed of AI calls
    - Filter by: user, type, success/fail
    - Search prompts and responses
    - Performance metrics (response time)
  </InteractionLog>

  {/* Error Analysis */}
  <ErrorLog>
    - Failed AI calls
    - Error messages and debugging
    - Retry statistics
  </ErrorLog>

  {/* Model Usage Stats */}
  <ModelUsage>
    - Which models used (claude-sonnet-4-20250514, etc.)
    - Average tokens per interaction type
    - Response time distribution
  </ModelUsage>

</AIInteractionsDashboard>
```

---

## 8. Privacy & Security Considerations

### 8.1. Data Retention

- **Solutions & Feedback:** Retained for 2 years after graduation
- **Chat Messages:** Retained for 1 year
- **Daily Activity:** Aggregated to monthly after 6 months
- **Audit Logs:** Retained indefinitely (legal requirement)

### 8.2. Anonymization for Leaderboards

```sql
-- Public leaderboard view (anonymized)
CREATE OR REPLACE VIEW public_leaderboard AS
SELECT
    up.username,
    up.total_points,
    up.average_score,
    ROW_NUMBER() OVER (ORDER BY up.total_points DESC) as rank
FROM user_progress up
JOIN user_profiles u ON up.user_id = u.id
WHERE u.consent_leaderboard = TRUE -- Optional consent flag
ORDER BY up.total_points DESC
LIMIT 100;
```

### 8.3. Right to Be Forgotten

```sql
-- Function to anonymize/delete user data
CREATE OR REPLACE FUNCTION anonymize_user_data(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Anonymize solutions (keep for analytics)
    UPDATE user_solutions
    SET solution_text = '[REDACTED]'
    WHERE user_id = target_user_id;

    -- Delete chat messages
    DELETE FROM chat_messages WHERE user_id = target_user_id;
    DELETE FROM chat_sessions WHERE user_id = target_user_id;

    -- Keep aggregated stats (anonymized)
    -- Delete user profile
    DELETE FROM user_profiles WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 9. Implementation Phases

### Phase 1: Core Tracking (Week 1-2)
- ✅ Create database tables and RLS policies
- ✅ Implement solution submission tracking
- ✅ **Create assessment_evaluations table** (detailed score breakdowns)
- ✅ **Create ai_interactions table** (unified AI audit log)
- ✅ Create basic user_progress table
- ✅ Add API endpoints for solution submission
- ✅ **Implement AI interaction logging** for all Claude API calls

### Phase 2: Chat Tracking (Week 2-3)
- ✅ Implement chat session/message tracking
- ✅ Update useChat hook to log to database AND ai_interactions table
- ✅ Update assessmentService to log AI detection + evaluation to ai_interactions
- ✅ Create chat history API endpoints

### Phase 3: Student Views (Week 3-4)
- ✅ Build "Progresul Meu" dashboard page
- ✅ Add "My Attempts" section to assessment module
- ✅ Implement score charts and visualizations

### Phase 4: Admin Dashboard (Week 4-5)
- ✅ Build admin dashboard with analytics
- ✅ Implement user detail view
- ✅ Create AI detection monitoring tools

### Phase 5: Gamification (Week 5-6)
- ✅ Define achievement system
- ✅ Implement streak tracking
- ✅ Create leaderboard
- ✅ Add points/badges to UI

---

## 10. Open Questions

1. **Points System:** How many points per score bracket?
   - Proposal: 1 point per score point (85/100 = 85 points)
   - Bonus: +50 points for first attempt over 90
   - Streak bonus: +10 points per day in streak

2. **AI Detection Threshold:** Current 30%, should we adjust?
   - Consider: 25% for stricter detection
   - Or: 35% to reduce false positives

3. **Chat Storage:** Store indefinitely or cap at X messages per user?
   - Proposal: Last 1000 messages per user, older archived

4. **Anonymous Leaderboard:** Show real usernames or anonymous tags?
   - Proposal: Show usernames (already public), but require consent checkbox

5. **Export Functionality:** Should students export their data?
   - GDPR compliance: Yes, implement data export API

---

## 11. Next Steps

1. **Review this proposal** with product owner and legal advisor
2. **Create OpenAPI v3 spec** for all new endpoints
3. **Write migration scripts** for new tables
4. **Implement Phase 1** (Core Tracking)
5. **Add integration tests** for tracking flows
6. **Update privacy policy** to reflect data collection

---

**Governance Metadata**
**Version:** 1.0.0 (Proposal)
**Author:** Claude Code
**Date:** 2025-10-27
**Aligns With:** bestpractices01.md v1.0.0
