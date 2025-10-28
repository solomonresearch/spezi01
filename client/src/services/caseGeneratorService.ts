// Case Generator Service - AI Integration with Claude

import Anthropic from '@anthropic-ai/sdk';
import type { GeneratedCase, CaseGeneratorState, LegalDomain } from '../types/caseGenerator';

const CASE_GENERATION_PROMPT = `Ești un expert juridic român specializat în generarea de cazuri practice pentru studenții la drept.

DOMENIU: {domain}
CATEGORII: {categories}
ARTICOLE: {articles}
NIVEL DIFICULTATE: {difficulty}
SĂPTĂMÂNĂ: {week}

CONTEXT:
{context}

FOCUS SPECIFIC:
{focus}

Generează un caz juridic complet în limba română cu următoarele secțiuni:

1. TITLU (10-15 cuvinte, descriptiv și captivant)

2. PROBLEMA JURIDICĂ (2-3 propoziții care rezumă esența problemei juridice)

3. DESCRIEREA CAZULUI (Speta completă):
   - 250-400 de cuvinte
   - Nume românești realiste, locații, date
   - Fapte clare care angajează articolele specificate
   - Include detalii relevante pentru nivelul de dificultate {difficulty}
   - Scris în limbaj juridic formal românesc
   - Folosește contextul specific: {context}

4. ÎNTREBARE (Întrebare juridică specifică care necesită analiza articolelor)

5. PAȘI DE ANALIZĂ (3-6 pași numerotați):
   - Progresie logică pentru rezolvarea cazului
   - Referințe la articole specifice
   - Complexitate potrivită pentru nivelul {difficulty}

6. INDICII (2-4 indicii progresive):
   - Începe general, devino mai specific
   - Ghidează fără a da răspunsul complet
   - Referințe la principii juridice relevante

IMPORTANT:
- Folosește doar articolele menționate: {articles}
- Respectă nivelul de dificultate: {difficulty}
- Fie coerent cu categoriile: {categories}
- Fie creativ dar realist
- Folosește limbaj juridic corect

Răspunde DOAR cu un obiect JSON valid în acest format exact:
{
  "title": "...",
  "legal_problem": "...",
  "case_description": "...",
  "question": "...",
  "analysis_steps": [
    {"step_number": 1, "description": "..."},
    {"step_number": 2, "description": "..."}
  ],
  "hints": [
    {"hint_number": 1, "text": "..."},
    {"hint_number": 2, "text": "..."}
  ]
}`;

const CLASSIFICATION_PROMPT = `Ești un expert juridic român. Analizează următorul caz juridic și clasifică-l în categoriile și subcategoriile potrivite.

CATEGORII DISPONIBILE (civil):
{categories}

SUBCATEGORII DISPONIBILE (civil):
{subcategories}

CAZUL DE ANALIZAT:
Titlu: {title}
Problema juridică: {legal_problem}
Descriere: {case_description}

Analizează cazul și răspunde DOAR cu un obiect JSON în acest format exact:
{
  "category": "ID-ul categoriei potrivite (ex: civil_persons)",
  "subcategory": "Subcategoria potrivită din listă sau null"
}`;

class CaseGeneratorService {
  private anthropic: Anthropic;

  constructor() {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_CLAUDE_API_KEY is not set');
    }
    this.anthropic = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  private getDomainName(domain: LegalDomain): string {
    switch (domain) {
      case 'civil':
        return 'Drept Civil';
      case 'penal':
        return 'Drept Penal';
      case 'constitutional':
        return 'Drept Constituțional';
    }
  }

  private getDifficultyLabel(difficulty: string): string {
    switch (difficulty) {
      case 'usor':
        return 'Ușor';
      case 'mediu':
        return 'Mediu';
      case 'dificil':
        return 'Dificil';
      default:
        return difficulty;
    }
  }

  async generateCase(state: CaseGeneratorState): Promise<GeneratedCase> {
    if (!state.selectedDomain) {
      throw new Error('Domeniul nu este selectat');
    }

    const domainName = this.getDomainName(state.selectedDomain);
    const categories = state.selectedCategories.join(', ');
    const articles = state.selectedArticles.map(a => a.reference).join(', ');
    const difficulty = this.getDifficultyLabel(state.difficultyLevel);

    const prompt = CASE_GENERATION_PROMPT
      .replace(/{domain}/g, domainName)
      .replace(/{categories}/g, categories)
      .replace(/{articles}/g, articles)
      .replace(/{difficulty}/g, difficulty)
      .replace(/{week}/g, state.weekNumber.toString())
      .replace(/{context}/g, state.topicDescription)
      .replace(/{focus}/g, state.specificFocus || 'Niciun focus specific menționat');

    try {
      console.log('🤖 Generating case with Claude...');

      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Response nu este text');
      }

      // Extract JSON from response (handle markdown code blocks)
      let jsonText = content.text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7);
      }
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.slice(0, -3);
      }
      jsonText = jsonText.trim();

      const generated: GeneratedCase = JSON.parse(jsonText);

      // Validate structure
      if (!generated.title || !generated.case_description || !generated.question) {
        throw new Error('Generated case missing required fields');
      }

      console.log('✅ Case generated successfully');
      return generated;

    } catch (error) {
      console.error('❌ Error generating case:', error);
      if (error instanceof SyntaxError) {
        throw new Error('Eroare la parsarea răspunsului AI. Încearcă din nou.');
      }
      throw new Error('Eroare la generarea cazului. Verifică conexiunea și încearcă din nou.');
    }
  }

  /**
   * Classify a generated case into appropriate category and subcategory
   */
  async classifyCase(
    generatedCase: GeneratedCase,
    availableCategories: { id: string; name: string }[],
    availableSubcategories: string[]
  ): Promise<{ category: string | null; subcategory: string | null }> {
    try {
      console.log('🤖 Classifying case with AI...');

      const categoriesList = availableCategories.map(c => `- ${c.id}: ${c.name}`).join('\n');
      const subcategoriesList = availableSubcategories.map(s => `- ${s}`).join('\n');

      const prompt = CLASSIFICATION_PROMPT
        .replace('{categories}', categoriesList)
        .replace('{subcategories}', subcategoriesList)
        .replace('{title}', generatedCase.title)
        .replace('{legal_problem}', generatedCase.legal_problem)
        .replace('{case_description}', generatedCase.case_description);

      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Response nu este text');
      }

      // Extract JSON from response
      let jsonText = content.text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7);
      }
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.slice(0, -3);
      }
      jsonText = jsonText.trim();

      const classification = JSON.parse(jsonText);

      console.log('✅ Case classified:', classification);
      return {
        category: classification.category || null,
        subcategory: classification.subcategory || null
      };

    } catch (error) {
      console.error('❌ Error classifying case:', error);
      // Return null values if classification fails - don't block the generation
      return { category: null, subcategory: null };
    }
  }
}

export const caseGeneratorService = new CaseGeneratorService();
