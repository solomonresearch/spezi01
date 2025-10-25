// Service for fetching legal cases from Supabase

import { supabase } from '../lib/supabase';
import type { Case, CaseArticle, CaseAnalysisStep, CaseHint, CasesGrouped } from '../types/case';

export class CaseService {
  /**
   * Fetch all cases
   */
  static async getAllCases(): Promise<Case[]> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('week_number', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching cases:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Fetch cases grouped by difficulty level
   */
  static async getCasesGrouped(): Promise<CasesGrouped> {
    const cases = await this.getAllCases();

    return {
      easy: cases.filter(c => c.level.toLowerCase() === 'ușor'),
      medium: cases.filter(c => c.level.toLowerCase() === 'mediu'),
      hard: cases.filter(c => c.level.toLowerCase() === 'dificil')
    };
  }

  /**
   * Fetch a single case by ID
   */
  static async getCaseById(id: string): Promise<Case | null> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching case:', error);
      return null;
    }

    return data;
  }

  /**
   * Fetch articles for a case
   */
  static async getCaseArticles(caseId: string): Promise<CaseArticle[]> {
    const { data, error } = await supabase
      .from('case_articles')
      .select('*')
      .eq('case_id', caseId)
      .order('article_number', { ascending: true });

    if (error) {
      console.error('Error fetching case articles:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch analysis steps for a case
   */
  static async getCaseAnalysisSteps(caseId: string): Promise<CaseAnalysisStep[]> {
    const { data, error } = await supabase
      .from('case_analysis_steps')
      .select('*')
      .eq('case_id', caseId)
      .order('step_number', { ascending: true });

    if (error) {
      console.error('Error fetching analysis steps:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch hints for a case
   */
  static async getCaseHints(caseId: string): Promise<CaseHint[]> {
    const { data, error } = await supabase
      .from('case_hints')
      .select('*')
      .eq('case_id', caseId)
      .order('hint_number', { ascending: true });

    if (error) {
      console.error('Error fetching hints:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch complete case with all related data
   */
  static async getCompleteCase(caseId: string) {
    const [caseData, articles, steps, hints] = await Promise.all([
      this.getCaseById(caseId),
      this.getCaseArticles(caseId),
      this.getCaseAnalysisSteps(caseId),
      this.getCaseHints(caseId)
    ]);

    return {
      case: caseData,
      articles,
      steps,
      hints
    };
  }

  /**
   * Fetch cases by week number
   */
  static async getCasesByWeek(weekNumber: number): Promise<Case[]> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('week_number', weekNumber)
      .order('level', { ascending: true });

    if (error) {
      console.error('Error fetching cases by week:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch cases by difficulty level
   */
  static async getCasesByLevel(level: string): Promise<Case[]> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .ilike('level', level)
      .order('week_number', { ascending: true });

    if (error) {
      console.error('Error fetching cases by level:', error);
      return [];
    }

    return data || [];
  }
}
