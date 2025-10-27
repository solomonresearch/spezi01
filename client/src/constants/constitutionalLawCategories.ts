export interface ConstitutionalLawCategory {
  id: string;
  name: string;
  description: string;
  articles: string[];
  subcategories: string[];
}

export const CONSTITUTIONAL_LAW_CATEGORIES: ConstitutionalLawCategory[] = [
  {
    id: "drepturi_fundamentale",
    name: "Drepturi fundamentale",
    description: "Libertate, egalitate, proprietate",
    articles: ["Art. 15-53 Const."],
    subcategories: [
      "Dreptul la viață și integritate fizică",
      "Libertatea de exprimare și opinie",
      "Dreptul de proprietate privată",
      "Egalitatea în fața legii",
      "Libertatea de asociere și adunare",
      "Libertatea de mișcare și domiciliu"
    ]
  },
  {
    id: "organizarea_autoritatilor",
    name: "Organizarea autorităților publice",
    description: "Parlament, Guvern",
    articles: ["Art. 61-126 Const."],
    subcategories: [
      "Parlamentul (structură și atribuții)",
      "Guvernul (formare și funcționare)",
      "Președintele României",
      "Puterea judecătorească",
      "Autorități administrative autonome"
    ]
  },
  {
    id: "controlul_constitutionalitate",
    name: "Controlul de constituționalitate",
    description: "CCR, excepție",
    articles: ["Art. 142-147 Const."],
    subcategories: [
      "Curtea Constituțională (organizare)",
      "Controlul a priori",
      "Controlul a posteriori (excepția de neconstituționalitate)",
      "Efectele deciziilor CCR"
    ]
  },
  {
    id: "suveranitate_cetatenie",
    name: "Suveranitatea și cetățenia",
    description: "Suveranitate națională, cetățenie",
    articles: ["Art. 1-14 Const."],
    subcategories: [
      "Suveranitatea națională",
      "Cetățenia română (dobândire și pierdere)",
      "Poporul și referendum",
      "Principii constituționale fundamentale"
    ]
  },
  {
    id: "separatia_puterilor",
    name: "Separația puterilor în stat",
    description: "Echilibrul constituțional",
    articles: ["Art. 1(4) Const."],
    subcategories: [
      "Separația legislativă-executivă",
      "Separația executivă-judecătorească",
      "Separația legislativă-judecătorească",
      "Echilibrul constituțional",
      "Incompatibilități"
    ]
  },
  {
    id: "revizuirea_constitutiei",
    name: "Revizuirea Constituției",
    description: "Limite, procedură",
    articles: ["Art. 148-152 Const."],
    subcategories: [
      "Inițiativa revizuirii",
      "Procedura de adoptare",
      "Limitele revizuirii",
      "Forme de guvernământ interzise"
    ]
  },
  {
    id: "administratia_publica",
    name: "Administrația publică",
    description: "Principii, funcționar",
    articles: ["Art. 117-121 Const."],
    subcategories: [
      "Principii de organizare",
      "Statutul funcționarului public",
      "Răspunderea administrativă",
      "Autoritatea tutelară"
    ]
  },
  {
    id: "autonomia_locala",
    name: "Autonomia locală și descentralizare",
    description: "Administrația publică locală",
    articles: ["Art. 120-123 Const."],
    subcategories: [
      "Autoritățile administrației publice locale",
      "Consiliul local și primarul",
      "Consiliul județean și președintele",
      "Descentralizarea serviciilor publice"
    ]
  },
  {
    id: "integrare_europeana",
    name: "Integrarea europeană și drept UE",
    description: "Dreptul Uniunii Europene",
    articles: ["Art. 148 Const."],
    subcategories: [
      "Transferul de suveranitate",
      "Primatul dreptului UE",
      "Directivele și regulamentele UE",
      "Cetățenia europeană"
    ]
  }
];

export function getAllConstitutionalSubcategories(): string[] {
  const allSubcategories: string[] = [];
  CONSTITUTIONAL_LAW_CATEGORIES.forEach(category => {
    category.subcategories.forEach(subcat => {
      allSubcategories.push(`${category.name} (${subcat})`);
    });
  });
  allSubcategories.push('Altele');
  return allSubcategories;
}
