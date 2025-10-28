// Comprehensive Penal Law Categories Structure
// Based on Romanian Penal Code (Codul Penal)
// Pattern matches civilLawCategories.ts for consistency

export interface PenalLawCategory {
  id: string;
  name: string;
  description: string;
  articles: string[];
  subcategories: string[];
}

export const PENAL_LAW_CATEGORIES: PenalLawCategory[] = [
  // ==================== PARTEA GENERALĂ ====================

  {
    id: "legea_penala",
    name: "Legea penală și limitele ei de aplicare",
    description: "Principii generale, aplicarea legii penale în timp și spațiu",
    articles: ["Art. 1-14 C.pen."],
    subcategories: [
      "Principii generale (legalitate, sancțiuni)",
      "Aplicarea legii penale în timp",
      "Aplicarea legii penale în spațiu",
      "Teritorialitatea și personalitatea legii penale",
      "Universalitatea și realitatea legii penale"
    ]
  },

  {
    id: "infractiunea",
    name: "Infracțiunea",
    description: "Trăsături esențiale, cauze justificative, tentativa, participanții",
    articles: ["Art. 15-52 C.pen."],
    subcategories: [
      "Trăsăturile esențiale ale infracțiunii",
      "Vinovăția (intenție, culpă, intenție depășită)",
      "Cauzele justificative (legitimă apărare, stare de necesitate)",
      "Cauzele de neimputabilitate",
      "Tentativa",
      "Unitatea și pluralitatea de infracțiuni",
      "Autorul și participanții (autor, instigator, complice)"
    ]
  },

  {
    id: "pedepsele",
    name: "Pedepsele",
    description: "Categorii, pedeapsa accesorie, individualizare, circumstanțe",
    articles: ["Art. 53-106 C.pen."],
    subcategories: [
      "Categoriile pedepselor",
      "Detențiunea pe viață",
      "Închisoarea",
      "Amenda",
      "Pedeapsa accesorie și pedepsele complementare",
      "Circumstanțe atenuante și agravante",
      "Renunțarea la aplicarea pedepsei",
      "Amânarea aplicării pedepsei",
      "Suspendarea executării pedepsei sub supraveghere",
      "Liberarea condiționată"
    ]
  },

  {
    id: "masuri_siguranta",
    name: "Măsurile de siguranță",
    description: "Dispoziții generale, regimul măsurilor de siguranță",
    articles: ["Art. 107-112 C.pen."],
    subcategories: [
      "Dispoziții generale privind măsurile de siguranță",
      "Regimul măsurilor de siguranță",
      "Internarea medicală",
      "Obligarea la tratament medical"
    ]
  },

  {
    id: "minoritatea",
    name: "Minoritatea",
    description: "Răspunderea penală a minorului, măsuri educative",
    articles: ["Art. 113-134 C.pen."],
    subcategories: [
      "Regimul răspunderii penale a minorului",
      "Măsuri educative neprivative de libertate",
      "Măsuri educative privative de libertate",
      "Internarea într-un centru educativ",
      "Internarea într-un centru de detenție"
    ]
  },

  {
    id: "persoana_juridica",
    name: "Răspunderea penală a persoanei juridice",
    description: "Condițiile și regimul răspunderii penale",
    articles: ["Art. 135-151 C.pen."],
    subcategories: [
      "Condițiile răspunderii penale a persoanei juridice",
      "Pedepsele complementare aplicate persoanei juridice",
      "Dizolvarea persoanei juridice",
      "Suspendarea activității",
      "Interdicții speciale"
    ]
  },

  {
    id: "inlaturare_raspundere",
    name: "Cauze care înlătură răspunderea penală",
    description: "Amnistie, prescripție, lipsa plângerii prealabile",
    articles: ["Art. 152-159 C.pen."],
    subcategories: [
      "Amnistia",
      "Prescripția răspunderii penale",
      "Lipsa plângerii prealabile",
      "Retragerea plângerii prealabile",
      "Împăcarea părților"
    ]
  },

  {
    id: "executare_pedeapsa",
    name: "Cauze care înlătură executarea pedepsei",
    description: "Grațierea, amnistia post-condamnatorie, prescripția",
    articles: ["Art. 160-164 C.pen."],
    subcategories: [
      "Grațierea",
      "Amnistia post-condamnatorie",
      "Prescripția executării pedepsei",
      "Decesul condamnatului"
    ]
  },

  {
    id: "consecinte_condamnare",
    name: "Cauze care înlătură consecințele condamnării",
    description: "Reabilitarea de drept și judecătorească",
    articles: ["Art. 165-171 C.pen."],
    subcategories: [
      "Reabilitarea de drept",
      "Reabilitarea judecătorească",
      "Efectele reabilitării",
      "Reabilitarea condamnatului decedat"
    ]
  },

  {
    id: "inteles_termeni",
    name: "Înțelesul unor termeni în legea penală",
    description: "Definiții legale și clarificări terminologice",
    articles: ["Art. 172-187 C.pen."],
    subcategories: [
      "Funcționar public",
      "Înscris",
      "Valori",
      "Violență",
      "Amenințare",
      "Bunuri",
      "Alte definiții legale"
    ]
  },

  // ==================== PARTEA SPECIALĂ ====================

  {
    id: "contra_persoanei",
    name: "Infracțiuni contra persoanei",
    description: "Infracțiuni contra vieții, integrității corporale, libertății",
    articles: ["Art. 188-227 C.pen."],
    subcategories: [
      "Infracțiuni contra vieții (omor, omor calificat, pruncucidere)",
      "Infracțiuni contra integrității corporale (vătămare, loviri)",
      "Infracțiuni săvârșite asupra unui membru de familie (violență domestică)",
      "Agresiuni asupra fătului (întrerupere ilegală a sarcinii)",
      "Infracțiuni privind asistența celor în primejdie",
      "Infracțiuni contra libertății persoanei (lipsire de libertate, șantaj)",
      "Traficul și exploatarea persoanelor vulnerabile",
      "Infracțiuni contra libertății sexuale (viol, agresiune sexuală)",
      "Infracțiuni contra vieții private și domiciliului"
    ]
  },

  {
    id: "contra_patrimoniului",
    name: "Infracțiuni contra patrimoniului",
    description: "Furt, tâlhărie, înșelăciune, fraude",
    articles: ["Art. 228-256 C.pen."],
    subcategories: [
      "Furtul (furt simplu, furt calificat)",
      "Tâlhăria și pirateria",
      "Înșelăciune",
      "Abuz de încredere",
      "Gestiune frauduloasă",
      "Fraude comise prin sisteme informatice",
      "Fraude prin mijloace de plată electronice",
      "Distrugerea bunurilor",
      "Tulburarea de posesie"
    ]
  },

  {
    id: "autoritate_frontiera",
    name: "Infracțiuni privind autoritatea și frontiera",
    description: "Ultraj, evadare, trecerea frauduloasă a frontierei",
    articles: ["Art. 257-265 C.pen."],
    subcategories: [
      "Ultrajul contra autorității",
      "Evadarea",
      "Violare de domiciliu de către funcționar",
      "Trecerea frauduloasă a frontierei",
      "Nerespectarea regimului frontierei de stat"
    ]
  },

  {
    id: "infaptuirea_justitiei",
    name: "Infracțiuni contra înfăptuirii justiției",
    description: "Mărturie mincinoasă, favorizarea infractorului",
    articles: ["Art. 266-288 C.pen."],
    subcategories: [
      "Mărturie mincinoasă",
      "Favorizarea infractorului",
      "Sustragerea de la urmărire sau judecată",
      "Îngrădirea exercitării drepturilor",
      "Autoacuzarea",
      "Denunțarea calomnioasă",
      "Ultrajul în instanță"
    ]
  },

  {
    id: "coruptie_serviciu",
    name: "Infracțiuni de corupție și de serviciu",
    description: "Luare/dare de mită, trafic de influență, abuz",
    articles: ["Art. 289-309 C.pen."],
    subcategories: [
      "Luarea de mită",
      "Darea de mită",
      "Traficul de influență",
      "Cumpărarea de influență",
      "Abuzul în serviciu",
      "Neglijența în serviciu",
      "Uzurparea funcției",
      "Conflictul de interese"
    ]
  },

  {
    id: "fals",
    name: "Infracțiuni de fals",
    description: "Falsificarea de monede, timbre, înscrisuri",
    articles: ["Art. 310-328 C.pen."],
    subcategories: [
      "Falsificarea de monede",
      "Falsificarea de timbre sau mărci valorice",
      "Falsificarea instrumentelor de autentificare",
      "Fals intelectual",
      "Fals material în înscrisuri oficiale",
      "Uz de fals",
      "Fals în declarații",
      "Falsul informatic"
    ]
  },

  {
    id: "siguranta_publica",
    name: "Infracțiuni contra siguranței publice",
    description: "Siguranța circulației, regimul armelor, sănătate",
    articles: ["Art. 329-366 C.pen."],
    subcategories: [
      "Infracțiuni contra siguranței circulației pe căile ferate",
      "Infracțiuni contra siguranței circulației rutiere",
      "Conducere sub influența alcoolului sau drogurilor",
      "Nerespectarea regimului armelor și munițiilor",
      "Nerespectarea regimului materiilor nucleare",
      "Nerespectarea regimului materiilor explozive",
      "Infracțiuni contra sănătății publice",
      "Trafic de droguri",
      "Infracțiuni informatice (acces ilegal, sabotaj informatic)"
    ]
  },

  {
    id: "convietuire_sociala",
    name: "Infracțiuni contra convietuirii sociale",
    description: "Tulburarea ordinii publice, contra familiei",
    articles: ["Art. 367-384 C.pen."],
    subcategories: [
      "Tulburarea ordinii și liniștii publice",
      "Pornografie infantilă",
      "Proxenetism",
      "Infracțiuni contra familiei (bigamie, abandon de familie)",
      "Nerespectarea măsurilor de protecție",
      "Infracțiuni contra libertății religioase",
      "Profanarea de morminte"
    ]
  },

  {
    id: "electorale",
    name: "Infracțiuni electorale",
    description: "Infracțiuni legate de procesul electoral",
    articles: ["Art. 385-393 C.pen."],
    subcategories: [
      "Coruperea alegătorilor",
      "Fraudarea alegerilor",
      "Împiedicarea exercitării drepturilor electorale",
      "Votul ilegal",
      "Înscrierea ilegală în listele electorale"
    ]
  },

  {
    id: "securitate_nationala",
    name: "Infracțiuni contra securității naționale",
    description: "Trădare, spionaj, sabotaj",
    articles: ["Art. 394-412 C.pen."],
    subcategories: [
      "Trădarea",
      "Spionajul",
      "Divulgarea secretului de stat",
      "Sabotajul",
      "Diversiunea",
      "Complotul",
      "Asocierea împotriva ordinii constituționale"
    ]
  },

  {
    id: "forte_armate",
    name: "Infracțiuni militare",
    description: "Infracțiuni contra capacității de luptă",
    articles: ["Art. 413-437 C.pen."],
    subcategories: [
      "Dezertarea",
      "Trecerea frauduloasă a frontierei de către militari",
      "Refuzul de a executa o dispoziție",
      "Revolta",
      "Distrugerea sau degradarea bunurilor militare",
      "Abandonarea postului",
      "Infracțiuni în timp de război"
    ]
  },

  {
    id: "genocid_umanitate_razboi",
    name: "Genocid, crime contra umanității și de război",
    description: "Crime împotriva umanității și dreptului internațional",
    articles: ["Art. 438-445 C.pen."],
    subcategories: [
      "Genocid",
      "Crime contra umanității",
      "Crime de război",
      "Violarea legilor și obiceiurilor războiului",
      "Utilizarea armelor interzise"
    ]
  }
];

// Helper function to get all subcategories formatted like civil law
export function getAllPenalSubcategories(): string[] {
  const allSubcategories: string[] = [];

  PENAL_LAW_CATEGORIES.forEach(category => {
    category.subcategories.forEach(subcat => {
      allSubcategories.push(`${category.name} (${subcat})`);
    });
  });

  allSubcategories.push('Altele');

  return allSubcategories;
}

// Helper function to get subcategories by category ID
export function getPenalSubcategoriesByCategoryId(categoryId: string): string[] {
  const category = PENAL_LAW_CATEGORIES.find(c => c.id === categoryId);
  return category ? category.subcategories : [];
}

// Helper function to get category by ID
export function getPenalCategoryById(categoryId: string): PenalLawCategory | undefined {
  return PENAL_LAW_CATEGORIES.find(c => c.id === categoryId);
}

// Helper function to format subcategory for database
export function formatPenalSubcategoryForDB(categoryName: string, subcategory: string): string {
  return `${categoryName} (${subcategory})`;
}
