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

      // Check if it's a duplicate case code error
      if (caseError.code === '23505' && caseError.message.includes('cases_case_code_key')) {
        throw new Error(`Codul cazului "${caseData.case_code}" există deja în baza de date. Te rog alege un alt cod.`);
      }

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
      // Filter out invalid steps and ensure proper numbering
      const validSteps = caseData.analysis_steps
        .filter(step => step.description && step.description.trim().length > 0)
        .map((step, index) => ({
          case_id: caseId,
          step_number: step.step_number || (index + 1), // Fallback to index-based numbering
          step_description: step.description.trim()
        }));

      if (validSteps.length > 0) {
        const { error: stepsError } = await supabase
          .from('case_analysis_steps')
          .insert(validSteps);

        if (stepsError) {
          console.error('❌ Error inserting analysis steps:', stepsError);
          console.error('Steps data:', validSteps);
          // Try to rollback
          await supabase.from('cases').delete().eq('id', caseId);
          throw new Error(`Eroare la salvarea pașilor de analiză: ${stepsError.message}`);
        }

        console.log(`✅ Inserted ${validSteps.length} analysis steps`);
      } else {
        console.log('⚠️ No valid analysis steps to insert');
      }
    }

    // Step 4: Insert hints
    if (caseData.hints.length > 0) {
      // Filter out invalid hints and ensure proper numbering
      const validHints = caseData.hints
        .filter(hint => hint.text && hint.text.trim().length > 0)
        .map((hint, index) => ({
          case_id: caseId,
          hint_number: hint.hint_number || (index + 1), // Fallback to index-based numbering
          hint_text: hint.text.trim()
        }));

      if (validHints.length > 0) {
        const { error: hintsError } = await supabase
          .from('case_hints')
          .insert(validHints);

        if (hintsError) {
          console.error('❌ Error inserting hints:', hintsError);
          console.error('Hints data:', validHints);
          // Try to rollback
          await supabase.from('cases').delete().eq('id', caseId);
          throw new Error(`Eroare la salvarea indiciilor: ${hintsError.message}`);
        }

        console.log(`✅ Inserted ${validHints.length} hints`);
      } else {
        console.log('⚠️ No valid hints to insert');
      }
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
