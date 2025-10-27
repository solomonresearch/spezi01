# Case Generator Implementation Guide

## ✅ What's Been Created

### 1. Core Architecture (Complete)

**Types** (`client/src/types/caseGenerator.ts`):
- `LegalDomain`, `DifficultyLevel` types
- `CaseGeneratorState` interface
- `GeneratedCase`, `CaseToSave` interfaces
- All necessary type definitions

**Constants** (`client/src/constants/caseGeneratorData.ts`):
- 3 legal domains (Civil, Penal, Constitutional)
- 29 categories across all domains
- Difficulty options with descriptions
- Helper functions: `formatArticleReference`, `generateCaseCode`

**AI Service** (`client/src/services/caseGeneratorService.ts`):
- Claude API integration
- Structured prompt for case generation
- JSON parsing and validation
- Error handling

### 2. What Needs To Be Built

The feature requires **~2000-3000 lines of code** across multiple components. Here's the recommended implementation approach:

## 📋 Implementation Steps

### Step 1: Create Main CaseGenerator Component

```typescript
// client/src/components/CaseGenerator/index.tsx
import { useState } from 'react';
import type { CaseGeneratorState } from '../../types/caseGenerator';

export const CaseGenerator = () => {
  const [state, setState] = useState<CaseGeneratorState>({
    selectedDomain: null,
    selectedCategories: [],
    selectedArticles: [],
    topicDescription: '',
    specificFocus: '',
    difficultyLevel: 'mediu',
    weekNumber: 1,
    subcategory: '',
    isGenerating: false,
    generatedCase: null,
    caseCode: ''
  });

  const [currentStep, setCurrentStep] = useState<number>(1);

  return (
    <div className="case-generator">
      <header>
        <h1>🤖 Generator de Cazuri Juridice</h1>
        <div className="progress-steps">
          {/* Progress indicator */}
        </div>
      </header>

      {currentStep === 1 && <DomainSelector />}
      {currentStep === 2 && <CategoryGrid />}
      {currentStep === 3 && <ArticleSelector />}
      {currentStep === 4 && <ContextForm />}
      {currentStep === 5 && <ConfigurationPanel />}
      {state.generatedCase && <GeneratedCaseEditor />}
    </div>
  );
};
```

### Step 2: Create Individual Step Components

Each component file ~200-300 lines:

1. **DomainSelector.tsx** - Large cards for Civil/Penal/Constitutional
2. **CategoryGrid.tsx** - Checkboxes grid filtered by domain
3. **ArticleSelector.tsx** - Search bar + chip display
4. **ContextForm.tsx** - Two textareas with validation
5. **ConfigurationPanel.tsx** - Radio buttons + dropdowns
6. **GeneratedCaseEditor.tsx** - Full editable form with reordering

### Step 3: Create Supabase Save Service

```typescript
// client/src/services/saveCaseToSupabase.ts
import { supabase } from '../lib/supabase';
import type { CaseToSave } from '../types/caseGenerator';

export async function saveCaseToSupabase(caseData: CaseToSave): Promise<string> {
  // 1. Insert into cases table
  const { data: caseRow, error: caseError } = await supabase
    .from('cases')
    .insert({
      case_code: caseData.case_code,
      title: caseData.title,
      level: caseData.level,
      week_number: caseData.week_number,
      legal_problem: caseData.legal_problem,
      case_description: caseData.case_description,
      question: caseData.question,
      subcategory: caseData.subcategory,
      verified: false
    })
    .select('id')
    .single();

  if (caseError) throw caseError;
  const caseId = caseRow.id;

  // 2. Insert articles
  if (caseData.articles.length > 0) {
    await supabase.from('case_articles').insert(
      caseData.articles.map(art => ({
        case_id: caseId,
        article_number: art.number,
        article_reference: art.reference
      }))
    );
  }

  // 3. Insert analysis steps
  if (caseData.analysis_steps.length > 0) {
    await supabase.from('case_analysis_steps').insert(
      caseData.analysis_steps.map(step => ({
        case_id: caseId,
        step_number: step.step_number,
        step_description: step.description
      }))
    );
  }

  // 4. Insert hints
  if (caseData.hints.length > 0) {
    await supabase.from('case_hints').insert(
      caseData.hints.map(hint => ({
        case_id: caseId,
        hint_number: hint.hint_number,
        hint_text: hint.text
      }))
    );
  }

  return caseData.case_code;
}
```

