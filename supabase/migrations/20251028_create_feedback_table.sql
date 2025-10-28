-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

-- Create index on user_id for filtering
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback (even anonymous users)
CREATE POLICY "Anyone can submit feedback"
  ON public.feedback
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Allow admins to view all feedback
CREATE POLICY "Admins can view all feedback"
  ON public.feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Allow users to view their own feedback
CREATE POLICY "Users can view their own feedback"
  ON public.feedback
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add comment to table
COMMENT ON TABLE public.feedback IS 'Stores user feedback submissions';
COMMENT ON COLUMN public.feedback.user_id IS 'Reference to the user who submitted feedback (null for anonymous)';
COMMENT ON COLUMN public.feedback.email IS 'Email address provided by user (for anonymous feedback or if user wants different contact)';
COMMENT ON COLUMN public.feedback.body IS 'Feedback message content';
