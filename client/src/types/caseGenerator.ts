// Types for Case Generator Module

export type LegalDomain = 'civil' | 'penal' | 'constitutional';

export type DifficultyLevel = 'usor' | 'mediu' | 'dificil';

export interface DomainOption {
  id: LegalDomain;
  name: string;
  icon: string;
}

export interface CategoryOption {
  id: string;
  name: string;
  domain: LegalDomain;
}

export interface ArticleReference {
  number: string;
  reference: string;
  domain: LegalDomain;
}

export interface AnalysisStep {
  step_number: number;
  description: string;
}

export interface Hint {
  hint_number: number;
  text: string;
}

export interface GeneratedCase {
  title: string;
  legal_problem: string;
  case_description: string;
  question: string;
  analysis_steps: AnalysisStep[];
  hints: Hint[];
}

export interface CaseGeneratorState {
  // Step 1: Domain
  selectedDomain: LegalDomain | null;

  // Step 2: Categories
  selectedCategories: string[];

  // Step 3: Articles
  selectedArticles: ArticleReference[];

  // Step 4: Context
  topicDescription: string;
  specificFocus: string;

  // Step 5: Configuration
  difficultyLevel: DifficultyLevel;
  weekNumber: number;
  subcategory: string;

  // Generation state
  isGenerating: boolean;
  generatedCase: GeneratedCase | null;

  // Edit state
  caseCode: string;
}

export interface CaseToSave {
  // Main case data
  case_code: string;
  title: string;
  level: string;
  week_number: number;
  legal_problem: string;
  case_description: string;
  question: string;
  subcategory: string | null;
  verified: boolean;

  // Related data
  articles: ArticleReference[];
  analysis_steps: AnalysisStep[];
  hints: Hint[];
}
