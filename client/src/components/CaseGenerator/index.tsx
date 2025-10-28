import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Bot } from 'lucide-react';
import type { CaseGeneratorState, GeneratedCase, LegalDomain, ArticleReference, DifficultyLevel } from '../../types/caseGenerator';
import { generateCaseCode } from '../../constants/caseGeneratorData';
import { caseGeneratorService } from '../../services/caseGeneratorService';
import { DomainSelector } from './DomainSelector';
import { CategoryGrid } from './CategoryGrid';
import { ArticleSelector } from './ArticleSelector';
import { ContextForm } from './ContextForm';
import { ConfigurationPanel } from './ConfigurationPanel';
import { GeneratedCaseEditor } from './GeneratedCaseEditor';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const CaseGenerator = () => {
  const navigate = useNavigate();
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
  const [errors, setErrors] = useState<string[]>([]);

  // State update handlers
  const handleDomainSelect = useCallback((domain: LegalDomain) => {
    setState(prev => ({
      ...prev,
      selectedDomain: domain,
      selectedCategories: [], // Reset categories when domain changes
      selectedArticles: [] // Reset articles when domain changes
    }));
  }, []);

  const handleCategoriesChange = useCallback((categories: string[]) => {
    setState(prev => ({ ...prev, selectedCategories: categories }));
  }, []);

  const handleArticlesChange = useCallback((articles: ArticleReference[]) => {
    setState(prev => ({ ...prev, selectedArticles: articles }));
  }, []);

  const handleContextChange = useCallback((topicDescription: string, specificFocus: string) => {
    setState(prev => ({ ...prev, topicDescription, specificFocus }));
  }, []);

  const handleConfigurationChange = useCallback((
    difficultyLevel: DifficultyLevel,
    weekNumber: number,
    subcategory: string
  ) => {
    setState(prev => ({ ...prev, difficultyLevel, weekNumber, subcategory }));
  }, []);

  const handleGeneratedCaseChange = useCallback((updatedCase: GeneratedCase) => {
    setState(prev => ({ ...prev, generatedCase: updatedCase }));
  }, []);

  // No validation - all fields are optional
  const validateStep = useCallback((): boolean => {
    // All steps are valid, everything is optional
    setErrors([]);
    return true;
  }, []);

  // Navigation handlers
  const goToNextStep = useCallback(() => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      setErrors([]);
    }
  }, [validateStep]);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors([]);
  }, []);

  // AI Generation handler
  const handleGenerate = useCallback(async () => {
    if (!validateStep()) return;

    setState(prev => ({ ...prev, isGenerating: true }));
    setErrors([]);

    try {
      const generatedCase = await caseGeneratorService.generateCase(state);
      const caseCode = generateCaseCode(state.selectedDomain!, state.weekNumber);

      setState(prev => ({
        ...prev,
        generatedCase,
        caseCode,
        isGenerating: false
      }));
    } catch (error) {
      console.error('Error generating case:', error);
      setErrors([error instanceof Error ? error.message : 'Eroare la generarea cazului']);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  }, [state, validateStep]);

  const resetGenerator = useCallback(() => {
    setState({
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
    setCurrentStep(1);
    setErrors([]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-prussian-blue-500/10 to-air-blue-500/10">
      <div className="container max-w-5xl mx-auto p-4 sm:p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi la Dashboard
        </Button>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 flex items-center justify-center gap-2">
            <Bot className="h-8 w-8" />
            Generator de Cazuri Juridice
          </h1>
          <p className="text-center text-muted-foreground">
            Generare automată de cazuri practice cu AI
          </p>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-8 gap-2 sm:gap-4">
            {[
              { number: 1, label: 'Domeniu' },
              { number: 2, label: 'Categorii' },
              { number: 3, label: 'Articole' },
              { number: 4, label: 'Context' },
              { number: 5, label: 'Configurare' }
            ].map((step, index) => (
              <div key={step.number} className="flex items-center">
                {index > 0 && (
                  <div className={`w-8 sm:w-16 h-0.5 transition-colors ${
                    currentStep > step.number - 1 ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    currentStep > step.number
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === step.number
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.number}
                  </div>
                  <span className={`text-xs sm:text-sm mt-1 transition-colors hidden sm:block ${
                    currentStep >= step.number ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="mb-6 space-y-2">
            {errors.map((error, idx) => (
              <Alert key={idx} variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Step Content */}
        <div className="mb-6">
        {currentStep === 1 && (
          <DomainSelector
            selectedDomain={state.selectedDomain}
            onSelect={handleDomainSelect}
          />
        )}

        {currentStep === 2 && (
          <CategoryGrid
            selectedDomain={state.selectedDomain!}
            selectedCategories={state.selectedCategories}
            onChange={handleCategoriesChange}
          />
        )}

        {currentStep === 3 && (
          <ArticleSelector
            selectedDomain={state.selectedDomain!}
            selectedArticles={state.selectedArticles}
            onChange={handleArticlesChange}
          />
        )}

        {currentStep === 4 && (
          <ContextForm
            topicDescription={state.topicDescription}
            specificFocus={state.specificFocus}
            onChange={handleContextChange}
          />
        )}

        {currentStep === 5 && (
          <ConfigurationPanel
            selectedDomain={state.selectedDomain}
            difficultyLevel={state.difficultyLevel}
            weekNumber={state.weekNumber}
            subcategory={state.subcategory}
            onChange={handleConfigurationChange}
            onGenerate={handleGenerate}
            isGenerating={state.isGenerating}
          />
        )}
      </div>

        {/* Navigation Buttons */}
        {!state.generatedCase && (
          <div className="flex justify-between items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Înapoi
            </Button>

            {currentStep < 5 && (
              <Button
                onClick={goToNextStep}
                className="gap-2 ml-auto"
              >
                Continuă
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            )}
          </div>
        )}

        {/* Generated Case Editor */}
        {state.generatedCase && (
          <GeneratedCaseEditor
            caseData={state.generatedCase}
            caseCode={state.caseCode}
            selectedArticles={state.selectedArticles}
            difficultyLevel={state.difficultyLevel}
            weekNumber={state.weekNumber}
            subcategory={state.subcategory}
            onChange={handleGeneratedCaseChange}
            onReset={resetGenerator}
          />
        )}
      </div>
    </div>
  );
};
