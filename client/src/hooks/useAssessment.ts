// React hook for managing solution assessment functionality

import { useState, useCallback } from 'react';
import { assessmentService } from '../services/assessmentService';
import { supabase } from '../lib/supabase';

interface AssessmentState {
  isDetecting: boolean;
  isAssessing: boolean;
  aiDetectionPassed: boolean | null;
  assessmentResult: string | null;
  error: string | null;
}

interface AssessmentOptions {
  userId?: string;
  caseId?: string;
}

export const useAssessment = (options?: AssessmentOptions) => {
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

    let submissionId: string | null = null;

    try {
      // Save submission to database if userId and caseId are provided
      if (options?.userId && options?.caseId) {
        const { data: submission, error: submissionError } = await supabase
          .from('case_submissions')
          .insert({
            user_id: options.userId,
            case_id: options.caseId,
            submission_text: solutionText,
            difficulty_rating: difficultyLevel,
            status: 'submitted'
          })
          .select('id')
          .single();

        if (submissionError) {
          console.error('Error saving submission:', submissionError);
        } else {
          submissionId = submission?.id;
          console.log('Submission saved with ID:', submissionId);
        }
      }

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

        // Update submission status if it was saved
        if (submissionId) {
          await supabase
            .from('case_submissions')
            .update({
              status: 'submitted',
              feedback_text: `Verificare AI: Textul tău pare a fi generat de AI (${aiResult.probability}%). ${aiResult.justification}`
            })
            .eq('id', submissionId);
        }
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

      // Extract score from assessment result
      // Format: **PUNCTAJ TOTAL: [X]/100**
      const scoreMatch = assessment.match(/PUNCTAJ TOTAL:\s*(\d+)\/100/);
      const scoreValue = scoreMatch ? parseFloat(scoreMatch[1]) : null;
      const scoreText = scoreValue ? `${scoreValue}/100` : null;

      // Update submission with feedback and score
      if (submissionId && scoreValue !== null) {
        await supabase
          .from('case_submissions')
          .update({
            feedback_text: assessment,
            score: scoreText,
            score_value: scoreValue,
            status: 'graded',
            feedback_at: new Date().toISOString()
          })
          .eq('id', submissionId);

        console.log('Submission updated with feedback and score:', scoreValue);
      }

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
  }, [options?.userId, options?.caseId]);

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
