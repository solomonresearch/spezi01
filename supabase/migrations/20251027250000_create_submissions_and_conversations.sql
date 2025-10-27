-- Create tables for case submissions and chat conversations
-- Migration: 20251027250000

-- Case Submissions Table
-- Stores all user submissions for legal cases with feedback and scores
CREATE TABLE IF NOT EXISTS public.case_submissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  case_id uuid NOT NULL,
  submission_text text NOT NULL,
  feedback_text text,
  score text, -- Format: "9/10", "7/10", etc.
  score_value numeric, -- Normalized score for calculations (0-100)
  difficulty_rating integer CHECK (difficulty_rating >= 1 AND difficulty_rating <= 10),
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'revised')),
  submitted_at timestamp with time zone DEFAULT now(),
  feedback_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT case_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT case_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT case_submissions_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE
);

-- Chat Conversations Table
-- Stores all AI chatbot conversations per user per case
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  case_id uuid, -- NULL for general conversations not tied to a case
  conversation_data jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of {role: 'user'|'assistant', content: string, timestamp: ISO8601}
  message_count integer DEFAULT 0,
  started_at timestamp with time zone DEFAULT now(),
  last_message_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_conversations_pkey PRIMARY KEY (id),
  CONSTRAINT chat_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT chat_conversations_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE SET NULL
);

-- Indexes for better query performance
CREATE INDEX idx_case_submissions_user_id ON public.case_submissions(user_id);
CREATE INDEX idx_case_submissions_case_id ON public.case_submissions(case_id);
CREATE INDEX idx_case_submissions_status ON public.case_submissions(status);
CREATE INDEX idx_case_submissions_submitted_at ON public.case_submissions(submitted_at DESC);
CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_case_id ON public.chat_conversations(case_id);
CREATE INDEX idx_chat_conversations_last_message_at ON public.chat_conversations(last_message_at DESC);

-- Enable Row Level Security
ALTER TABLE public.case_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for case_submissions
-- Users can view their own submissions
CREATE POLICY "Users can view their own submissions"
  ON public.case_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert their own submissions"
  ON public.case_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own submissions
CREATE POLICY "Users can update their own submissions"
  ON public.case_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
  ON public.case_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for chat_conversations
-- Users can view their own conversations
CREATE POLICY "Users can view their own conversations"
  ON public.chat_conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own conversations
CREATE POLICY "Users can insert their own conversations"
  ON public.chat_conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update their own conversations"
  ON public.chat_conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all conversations
CREATE POLICY "Admins can view all conversations"
  ON public.chat_conversations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create a view for easy querying of submissions with user info
CREATE OR REPLACE VIEW public.submissions_with_details AS
SELECT
  cs.id,
  cs.user_id,
  up.name as user_name,
  up.email as user_email,
  cs.case_id,
  c.case_code,
  c.title as case_title,
  c.level as case_level,
  cs.submission_text,
  cs.feedback_text,
  cs.score,
  cs.score_value,
  cs.difficulty_rating,
  cs.status,
  cs.submitted_at,
  cs.feedback_at,
  cs.created_at,
  cs.updated_at
FROM public.case_submissions cs
LEFT JOIN public.user_profiles up ON cs.user_id = up.id
LEFT JOIN public.cases c ON cs.case_id = c.id;

-- Grant permissions on the view
GRANT SELECT ON public.submissions_with_details TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.case_submissions IS 'Stores all user submissions for legal cases with feedback and scores';
COMMENT ON TABLE public.chat_conversations IS 'Stores all AI chatbot conversations per user per case';
COMMENT ON COLUMN public.case_submissions.score IS 'Score format: "9/10", "7/10", etc.';
COMMENT ON COLUMN public.case_submissions.score_value IS 'Normalized score (0-100) for calculations and comparisons';
COMMENT ON COLUMN public.chat_conversations.conversation_data IS 'JSONB array of message objects: [{role: "user"|"assistant", content: string, timestamp: ISO8601}]';