### Step 4: Add to Admin Panel

```typescript
// In client/src/components/AdminPanel.tsx
import { useNavigate } from 'react-router-dom';

// Add button in header:
<button
  onClick={() => navigate('/case-generator')}
  className="btn-case-generator"
  style={{
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '12px 24px'
  }}
>
  🤖 GENERATOR DE CAZURI
</button>
```

### Step 5: Add Route

```typescript
// In client/src/App.tsx
import { CaseGenerator } from './components/CaseGenerator';

<Route
  path="/case-generator"
  element={
    <ProtectedRoute>
      <CaseGenerator />
    </ProtectedRoute>
  }
/>
```

### Step 6: Add CSS Styling

Add to `client/src/App.css`:

```css
/* Case Generator Styles */
.case-generator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.domain-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 40px 0;
}

.domain-card {
  padding: 40px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.domain-card:hover {
  border-color: #1e40af;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.domain-card.selected {
  border-color: #1e40af;
  background: #eff6ff;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 20px 0;
}

.category-checkbox {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
}

.article-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.article-chip {
  background: #1e40af;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.btn-generate {
  background: #059669;
  color: white;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-generate:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.generated-case-editor {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 600;
}

.status-unverified {
  background: #fee2e2;
  color: #dc2626;
}

.analysis-step-item {
  display: flex;
  gap: 12px;
  margin: 12px 0;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.reorder-buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
```

## 🎯 Validation Rules

Implement in a separate validation file:

```typescript
// client/src/utils/caseValidation.ts
export function validateCaseGenerator(state: CaseGeneratorState): string[] {
  const errors: string[] = [];

  if (!state.selectedDomain) {
    errors.push('Selectează un domeniu juridic');
  }

  if (state.selectedCategories.length === 0) {
    errors.push('Selectează cel puțin o categorie');
  }

  if (state.selectedArticles.length === 0) {
    errors.push('Adaugă cel puțin un articol');
  }

  if (state.topicDescription.length < 50) {
    errors.push('Descrierea contextului trebuie să aibă minim 50 caractere');
  }

  return errors;
}

export function validateGeneratedCase(caseData: CaseToSave): string[] {
  const errors: string[] = [];

  if (!caseData.title || caseData.title.length < 10) {
    errors.push('Titlul trebuie să aibă minim 10 caractere');
  }

  if (caseData.case_description.length < 100) {
    errors.push('Descrierea cazului trebuie să aibă minim 100 caractere');
  }

  if (caseData.analysis_steps.length < 2) {
    errors.push('Trebuie să existe cel puțin 2 pași de analiză');
  }

  if (caseData.hints.length < 1) {
    errors.push('Trebuie să existe cel puțin un indiciu');
  }

  return errors;
}
```

## 🚀 Quick Start After Implementation

1. Login as admin user
2. Go to Admin Panel
3. Click "🤖 GENERATOR DE CAZURI"
4. Follow 5-step wizard
5. Review and edit generated case
6. Click "✅ Trimite către Supabase"

## 📊 Database Impact

Each generated case creates:
- 1 row in `cases` table
- N rows in `case_articles` (typically 3-6)
- N rows in `case_analysis_steps` (typically 3-6)
- N rows in `case_hints` (typically 2-4)

All cases are created with `verified = false`.

## 🔧 Estimated Implementation Time

- Core components: 8-12 hours
- UI/UX polish: 4-6 hours
- Testing: 2-3 hours
- **Total: 14-21 hours**

## 📝 Next Steps

1. Create component files in `client/src/components/CaseGenerator/`
2. Implement step-by-step wizard logic
3. Add form validation
4. Implement Supabase save
5. Add CSS styling
6. Test with various inputs
7. Document admin user guide

The foundation is ready - the AI service, types, and constants are complete!
