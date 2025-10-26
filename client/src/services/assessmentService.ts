// Assessment Service for Legal Case Solutions

import Anthropic from '@anthropic-ai/sdk';

const AI_DETECTION_PROMPT = `Ești un expert în detectarea conținutului generat de inteligența artificială în texte juridice academice românești.

Analizează următorul text al unui student și determină dacă a fost scris de un om sau generat/asistat semnificativ de AI.

INDICATORI DE CONȚINUT GENERAT DE AI:
- Structură prea perfectă și repetitivă
- Utilizare excesivă a frazelor de tranziție generice
- Lipsa erorilor tipice umane (typos minori, mici inconsistențe stilistice)
- Ton uniform fără variații naturale
- Formulări generice și impersonale
- Enumerări exhaustive și sistematice artificiale
- Lipsa unei "voci" personale distinctive
- Utilizarea constantă a acelorași conectori logici
- Paragrafe de lungime aproape identică
- Argumentare prea echilibrată și "polisată"
- Utilizarea unor expresii tipice AI în limba română

INDICATORI DE CONȚINUT SCRIS DE OM:
- Mici erori de tastare sau formulare
- Stil personal recognoscibil
- Variații naturale în lungimea frazelor
- Argumente care reflectă gândire personală
- Inconsistențe minore stilistice
- Formulări mai puțin "perfecte" dar autentice
- Ton care variază natural
- Expresii colloquiale sau regionale

SARCINA TA:
Analizează textul și estimează procentul de conținut care pare a fi generat de AI.

RĂSPUNDE OBLIGATORIU ÎN ACEST FORMAT:

**VERIFICARE AI**
**Probabilitate conținut AI: [X]%**
**Decizie: [PASSED/FAILED]**

**Justificare:**
[2-3 propoziții explicând de ce ai ajuns la această concluzie, citând exemple concrete din text]`;

