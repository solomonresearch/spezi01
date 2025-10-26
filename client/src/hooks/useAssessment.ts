// React hook for managing solution assessment functionality

import { useState, useCallback } from 'react';
import { assessmentService } from '../services/assessmentService';

interface AssessmentState {
  isDetecting: boolean;
  isAssessing: boolean;
  aiDetectionPassed: boolean | null;
  assessmentResult: string | null;
  error: string | null;
}

export const useAssessment = () => {
  const [state, setState] = useState<AssessmentState>({
    isDetecting: false,
    isAssessing: false,
    aiDetectionPassed: null,
    assessmentResult: null,
    error: null
  });

  const assessSolution = useCallback(async (solutionText: string, difficultyLevel: 1 | 3 | 5) => {
    if (!solutionText.trim()) {
      setState(prev => ({ ...prev, error: 'Te rugăm să introduci soluția ta.' }));
      return;
    }

    // Reset state
    setState({
      isDetecting: true,
      isAssessing: false,
      aiDetectionPassed: null,
      assessmentResult: null,
      error: null
    });

    try {
      // Step 1: AI Detection
      const aiResult = await assessmentService.detectAI(solutionText);

      if (!aiResult.passed) {
        // Failed AI detection
        setState({
          isDetecting: false,
          isAssessing: false,
          aiDetectionPassed: false,
          assessmentResult: null,
          error: null
        });
        return;
      }

      // Passed AI detection, proceed to full assessment
      setState(prev => ({
        ...prev,
        isDetecting: false,
        isAssessing: true,
        aiDetectionPassed: true
      }));

      // Step 2: Full Legal Assessment
      const assessment = await assessmentService.assessSolution(solutionText, difficultyLevel);

      setState({
        isDetecting: false,
        isAssessing: false,
        aiDetectionPassed: true,
        assessmentResult: assessment,
        error: null
      });
    } catch (err) {
      console.error('Error during assessment:', err);
      setState(prev => ({
        ...prev,
        isDetecting: false,
        isAssessing: false,
        error: 'Ne pare rău, a apărut o eroare. Te rugăm să încerci din nou.'
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isDetecting: false,
      isAssessing: false,
      aiDetectionPassed: null,
      assessmentResult: null,
      error: null
    });
  }, []);

  return {
    ...state,
    assessSolution,
    reset
  };
};
