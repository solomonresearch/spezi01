// Case Generator Data - Domains and Categories

import type { DomainOption, CategoryOption } from '../types/caseGenerator';

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

export const CATEGORIES: CategoryOption[] = [
  // DREPT CIVIL
  {
    id: 'civil_persons',
    name: 'Persoane fizice și juridice (capacitate, domiciliu, personalitate juridică)',
    domain: 'civil'
  },
  {
    id: 'civil_contracts_general',
    name: 'Contracte generale (formare, efecte, interpretare, nulitate)',
    domain: 'civil'
  },
  {
    id: 'civil_contracts_special',
    name: 'Contracte speciale (vânzare, locațiune, mandat, întreprindere)',
    domain: 'civil'
  },
  {
    id: 'civil_property',
    name: 'Bunuri și proprietate (clasificare, drepturi reale, posesia, publicitate)',
    domain: 'civil'
  },
  {
    id: 'civil_obligations',
    name: 'Obligații (izvoare, executare, prescripție)',
    domain: 'civil'
  },
  {
    id: 'civil_liability',
    name: 'Răspundere civilă delictuală (culpă, prejudiciu, raport cauzal)',
    domain: 'civil'
  },
  {
    id: 'civil_guarantees',
    name: 'Garanții reale (ipotecă, gaj, privilegii)',
    domain: 'civil'
  },
  {
    id: 'civil_family',
    name: 'Familie (căsătorie, divorț, filație)',
    domain: 'civil'
  },
  {
    id: 'civil_succession',
    name: 'Succesiuni (moștenire legală/testamentară)',
    domain: 'civil'
  },

  // DREPT PENAL
  {
    id: 'penal_general_theory',
    name: 'Teoria generală (element material, vinovăție, tentativă)',
    domain: 'penal'
  },
  {
    id: 'penal_life_integrity',
    name: 'Infracțiuni contra vieții și integrității (omor, vătămare)',
    domain: 'penal'
  },
  {
    id: 'penal_property',
    name: 'Infracțiuni contra patrimoniului (furt, înșelăciune, tâlhărie)',
    domain: 'penal'
  },
  {
    id: 'penal_authority',
    name: 'Infracțiuni contra autorității (ultraj, evadare)',
    domain: 'penal'
  },
  {
    id: 'penal_participation',
    name: 'Participație penală (autor, complice, instigator)',
    domain: 'penal'
  },
  {
    id: 'penal_sanctions',
    name: 'Sancțiuni penale (pedeapsă, măsuri de siguranță)',
    domain: 'penal'
  },
  {
    id: 'penal_justification',
    name: 'Cauze de justificare și nepedepsire (legitimă apărare)',
    domain: 'penal'
  },
  {
    id: 'penal_corruption',
    name: 'Infracțiuni de corupție (luare/dare mită)',
    domain: 'penal'
  },
  {
    id: 'penal_economic',
    name: 'Infracțiuni economice (evaziune, spălare bani, abuz în serviciu)',
    domain: 'penal'
  },
  {
    id: 'penal_public_safety',
    name: 'Infracțiuni contra siguranței publice (incendiu, explozie)',
    domain: 'penal'
  },
  {
    id: 'penal_concurrence',
    name: 'Concurs de infracțiuni și recidivă',
    domain: 'penal'
  },

  // DREPT CONSTITUȚIONAL
  {
    id: 'const_fundamental_rights',
    name: 'Drepturi fundamentale (libertate, egalitate, proprietate)',
    domain: 'constitutional'
  },
  {
    id: 'const_public_authorities',
    name: 'Organizarea autorităților publice (Parlament, Guvern)',
    domain: 'constitutional'
  },
  {
    id: 'const_control',
    name: 'Controlul de constituționalitate (CCR, excepție)',
    domain: 'constitutional'
  },
  {
    id: 'const_sovereignty',
    name: 'Suveranitatea și cetățenia',
    domain: 'constitutional'
  },
  {
    id: 'const_separation',
    name: 'Separația puterilor în stat',
    domain: 'constitutional'
  },
  {
    id: 'const_revision',
    name: 'Revizuirea Constituției (limite, procedură)',
    domain: 'constitutional'
  },
  {
    id: 'const_administration',
    name: 'Administrația publică (principii, funcționar)',
    domain: 'constitutional'
  },
  {
    id: 'const_autonomy',
    name: 'Autonomia locală și descentralizare',
    domain: 'constitutional'
  },
  {
    id: 'const_eu',
    name: 'Integrarea europeană și drept UE',
    domain: 'constitutional'
  }
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