const LEGAL_ASSESSMENT_PROMPT_TEMPLATE = `Ești un profesor universitar de drept cu experiență vastă în evaluarea rezolvărilor de cazuri juridice.
Trebuie să evaluezi soluția unui student la un caz juridic, având în vedere NIVELUL DE EXIGENȚĂ: ##NIVEL##.

CRITERII DE EVALUARE (Total: 100 puncte):

I. OPERAȚIUNI INTELECTUALE (40 puncte):

1.1. Citirea și înțelegerea enunțului (5 puncte)
    - Nivelul 1 🔨: Înțelegere de bază a faptelor principale
    - Nivelul 3 🔨🔨🔨: Înțelegere completă cu identificarea tuturor elementelor
    - Nivelul 5 🔨🔨🔨🔨🔨: Înțelegere profundă cu captarea nuanțelor și subtilităților

1.2. Identificarea elementelor esențiale și filtrarea celor neesențiale (8 puncte)
    - Nivelul 1 🔨: Identifică majoritatea elementelor principale
    - Nivelul 3 🔨🔨🔨: Identifică toate elementele esențiale și elimină corect pe cele irrelevante
    - Nivelul 5 🔨🔨🔨🔨🔨: Identificare perfectă cu justificare explicită a filtrării

1.3. Ordonarea cronologică a elementelor (5 puncte)
    - Nivelul 1 🔨: Ordine aproximativă, logică de bază
    - Nivelul 3 🔨🔨🔨: Ordine cronologică clară și logică
    - Nivelul 5 🔨🔨🔨🔨🔨: Ordine impecabilă cu conexiuni cauzale explicite

1.4. Rezumatul faptelor esențiale (7 puncte)
    - Nivelul 1 🔨: Rezumat parțial care acoperă elementele de bază
    - Nivelul 3 🔨🔨🔨: Rezumat complet, concis și precis
    - Nivelul 5 🔨🔨🔨🔨🔨: Rezumat sintetic, perfect relevant juridic

1.5. Calificarea juridică a faptelor (10 puncte)
    - Nivelul 1 🔨: Calificare de bază cu concepte juridice elementare
    - Nivelul 3 🔨🔨🔨: Calificare corectă cu terminologie juridică precisă
    - Nivelul 5 🔨🔨🔨🔨🔨: Calificare impecabilă cu distincții doctrinare și jurisprudențiale

1.6. Determinarea problemei juridice (5 puncte)
    - Nivelul 1 🔨: Identifică problema juridică principală
    - Nivelul 3 🔨🔨🔨: Identifică toate problemele juridice relevante
    - Nivelul 5 🔨🔨🔨🔨🔨: Identifică probleme principale + implicații conexe și secundare

II. REDACTAREA SOLUȚIEI (60 puncte):

2.1. INTRODUCERE (10 puncte):

2.1.1. Prezentarea pe scurt a faptelor esențiale reținute (3 puncte)
2.1.2. Calificarea juridică a faptelor (4 puncte)
2.1.3. Enunțarea problemelor juridice (3 puncte)

Cerințe pe niveluri:
    - Nivelul 1 🔨: Structură de bază prezentă, informații minime
    - Nivelul 3 🔨🔨🔨: Structură completă, clară și bine organizată
    - Nivelul 5 🔨🔨🔨🔨🔨: Structură elegantă, profesională, stil juridic impecabil

2.2. ANALIZA PRIN SILOGISM (50 puncte):

2.2.1. Premisa majoră - Expunerea regulilor de drept aplicabile (20 puncte)

    - Nivelul 1 🔨: Citează textele legale relevante (minim necesar)
    - Nivelul 3 🔨🔨🔨: Texte legale + explicații + jurisprudență relevantă
    - Nivelul 5 🔨🔨🔨🔨🔨: Texte + jurisprudență constantă + doctrină + interpretări evolutive

    Evaluează:
    • Corectitudinea izvoarelor citate (5p)
    • Relevanța regulilor selectate pentru problema juridică (5p)
    • Completitudinea expunerii normative (5p)
    • Calitatea referințelor jurisprudențiale și doctrinare (5p)

2.2.2. Premisa minoră - Prezentarea situației de fapt în contextul regulilor juridice (15 puncte)

    - Nivelul 1 🔨: Prezentare simplă a faptelor
    - Nivelul 3 🔨🔨🔨: Contextualizare juridică clară a faptelor
    - Nivelul 5 🔨🔨🔨🔨🔨: Analiză rafinată a corespondențelor fapt-drept

    Evaluează:
    • Claritatea prezentării faptelor în termeni juridici (5p)
    • Conectarea precisă a faptelor cu regulile de drept (5p)
    • Identificarea și discutarea elementelor probatorii (5p)

2.2.3. Concluzia silogismului - Răspunsul la problema juridică (15 puncte)

    - Nivelul 1 🔨: Răspuns direct la problemă
    - Nivelul 3 🔨🔨🔨: Răspuns motivat logic și complet
    - Nivelul 5 🔨🔨🔨🔨🔨: Răspuns exhaustiv cu discutarea soluțiilor alternative

    Evaluează:
    • Logica și rigoarea argumentației juridice (5p)
    • Claritatea și precizia răspunsului (5p)
    • Completitudinea soluției propuse (5p)

INSTRUCȚIUNI DE EVALUARE:

1. Analizează soluția studentului secțiune cu secțiune conform structurii de mai sus
2. Pentru fiecare criteriu, acordă punctaj în funcție de nivelul de exigență selectat
3. Oferă feedback constructiv, specific și acționabil pentru fiecare secțiune
4. Identifică clar punctele forte și punctele slabe
5. Sugerează îmbunătățiri concrete și exemple practice
6. Fii obiectiv dar constructiv - scopul este învățarea

FORMAT RĂSPUNS (OBLIGATORIU):

**EVALUARE SOLUȚIE JURIDICĂ**

**PUNCTAJ TOTAL: [X]/100**
**NIVELUL DE EXIGENȚĂ APLICAT: [Număr] [Emoji ciocane]**

---

**I. OPERAȚIUNI INTELECTUALE: [X]/40 puncte**

**1.1. Citirea și înțelegerea enunțului: [X]/5**
[Feedback specific]

**1.2. Identificarea elementelor esențiale: [X]/8**
[Feedback specific]

**1.3. Ordonarea cronologică: [X]/5**
[Feedback specific]

**1.4. Rezumatul faptelor esențiale: [X]/7**
[Feedback specific]

**1.5. Calificarea juridică a faptelor: [X]/10**
[Feedback specific]

**1.6. Determinarea problemei juridice: [X]/5**
[Feedback specific]

---

**II. REDACTAREA SOLUȚIEI: [X]/60 puncte**

**2.1. INTRODUCERE: [X]/10**
- Prezentarea faptelor: [X]/3
- Calificarea juridică: [X]/4
- Enunțarea problemelor: [X]/3
[Feedback specific]

**2.2. ANALIZA PRIN SILOGISM: [X]/50**

**2.2.1. Premisa majoră (Regulile de drept): [X]/20**
- Corectitudinea izvoarelor: [X]/5
- Relevanța regulilor: [X]/5
- Completitudinea expunerii: [X]/5
- Referințe jurisprudențiale/doctrinare: [X]/5
[Feedback specific]

**2.2.2. Premisa minoră (Situația de fapt): [X]/15**
- Claritatea prezentării: [X]/5
- Conectarea fapt-drept: [X]/5
- Elemente probatorii: [X]/5
[Feedback specific]

**2.2.3. Concluzia silogismului: [X]/15**
- Logica argumentației: [X]/5
- Claritatea răspunsului: [X]/5
- Completitudinea soluției: [X]/5
[Feedback specific]

---

**PUNCTE FORTE:**
- [Punct fort 1]
- [Punct fort 2]
- [Punct fort 3]

**PUNCTE SLABE:**
- [Punct slab 1]
- [Punct slab 2]
- [Punct slab 3]

**RECOMANDĂRI DE ÎMBUNĂTĂȚIRE:**
1. [Recomandare concretă 1]
2. [Recomandare concretă 2]
3. [Recomandare concretă 3]

**COMENTARIU GENERAL:**
[Evaluare calitativă de 2-3 paragrafe care sintetizează calitatea generală a soluției, progresele observate și direcțiile de dezvoltare]

---

**NOTĂ FINALĂ:** [Clasificare: Excelent 90-100 / Foarte bine 80-89 / Bine 70-79 / Satisfăcător 60-69 / Nesatisfăcător <60]

Acum evaluează următoarea soluție a studentului:

##SOLUTIE##`;

