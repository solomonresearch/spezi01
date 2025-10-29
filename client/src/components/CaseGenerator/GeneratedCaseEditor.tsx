import { useState } from 'react';
import { CheckCircle, Sparkles, SquarePen, AlertCircle, RefreshCw, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { GeneratedCase, ArticleReference, DifficultyLevel, LegalDomain } from '../../types/caseGenerator';
import type { CaseToSave } from '../../types/caseGenerator';
import { saveCaseToSupabase } from '../../services/saveCaseToSupabase';
import { CATEGORIES, CIVIL_SUBCATEGORIES, CONSTITUTIONAL_SUBCATEGORIES } from '../../constants/caseGeneratorData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GeneratedCaseEditorProps {
  caseData: GeneratedCase;
  caseCode: string;
  selectedArticles: ArticleReference[];
  selectedCategories: string[];
  selectedDomain: LegalDomain;
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
  selectedCategories,
  selectedDomain,
  difficultyLevel,
  weekNumber,
  subcategory,
  onChange,
  onReset
}: GeneratedCaseEditorProps) => {
  const [editedCase, setEditedCase] = useState<GeneratedCase>(caseData);
  const [editedCaseCode, setEditedCaseCode] = useState(caseCode);

  // Get available categories for the selected domain
  const availableCategories = CATEGORIES.filter(c => c.domain === selectedDomain);

  // Get subcategories based on domain
  const availableSubcategories =
    selectedDomain === 'civil' ? CIVIL_SUBCATEGORIES :
    selectedDomain === 'constitutional' ? CONSTITUTIONAL_SUBCATEGORIES :
    [];

  // Initialize category with NAME (not ID)
  const initialCategory = selectedCategories[0]
    ? availableCategories.find(c => c.id === selectedCategories[0])?.name || ''
    : '';

  const [editedCategory, setEditedCategory] = useState<string>(initialCategory);
  const [editedSubcategory, setEditedSubcategory] = useState<string>(subcategory || '');
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
    // Validate required fields
    const errors: string[] = [];

    if (!editedCaseCode.trim()) {
      errors.push('Codul cazului este obligatoriu');
    }
    if (!editedCase.title.trim()) {
      errors.push('Titlul este obligatoriu');
    }
    if (!editedCase.legal_problem.trim()) {
      errors.push('Problema juridică este obligatorie');
    }
    if (!editedCase.case_description.trim()) {
      errors.push('Descrierea cazului este obligatorie');
    }
    if (!editedCase.question.trim()) {
      errors.push('Întrebarea este obligatorie');
    }
    if (!editedSubcategory && (selectedDomain === 'civil' || selectedDomain === 'constitutional')) {
      const domainName = selectedDomain === 'civil' ? 'civile' : 'constituționale';
      errors.push(`Subcategoria este obligatorie pentru cazuri ${domainName}`);
    }
    // Check for valid analysis steps (not empty)
    const validSteps = editedCase.analysis_steps.filter(step => step.description && step.description.trim().length > 0);
    if (validSteps.length === 0) {
      errors.push('Cel puțin un pas de analiză cu conținut este obligatoriu');
    }

    // Check for valid hints (not empty)
    const validHints = editedCase.hints.filter(hint => hint.text && hint.text.trim().length > 0);
    if (validHints.length === 0) {
      errors.push('Cel puțin un indiciu cu conținut este obligatoriu');
    }

    if (errors.length > 0) {
      setSaveError(errors.join('. '));
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const dataToSave: CaseToSave = {
      case_code: editedCaseCode.trim().toUpperCase(),
      title: editedCase.title.trim(),
      level: difficultyLevel,
      week_number: weekNumber,
      legal_problem: editedCase.legal_problem.trim(),
      case_description: editedCase.case_description.trim(),
      question: editedCase.question.trim(),
      category: editedCategory || null,
      subcategory: editedSubcategory || null,
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
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardContent className="pt-8 pb-6 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-20 w-20 text-green-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Caz salvat cu succes!</h2>
            <div className="space-y-1 text-muted-foreground">
              <p className="flex items-center justify-center gap-2">
                <strong className="text-foreground">Cod caz:</strong>
                <Badge variant="outline" className="font-mono text-base">{editedCaseCode}</Badge>
              </p>
              <p className="flex items-center justify-center gap-2">
                <strong className="text-foreground">Status:</strong>
                <Badge variant="secondary" className="bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100">
                  Neverificat
                </Badge>
              </p>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto pt-2">
              Cazul a fost salvat în Supabase și este disponibil pentru studenți.
              Statusul este "Neverificat" până când un expert juridic îl revizuiește.
            </p>
          </div>
          <Button onClick={onReset} className="gap-2" size="lg">
            <Sparkles className="h-5 w-5" />
            Generează un caz nou
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <SquarePen className="h-6 w-6" />
            Editează cazul generat
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Label htmlFor="case-code" className="text-sm font-medium whitespace-nowrap">
                Cod caz:
              </Label>
              <Input
                id="case-code"
                value={editedCaseCode}
                onChange={(e) => setEditedCaseCode(e.target.value.toUpperCase())}
                className="font-mono font-semibold w-32"
                placeholder="CIV1ABC"
              />
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100 whitespace-nowrap">
              Neverificat
            </Badge>
          </div>
        </div>

        {saveError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Titlul cazului</Label>
          <Input
            id="title"
            value={editedCase.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Titlu descriptiv și captivant..."
          />
        </div>

        {/* Legal Problem */}
        <div className="space-y-2">
          <Label htmlFor="legal-problem">Problema juridică</Label>
          <Textarea
            id="legal-problem"
            rows={3}
            value={editedCase.legal_problem}
            onChange={(e) => updateField('legal_problem', e.target.value)}
            placeholder="Rezumat al problemei juridice..."
          />
        </div>

        {/* Case Description */}
        <div className="space-y-2">
          <Label htmlFor="case-description">Descrierea cazului (Speta)</Label>
          <Textarea
            id="case-description"
            rows={8}
            value={editedCase.case_description}
            onChange={(e) => updateField('case_description', e.target.value)}
            placeholder="Descrierea completă a cazului..."
            className="resize-y"
          />
          <p className="text-xs text-muted-foreground text-right">
            {editedCase.case_description.length} caractere
          </p>
        </div>

        {/* Question */}
        <div className="space-y-2">
          <Label htmlFor="question">Întrebarea</Label>
          <Textarea
            id="question"
            rows={3}
            value={editedCase.question}
            onChange={(e) => updateField('question', e.target.value)}
            placeholder="Întrebarea juridică pentru student..."
          />
        </div>

        {/* Category and Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="space-y-2">
            <Label htmlFor="category">
              Categoria
              <Badge variant="outline" className="ml-2 text-xs">
                {editedCategory ? 'AI selectat' : 'Neselectat'}
              </Badge>
            </Label>
            <Select value={editedCategory} onValueChange={setEditedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Alege categoria..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {availableCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Selectează categoria principală pentru acest caz
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">
              Subcategoria
              <Badge variant="outline" className="ml-2 text-xs">
                {editedSubcategory ? 'AI selectat' : 'Neselectat'}
              </Badge>
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Select value={editedSubcategory} onValueChange={setEditedSubcategory}>
              <SelectTrigger id="subcategory">
                <SelectValue placeholder="Alege subcategoria..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {availableSubcategories.map((subcat) => (
                  <SelectItem key={subcat} value={subcat}>
                    {subcat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {(selectedDomain === 'civil' || selectedDomain === 'constitutional') &&
                `Subcategoria este obligatorie pentru cazuri ${selectedDomain === 'civil' ? 'civile' : 'constituționale'}`
              }
            </p>
          </div>
        </div>

        {/* Analysis Steps */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">
              Pași de analiză ({editedCase.analysis_steps.length})
            </Label>
            <Button onClick={addAnalysisStep} variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Adaugă pas
            </Button>
          </div>

          <div className="space-y-3">
            {editedCase.analysis_steps.map((step, index) => (
              <Card key={step.step_number} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="text-sm">
                      Pas {step.step_number}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => moveAnalysisStep(index, 'up')}
                        disabled={index === 0}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Mută în sus"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => moveAnalysisStep(index, 'down')}
                        disabled={index === editedCase.analysis_steps.length - 1}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Mută în jos"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => removeAnalysisStep(index)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Șterge"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    rows={3}
                    value={step.description}
                    onChange={(e) => updateAnalysisStep(index, e.target.value)}
                    placeholder="Descrierea pasului de analiză..."
                    className="resize-y"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Hints */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">
              Indicii ({editedCase.hints.length})
            </Label>
            <Button onClick={addHint} variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Adaugă indiciu
            </Button>
          </div>

          <div className="space-y-3">
            {editedCase.hints.map((hint, index) => (
              <Card key={hint.hint_number} className="border-l-4 border-l-amber-500">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-sm">
                      Indiciu {hint.hint_number}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => moveHint(index, 'up')}
                        disabled={index === 0}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Mută în sus"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => moveHint(index, 'down')}
                        disabled={index === editedCase.hints.length - 1}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Mută în jos"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => removeHint(index)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Șterge"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    rows={2}
                    value={hint.text}
                    onChange={(e) => updateHint(index, e.target.value)}
                    placeholder="Textul indiciului..."
                    className="resize-y"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t">
          <Button onClick={onReset} variant="outline" size="lg" className="gap-2">
            <RefreshCw className="h-5 w-5" />
            Anulează și generează alt caz
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Se salvează...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Salvează
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
