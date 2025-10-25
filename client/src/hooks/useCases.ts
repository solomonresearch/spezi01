// React hook for managing legal cases

import { useState, useEffect } from 'react';
import { CaseService } from '../services/caseService';
import type { Case, CaseArticle, CaseAnalysisStep, CaseHint } from '../types/case';

export const useCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await CaseService.getAllCases();
      setCases(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load cases:', err);
    } finally {
      setLoading(false);
    }
  };

  return { cases, loading, error, reload: loadCases };
};

export const useCase = (caseId: string | null) => {
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [articles, setArticles] = useState<CaseArticle[]>([]);
  const [steps, setSteps] = useState<CaseAnalysisStep[]>([]);
  const [hints, setHints] = useState<CaseHint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (caseId) {
      loadCase(caseId);
    } else {
      setCaseData(null);
      setArticles([]);
      setSteps([]);
      setHints([]);
    }
  }, [caseId]);

  const loadCase = async (id: string) => {
    try {
      setLoading(true);
      const data = await CaseService.getCompleteCase(id);
      setCaseData(data.case);
      setArticles(data.articles);
      setSteps(data.steps);
      setHints(data.hints);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load case:', err);
    } finally {
      setLoading(false);
    }
  };

  return { caseData, articles, steps, hints, loading, error };
};

export const useCasesBySubcategory = (subcategory: string | null) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (subcategory) {
      loadCases(subcategory);
    } else {
      setCases([]);
    }
  }, [subcategory]);

  const loadCases = async (sub: string) => {
    try {
      setLoading(true);
      const data = await CaseService.getCasesBySubcategory(sub);
      setCases(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load cases by subcategory:', err);
    } finally {
      setLoading(false);
    }
  };

  return { cases, loading, error };
};
