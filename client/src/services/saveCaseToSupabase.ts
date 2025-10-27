// Service for saving generated cases to Supabase
// Handles transactional insert across 4 tables:
// - cases
// - case_articles
// - case_analysis_steps
// - case_hints

import { supabase } from '../lib/supabase';
import type { CaseToSave } from '../types/caseGenerator';

// Helper function to format level for database
// Database expects: 'Ușor', 'Mediu', 'Dificil' (capitalized with diacritics)
function formatLevelForDatabase(level: string): string {
  switch (level) {
    case 'usor':
      return 'Ușor';
    case 'mediu':
      return 'Mediu';
    case 'dificil':
      return 'Dificil';
    default:
      // Fallback: capitalize first letter
      return level.charAt(0).toUpperCase() + level.slice(1);
  }
}

export async function saveCaseToSupabase(caseData: CaseToSave): Promise<string> {
  console.log('💾 Saving case to Supabase...', caseData.case_code);

  try {
    // Format level to match database constraint
    const formattedLevel = formatLevelForDatabase(caseData.level);
    console.log(`📝 Formatted level: "${caseData.level}" → "${formattedLevel}"`);

    // Step 1: Insert into cases table
    const { data: caseRow, error: caseError } = await supabase
      .from('cases')
      .insert({
        case_code: caseData.case_code,
        title: caseData.title,
        level: formattedLevel,
        week_number: caseData.week_number,
        legal_problem: caseData.legal_problem,
        case_description: caseData.case_description,
        question: caseData.question,
        subcategory: caseData.subcategory,
        verified: false // Always false for AI-generated cases
      })
      .select('id')
      .single();

    if (caseError) {
      console.error('❌ Error inserting case:', caseError);
      throw new Error(`Eroare la salvarea cazului: ${caseError.message}`);
    }

    if (!caseRow) {
      throw new Error('Nu s-a putut obține ID-ul cazului creat');
    }

    const caseId = caseRow.id;
    console.log('✅ Case inserted with ID:', caseId);

    // Step 2: Insert articles
    if (caseData.articles.length > 0) {
      const articlesData = caseData.articles.map(art => ({
        case_id: caseId,
        article_number: art.number,
        article_reference: art.reference
      }));

      const { error: articlesError } = await supabase
        .from('case_articles')
        .insert(articlesData);

      if (articlesError) {
        console.error('❌ Error inserting articles:', articlesError);
        // Try to rollback by deleting the case
        await supabase.from('cases').delete().eq('id', caseId);
        throw new Error(`Eroare la salvarea articolelor: ${articlesError.message}`);
      }

      console.log(`✅ Inserted ${caseData.articles.length} articles`);
    }

    // Step 3: Insert analysis steps
    if (caseData.analysis_steps.length > 0) {
      const stepsData = caseData.analysis_steps.map(step => ({
        case_id: caseId,
        step_number: step.step_number,
        step_description: step.description
      }));

      const { error: stepsError } = await supabase
        .from('case_analysis_steps')
        .insert(stepsData);

      if (stepsError) {
        console.error('❌ Error inserting analysis steps:', stepsError);
        // Try to rollback
        await supabase.from('cases').delete().eq('id', caseId);
        throw new Error(`Eroare la salvarea pașilor de analiză: ${stepsError.message}`);
      }

      console.log(`✅ Inserted ${caseData.analysis_steps.length} analysis steps`);
    }

    // Step 4: Insert hints
    if (caseData.hints.length > 0) {
      const hintsData = caseData.hints.map(hint => ({
        case_id: caseId,
        hint_number: hint.hint_number,
        hint_text: hint.text
      }));

      const { error: hintsError } = await supabase
        .from('case_hints')
        .insert(hintsData);

      if (hintsError) {
        console.error('❌ Error inserting hints:', hintsError);
        // Try to rollback
        await supabase.from('cases').delete().eq('id', caseId);
        throw new Error(`Eroare la salvarea indiciilor: ${hintsError.message}`);
      }

      console.log(`✅ Inserted ${caseData.hints.length} hints`);
    }

    console.log('✅ Case saved successfully to Supabase!');
    return caseData.case_code;

  } catch (error) {
    console.error('❌ Fatal error saving case:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Eroare necunoscută la salvarea cazului');
  }
}