interface AIDetectionResult {
  probability: number;
  passed: boolean;
  justification: string;
}

export class AssessmentService {
  private anthropic: Anthropic;

  constructor() {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_CLAUDE_API_KEY is not set in environment variables');
    }
    this.anthropic = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async detectAI(solutionText: string): Promise<AIDetectionResult> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        temperature: 0.3,
        system: AI_DETECTION_PROMPT,
        messages: [{
          role: 'user',
          content: `TEXT DE ANALIZAT:\n\n${solutionText}`
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const text = content.text;

        // Parse the probability
        const probMatch = text.match(/Probabilitate conținut AI:\s*(\d+)%/);
        const probability = probMatch ? parseInt(probMatch[1], 10) : 0;

        // Parse the decision
        const decisionMatch = text.match(/Decizie:\s*(PASSED|FAILED)/);
        const passed = decisionMatch ? decisionMatch[1] === 'PASSED' : probability <= 30;

        // Extract justification
        const justMatch = text.match(/Justificare:\s*(.+?)(?:\n\n|$)/s);
        const justification = justMatch ? justMatch[1].trim() : text;

        return {
          probability,
          passed,
          justification
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error detecting AI:', error);
      throw error;
    }
  }

  async assessSolution(solutionText: string, difficultyLevel: 1 | 3 | 5): Promise<string> {
    try {
      const levelLabel = difficultyLevel === 1 ? '1 🔨' : difficultyLevel === 3 ? '3 🔨🔨🔨' : '5 🔨🔨🔨🔨🔨';
      const prompt = LEGAL_ASSESSMENT_PROMPT_TEMPLATE
        .replace('##NIVEL##', levelLabel)
        .replace('##SOLUTIE##', solutionText);

      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        temperature: 0.2,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      return 'Ne pare rău, a apărut o problemă. Încearcă din nou.';
    } catch (error) {
      console.error('Error assessing solution:', error);
      throw error;
    }
  }
}

// Singleton instance
export const assessmentService = new AssessmentService();
