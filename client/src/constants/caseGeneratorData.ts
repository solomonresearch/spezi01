// Case Generator Data - Domains and Categories

import type { DomainOption, CategoryOption } from '../types/caseGenerator';
import { CIVIL_LAW_CATEGORIES, getAllCivilSubcategories } from './civilLawCategories';
import { CONSTITUTIONAL_LAW_CATEGORIES, getAllConstitutionalSubcategories } from './constitutionalLawCategories';
import { PENAL_LAW_CATEGORIES, getAllPenalSubcategories } from './penalLawCategories';

export const DOMAINS: DomainOption[] = [
  {
    id: 'civil',
    name: 'Drept Civil',
    icon: '⚖️'
  },
  {
    id: 'penal',
    name: 'Drept Penal',
    icon: '🔴'
  },
  {
    id: 'constitutional',
    name: 'Drept Constituțional',
    icon: '📜'
  }
];

// Civil law subcategories - imported from civilLawCategories.ts
export const CIVIL_SUBCATEGORIES = getAllCivilSubcategories();

// Penal law subcategories - imported from penalLawCategories.ts
export const PENAL_SUBCATEGORIES = getAllPenalSubcategories();

// Constitutional law subcategories - imported from constitutionalLawCategories.ts
export const CONSTITUTIONAL_SUBCATEGORIES = getAllConstitutionalSubcategories();

// Convert CIVIL_LAW_CATEGORIES to CategoryOption format
const CIVIL_CATEGORIES: CategoryOption[] = CIVIL_LAW_CATEGORIES.map(cat => ({
  id: cat.id,
  name: cat.name,
  domain: 'civil' as const
}));

// Convert PENAL_LAW_CATEGORIES to CategoryOption format
const PENAL_CATEGORIES: CategoryOption[] = PENAL_LAW_CATEGORIES.map(cat => ({
  id: cat.id,
  name: cat.name,
  domain: 'penal' as const
}));

// Convert CONSTITUTIONAL_LAW_CATEGORIES to CategoryOption format
const CONSTITUTIONAL_CATEGORIES: CategoryOption[] = CONSTITUTIONAL_LAW_CATEGORIES.map(cat => ({
  id: cat.id,
  name: cat.name,
  domain: 'constitutional' as const
}));

export const CATEGORIES: CategoryOption[] = [
  // DREPT CIVIL - Use the comprehensive structure from civilLawCategories.ts
  ...CIVIL_CATEGORIES,

  // DREPT PENAL - Use the comprehensive structure from penalLawCategories.ts
  ...PENAL_CATEGORIES,

  // DREPT CONSTITUȚIONAL - Use the comprehensive structure from constitutionalLawCategories.ts
  ...CONSTITUTIONAL_CATEGORIES
];

export const DIFFICULTY_OPTIONS = [
  {
    value: 'usor' as const,
    label: 'Ușor',
    description: 'Aplicare directă, un singur articol, fapte clare'
  },
  {
    value: 'mediu' as const,
    label: 'Mediu',
    description: 'Articole multiple, ambiguitate moderată, o excepție'
  },
  {
    value: 'dificil' as const,
    label: 'Dificil',
    description: 'Excepții multiple, zonă gri, sinteză complexă'
  }
];

export const WEEK_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Săptămâna ${i + 1}`
}));

// Helper function to format article reference based on domain
export function formatArticleReference(articleNumber: string, domain: string): string {
  switch (domain) {
    case 'civil':
      return `Art. ${articleNumber} C.civ.`;
    case 'penal':
      return `Art. ${articleNumber} C.pen.`;
    case 'constitutional':
      return `Art. ${articleNumber} Const.`;
    default:
      return `Art. ${articleNumber}`;
  }
}

// Helper function to generate unique case code
export function generateCaseCode(domain: string, weekNumber: number): string {
  const prefix = domain === 'civil' ? 'CIV' : domain === 'penal' ? 'PEN' : 'CON';
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                  String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                  String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix}${weekNumber}${letters}`;
}

// Export the law categories structures for use in components
export { CIVIL_LAW_CATEGORIES } from './civilLawCategories';
export { PENAL_LAW_CATEGORIES } from './penalLawCategories';
export { CONSTITUTIONAL_LAW_CATEGORIES } from './constitutionalLawCategories';

// Helper to get category name by ID
export function getCategoryNameById(categoryId: string): string | null {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category ? category.name : null;
}
