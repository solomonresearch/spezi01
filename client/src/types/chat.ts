// Types for AI chat functionality

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatContext {
  caseTitle?: string;
  caseDescription?: string;
  legalProblem?: string;
  question?: string;
  articles?: string[];
}
