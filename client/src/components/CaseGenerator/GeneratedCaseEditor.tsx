import { useState } from 'react';
import { CheckCircle, Sparkles, Edit as EditIcon, AlertCircle, RefreshCw } from 'lucide-react';
import type { GeneratedCase, ArticleReference, DifficultyLevel } from '../../types/caseGenerator';
import type { CaseToSave } from '../../types/caseGenerator';
import { saveCaseToSupabase } from '../../services/saveCaseToSupabase';

interface GeneratedCaseEditorProps {
  caseData: GeneratedCase;
  caseCode: string;
  selectedArticles: ArticleReference[];
  difficultyLevel: DifficultyLevel;
  weekNumber: number;
  subcategory: string;
  onChange: (updatedCase: GeneratedCase) => void;
  onReset: () => void;
}

export const GeneratedCaseEditor = ({
  caseData,
  caseCode,
  selectedArticles,
  difficultyLevel,
  weekNumber,
  subcategory,
  onChange,
  onReset
}: GeneratedCaseEditorProps) => {
  const [editedCase, setEditedCase] = useState<GeneratedCase>(caseData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Update handlers
  const updateField = (field: keyof GeneratedCase, value: any) => {
    const updated = { ...editedCase, [field]: value };
    setEditedCase(updated);
    onChange(updated);
  };

  const updateAnalysisStep = (index: number, description: string) => {
    const steps = [...editedCase.analysis_steps];
    steps[index] = { ...steps[index], description };
    updateField('analysis_steps', steps);
  };

  const updateHint = (index: number, text: string) => {
    const hints = [...editedCase.hints];
    hints[index] = { ...hints[index], text };
    updateField('hints', hints);
  };

  const moveAnalysisStep = (index: number, direction: 'up' | 'down') => {
    const steps = [...editedCase.analysis_steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= steps.length) return;

    [steps[index], steps[targetIndex]] = [steps[targetIndex], steps[index]];

    // Renumber
    steps.forEach((step, i) => {
      step.step_number = i + 1;
    });

    updateField('analysis_steps', steps);
  };

  const moveHint = (index: number, direction: 'up' | 'down') => {
    const hints = [...editedCase.hints];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= hints.length) return;

    [hints[index], hints[targetIndex]] = [hints[targetIndex], hints[index]];

    // Renumber
    hints.forEach((hint, i) => {
      hint.hint_number = i + 1;
    });

    updateField('hints', hints);
  };

  const addAnalysisStep = () => {
    const steps = [...editedCase.analysis_steps];
    steps.push({
      step_number: steps.length + 1,
      description: ''
    });
    updateField('analysis_steps', steps);
  };

  const removeAnalysisStep = (index: number) => {
    const steps = editedCase.analysis_steps.filter((_, i) => i !== index);
    // Renumber
    steps.forEach((step, i) => {
      step.step_number = i + 1;
    });
    updateField('analysis_steps', steps);
  };

  const addHint = () => {
    const hints = [...editedCase.hints];
    hints.push({
      hint_number: hints.length + 1,
      text: ''
    });
    updateField('hints', hints);
  };

  const removeHint = (index: number) => {
    const hints = editedCase.hints.filter((_, i) => i !== index);
    // Renumber
    hints.forEach((hint, i) => {
      hint.hint_number = i + 1;
    });
    updateField('hints', hints);
  };

  // Save to Supabase
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    const dataToSave: CaseToSave = {
      case_code: caseCode,
      title: editedCase.title,
      level: difficultyLevel,
      week_number: weekNumber,
      legal_problem: editedCase.legal_problem,
      case_description: editedCase.case_description,
      question: editedCase.question,
      subcategory: subcategory || null,
      verified: false,
      articles: selectedArticles,
      analysis_steps: editedCase.analysis_steps,
      hints: editedCase.hints
    };

    try {
      await saveCaseToSupabase(dataToSave);
      setSaveSuccess(true);
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving case:', error);
      setSaveError(error instanceof Error ? error.message : 'Eroare la salvarea cazului');
      setIsSaving(false);
    }
  };

  if (saveSuccess) {
    return (
      <div className="save-success-screen">
        <div className="success-icon">
          <CheckCircle className="h-16 w-16" />
        </div>
        <h2>Caz salvat cu succes!</h2>
        <div className="success-details">
          <p><strong>Cod caz:</strong> {caseCode}</p>
          <p><strong>Status:</strong> <span className="status-badge status-unverified">Neverificat</span></p>
          <p className="success-hint">
            Cazul a fost salvat în Supabase și este disponibil pentru studenți.
            Statusul este "Neverificat" până când un expert juridic îl revizuiește.
          </p>
        </div>
        <div className="success-actions">
          <button onClick={onReset} className="btn-primary">
            <Sparkles className="inline-block h-5 w-5 mr-2" />
            Generează un caz nou
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="generated-case-editor">
      <div className="editor-header">
        <h2 className="flex items-center gap-2">
          <EditIcon className="h-6 w-6" />
          Editează cazul generat
        </h2>
        <div className="case-code-display">
          Cod: <strong>{caseCode}</strong>
          <span className="status-badge status-unverified">Neverificat</span>
        </div>
      </div>

      {saveError && (
        <div className="error-banner">
          <AlertCircle className="inline-block h-4 w-4 mr-1" />
          {saveError}
        </div>
      )}

      {/* Title */}
      <div className="editor-section">
        <label className="editor-label">Titlul cazului</label>
        <input
          type="text"
          className="editor-input"
          value={editedCase.title}
          onChange={(e) => updateField('title', e.target.value)}
        />
      </div>

      {/* Legal Problem */}
      <div className="editor-section">
        <label className="editor-label">Problema juridică</label>
        <textarea
          className="editor-textarea"
          rows={3}
          value={editedCase.legal_problem}
          onChange={(e) => updateField('legal_problem', e.target.value)}
        />
      </div>

      {/* Case Description */}
      <div className="editor-section">
        <label className="editor-label">Descrierea cazului (Speta)</label>
        <textarea
          className="editor-textarea"
          rows={8}
          value={editedCase.case_description}
          onChange={(e) => updateField('case_description', e.target.value)}
        />
        <div className="char-count">{editedCase.case_description.length} caractere</div>
      </div>

      {/* Question */}
      <div className="editor-section">
        <label className="editor-label">Întrebarea</label>
        <textarea
          className="editor-textarea"
          rows={3}
          value={editedCase.question}
          onChange={(e) => updateField('question', e.target.value)}
        />
      </div>

      {/* Analysis Steps */}
      <div className="editor-section">
        <div className="section-header">
          <label className="editor-label">Pași de analiză ({editedCase.analysis_steps.length})</label>
          <button onClick={addAnalysisStep} className="btn-add">+ Adaugă pas</button>
        </div>

        <div className="steps-list">
          {editedCase.analysis_steps.map((step, index) => (
            <div key={step.step_number} className="step-item">
              <div className="step-header">
                <span className="step-number">Pas {step.step_number}</span>
                <div className="step-actions">
                  <button
                    onClick={() => moveAnalysisStep(index, 'up')}
                    disabled={index === 0}
                    className="btn-reorder"
                    aria-label="Mută în sus"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveAnalysisStep(index, 'down')}
                    disabled={index === editedCase.analysis_steps.length - 1}
                    className="btn-reorder"
                    aria-label="Mută în jos"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeAnalysisStep(index)}
                    className="btn-remove"
                    aria-label="Șterge"
                  >
                    ×
                  </button>
                </div>
              </div>
              <textarea
                className="step-textarea"
                rows={3}
                value={step.description}
                onChange={(e) => updateAnalysisStep(index, e.target.value)}
                placeholder="Descrierea pasului de analiză..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Hints */}
      <div className="editor-section">
        <div className="section-header">
          <label className="editor-label">Indicii ({editedCase.hints.length})</label>
          <button onClick={addHint} className="btn-add">+ Adaugă indiciu</button>
        </div>

        <div className="hints-list">
          {editedCase.hints.map((hint, index) => (
            <div key={hint.hint_number} className="hint-item">
              <div className="hint-header">
                <span className="hint-number">Indiciu {hint.hint_number}</span>
                <div className="hint-actions">
                  <button
                    onClick={() => moveHint(index, 'up')}
                    disabled={index === 0}
                    className="btn-reorder"
                    aria-label="Mută în sus"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveHint(index, 'down')}
                    disabled={index === editedCase.hints.length - 1}
                    className="btn-reorder"
                    aria-label="Mută în jos"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeHint(index)}
                    className="btn-remove"
                    aria-label="Șterge"
                  >
                    ×
                  </button>
                </div>
              </div>
              <textarea
                className="hint-textarea"
                rows={2}
                value={hint.text}
                onChange={(e) => updateHint(index, e.target.value)}
                placeholder="Textul indiciului..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="editor-actions">
        <button onClick={onReset} className="btn-secondary">
          <RefreshCw className="inline-block h-5 w-5 mr-2" />
          Anulează și generează alt caz
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-save"
        >
          {isSaving ? (
            <>
              <span className="spinner"></span>
              <span>Se salvează...</span>
            </>
          ) : (
            <>
              <CheckCircle className="inline-block h-5 w-5 mr-2" />
              Trimite către Supabase
            </>
          )}
        </button>
      </div>
    </div>
  );
};
