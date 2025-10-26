// Claude AI Service for Legal Tutoring

import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage, ChatContext } from '../types/chat';

const SYSTEM_PROMPT = `Tu eti un asistent AI pentru studeni care îi ghideaz s rezolve singuri problemele juridice.

STIL DE COMUNICARE:
- Vorbeti informal în român, dar foloseti termeni juridici coreci
- Nu spui niciodat ce e bine sau ru, ce e corect sau greit
- Nu dai soluii directe - pui întrebri care îi fac pe studeni s gândeasc
- Foloseti întrebri socratice: "ai analizat...", "ce crezi c se întâmpl dac...", "ce text legal ar putea fi relevant aici?"

PROCESUL TU:
1. Citeti problema studentului
2. Pui întrebri care îl ghideaz spre elementele cheie: "care sunt prile implicate?", "ce aciuni s-au întâmplat?", "ce efecte juridice au aprut?"
3. Când studentul rspunde, comentezi pe rspunsul lui fr s dai soluia: "interesant c ai observat asta, ce text normativ reglementeaz situaia?", "ai identificat o parte important, dar mai verific i..."
4. Dup 3 interaciuni (întrebare-rspuns-comentariu × 3), opreti discuia astfel:

"Ok, ai primit destule indicii. Acum e timpul s pui tu soluia pe hârtie. Succes!"

IMPORTANT:
- NICIODAT nu spui "rspunsul corect este..."
- Nu dai structuri de rezolvare complete
- Nu evaluezi rspunsurile ca fiind corecte/greite
- Ghidezi prin întrebri, nu prin afirmaii
- Dup a 3-a interaciune, STOP i trimite mesajul de încheiere`;

export class ClaudeService {
  private anthropic: Anthropic;
  private interactionCount: number = 0;

  constructor() {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_CLAUDE_API_KEY is not set in environment variables');
    }
    this.anthropic = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true // Required for client-side usage
    });
  }

  resetInteractionCount() {
    this.interactionCount = 0;
  }

  getInteractionCount(): number {
    return this.interactionCount;
  }

  private buildContextMessage(context: ChatContext): string {
    if (!context.caseTitle) return '';

    const parts = [`CAZUL CURENT: ${context.caseTitle}`];

    if (context.legalProblem) {
      parts.push(`\nProblema juridic: ${context.legalProblem}`);
    }

    if (context.caseDescription) {
      parts.push(`\nSpeta: ${context.caseDescription}`);
    }

    if (context.question) {
      parts.push(`\nÎntrebarea: ${context.question}`);
    }

    if (context.articles && context.articles.length > 0) {
      parts.push(`\nArticole relevante: ${context.articles.join(', ')}`);
    }

    return parts.join('');
  }

  async sendMessage(
    messages: ChatMessage[],
    newMessage: string,
    context?: ChatContext
  ): Promise<string> {
    // Increment interaction count (user messages only)
    this.interactionCount++;

    // Check if we've reached the limit (3 rounds = 3 user messages)
    if (this.interactionCount > 3) {
      return "Ok, ai primit destule indicii. Acum e timpul s pui tu soluia pe hârtie. Succes!";
    }

    // Build the conversation history for Claude
    const conversationMessages: Anthropic.MessageParam[] = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

    // Add the new user message
    conversationMessages.push({
      role: 'user',
      content: newMessage
    });

    // Build system prompt with context
    let systemPrompt = SYSTEM_PROMPT;
    if (context) {
      const contextMsg = this.buildContextMessage(context);
      if (contextMsg) {
        systemPrompt += `\n\n${contextMsg}`;
      }
    }

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        temperature: 0.1, // Very low temperature for consistent, focused responses
        system: systemPrompt,
        messages: conversationMessages
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      return 'Ne pare ru, a aprut o problem. Încearc din nou.';
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }
}

// Singleton instance
export const claudeService = new ClaudeService();
