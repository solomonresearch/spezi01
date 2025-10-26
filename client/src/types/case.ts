// Types for legal cases (Spete)

export interface Case {
  id: string;
  title: string;
  case_code: string;
  verified: boolean;
  level: 'Ușor' | 'Mediu' | 'Dificil' | 'ușor' | 'mediu' | 'dificil';
  week_number: number;
  subcategory?: string;
  legal_problem: string;
  case_description: string;
  question: string;
  created_at: string;
  updated_at: string;
}

export interface CaseArticle {
  id: string;
  case_id: string;
  article_number: string;
  article_reference: string;
  created_at: string;
}

export interface CaseAnalysisStep {
  id: string;
  case_id: string;
  step_number: number;
  step_description: string;
  created_at: string;
}

export interface CaseHint {
  id: string;
  case_id: string;
  hint_number: number;
  hint_text: string;
  created_at: string;
}

export interface CaseComplete extends Case {
  articles: string[];
  analysis_steps: string[];
  hints: string[];
}

export interface CasesGrouped {
  easy: Case[];
  medium: Case[];
  hard: Case[];
}
