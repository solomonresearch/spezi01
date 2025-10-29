-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.case_analysis_steps (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  case_id uuid NOT NULL,
  step_number integer NOT NULL,
  step_description text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT case_analysis_steps_pkey PRIMARY KEY (id),
  CONSTRAINT case_analysis_steps_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id)
);
CREATE TABLE public.case_articles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  case_id uuid NOT NULL,
  article_number text NOT NULL,
  article_reference text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT case_articles_pkey PRIMARY KEY (id),
  CONSTRAINT case_articles_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id)
);
CREATE TABLE public.case_hints (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  case_id uuid NOT NULL,
  hint_number integer NOT NULL,
  hint_text text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT case_hints_pkey PRIMARY KEY (id),
  CONSTRAINT case_hints_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id)
);
CREATE TABLE public.case_submissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  case_id uuid NOT NULL,
  submission_text text NOT NULL,
  feedback_text text,
  score text,
  score_value numeric,
  difficulty_rating integer CHECK (difficulty_rating >= 1 AND difficulty_rating <= 10),
  status text NOT NULL DEFAULT 'submitted'::text CHECK (status = ANY (ARRAY['submitted'::text, 'graded'::text, 'revised'::text])),
  submitted_at timestamp with time zone DEFAULT now(),
  feedback_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT case_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT case_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT case_submissions_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id)
);
CREATE TABLE public.cases (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  level text NOT NULL CHECK (level = ANY (ARRAY['ușor'::text, 'mediu'::text, 'dificil'::text, 'Ușor'::text, 'Mediu'::text, 'Dificil'::text])),
  week_number integer NOT NULL,
  legal_problem text NOT NULL,
  case_description text NOT NULL,
  question text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  subcategory text,
  verified boolean DEFAULT false,
  case_code text NOT NULL UNIQUE,
  category text,
  CONSTRAINT cases_pkey PRIMARY KEY (id)
);
CREATE TABLE public.chat_conversations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  case_id uuid,
  conversation_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  message_count integer DEFAULT 0,
  started_at timestamp with time zone DEFAULT now(),
  last_message_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_conversations_pkey PRIMARY KEY (id),
  CONSTRAINT chat_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT chat_conversations_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id)
);
CREATE TABLE public.code_types (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  code_id character varying NOT NULL UNIQUE,
  code_name_ro character varying NOT NULL,
  code_name_en character varying NOT NULL,
  icon character varying,
  description text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT code_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  email text,
  body text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT feedback_pkey PRIMARY KEY (id),
  CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  name text NOT NULL,
  username text NOT NULL UNIQUE,
  university_code text NOT NULL,
  university_category text NOT NULL CHECK (university_category = ANY (ARRAY['Public'::text, 'Private'::text, 'Other'::text])),
  university_name text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_admin boolean NOT NULL DEFAULT false,
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_progress (
  user_id uuid NOT NULL,
  total_points integer DEFAULT 0,
  total_cases_attempted integer DEFAULT 0,
  total_cases_passed integer DEFAULT 0,
  total_solutions_submitted integer DEFAULT 0,
  average_score numeric,
  best_score integer,
  total_chat_messages integer DEFAULT 0,
  total_chat_sessions integer DEFAULT 0,
  last_active_at timestamp with time zone,
  current_streak_days integer DEFAULT 0,
  longest_streak_days integer DEFAULT 0,
  last_activity_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_progress_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
