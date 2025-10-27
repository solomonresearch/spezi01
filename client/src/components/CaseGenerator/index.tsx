import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CaseGeneratorState, GeneratedCase, LegalDomain, ArticleReference, DifficultyLevel } from '../../types/caseGenerator';
import { generateCaseCode } from '../../constants/caseGeneratorData';
import { caseGeneratorService } from '../../services/caseGeneratorService';
import { DomainSelector } from './DomainSelector';
import { CategoryGrid } from './CategoryGrid';
import { ArticleSelector } from './ArticleSelector';
import { ContextForm } from './ContextForm';
import { ConfigurationPanel } from './ConfigurationPanel';
import { GeneratedCaseEditor } from './GeneratedCaseEditor';

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
    <div className="case-generator">
      <button
        className="btn-back-to-dashboard"
        onClick={() => navigate('/dashboard')}
        title="Înapoi la Dashboard"
      >
        ← Înapoi la Dashboard
      </button>
      <header className="case-generator-header">
        <h1>🤖 Generator de Cazuri Juridice</h1>
        <p className="subtitle">Generare automată de cazuri practice cu AI</p>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Domeniu</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Categorii</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Articole</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Context</div>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${currentStep >= 5 ? 'active' : ''} ${currentStep > 5 ? 'completed' : ''}`}>
            <div className="step-number">5</div>
            <div className="step-label">Configurare</div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, idx) => (
            <div key={idx} className="error-message">⚠️ {error}</div>
          ))}
        </div>
      )}

      {/* Step Content */}
      <div className="step-content">
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
        <div className="step-navigation">
          <button
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="btn-nav btn-prev"
          >
            ← Înapoi
          </button>

          {currentStep < 5 && (
            <button
              onClick={goToNextStep}
              className="btn-nav btn-next"
            >
              Continuă →
            </button>
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
  );
};
