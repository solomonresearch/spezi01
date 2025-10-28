// Comprehensive Penal Law Categories Structure
// Based on Romanian Penal Code (Codul Penal)

export interface PenalLawCategory {
  id: string;
  name: string;
  description: string;
  articles: string[];
  subcategories: string[];
}

export const PENAL_LAW_CATEGORIES: PenalLawCategory[] = [
  {
    id: "infractiuni_contra_persoanei",
    name: "Infracțiuni contra persoanei",
    description: "Infracțiuni care aduc atingere vieții, integrității corporale, libertății și vieții private",
    articles: ["Art. 188-227 C.pen."],
    subcategories: [
      "Infracțiuni contra vieții",
      "Infracțiuni contra integrității corporale sau sănătății",
      "Infracțiuni săvârșite asupra unui membru de familie",
      "Agresiuni asupra fătului",
      "Infracțiuni privind obligația de asistență a celor în primejdie",
      "Infracțiuni contra libertății persoanei",
      "Traficul și exploatarea persoanelor vulnerabile",
      "Infracțiuni contra libertății și integrității sexuale",
      "Infracțiuni ce aduc atingere domiciliului și vieții private"
    ]
  },

  {
    id: "infractiuni_contra_patrimoniului",
    name: "Infracțiuni contra patrimoniului",
    description: "Furt, tâlhărie, înșelăciune, fraude și alte infracțiuni patrimoniale",
    articles: ["Art. 228-256 C.pen."],
    subcategories: [
      "Furtul",
      "Tâlhăria și pirateria",
      "Infracțiuni contra patrimoniului prin nesocotirea încrederii",
      "Fraude comise prin sisteme informatice și mijloace de plată electronice",
      "Distrugerea și tulburarea de posesie"
    ]
  },

  {
    id: "infractiuni_autoritate_frontiera",
    name: "Infracțiuni privind autoritatea și frontiera de stat",
    description: "Infracțiuni contra autorității publice și frontierei naționale",
    articles: ["Art. 257-265 C.pen."],
    subcategories: [
      "Infracțiuni contra autorității",
      "Infracțiuni privind frontiera de stat"
    ]
  },

  {
    id: "infractiuni_infaptuirea_justitiei",
    name: "Infracțiuni contra înfăptuirii justiției",
    description: "Mărturie mincinoasă, favorizarea infractorului, fals intelectual",
    articles: ["Art. 266-288 C.pen."],
    subcategories: [
      "Mărturie mincinoasă",
      "Favorizarea infractorului",
      "Sustragerea de la urmărire sau judecată",
      "Îngrădirea exercitării drepturilor",
      "Ultraj și alte infracțiuni"
    ]
  },

  {
    id: "infractiuni_coruptie_serviciu",
    name: "Infracțiuni de corupție și de serviciu",
    description: "Luare/dare de mită, trafic de influență, abuz în serviciu",
    articles: ["Art. 289-309 C.pen."],
    subcategories: [
      "Infracțiuni de corupție",
      "Infracțiuni de serviciu"
    ]
  },

  {
    id: "infractiuni_fals",
    name: "Infracțiuni de fals",
    description: "Falsificarea de monede, timbre, înscrisuri și alte valori",
    articles: ["Art. 310-328 C.pen."],
    subcategories: [
      "Falsificarea de monede, timbre sau de alte valori",
      "Falsificarea instrumentelor de autentificare sau de marcare",
      "Falsuri în înscrisuri"
    ]
  },

  {
    id: "infractiuni_siguranta_publica",
    name: "Infracțiuni contra siguranței publice",
    description: "Siguranța circulației, regimul armelor, sănătate publică, securitate IT",
    articles: ["Art. 329-366 C.pen."],
    subcategories: [
      "Infracțiuni contra siguranței circulației pe căile ferate",
      "Infracțiuni contra siguranței circulației pe drumurile publice",
      "Nerespectarea regimului armelor, munițiilor, materialelor nucleare și al materiilor explozive",
      "Infracțiuni privitoare la regimul stabilit pentru alte activități reglementate de lege",
      "Infracțiuni contra sănătății publice",
      "Infracțiuni contra siguranței și integrității sistemelor și datelor informatice"
    ]
  },

  {
    id: "infractiuni_convietuire_sociala",
    name: "Infracțiuni contra convietuirii sociale",
    description: "Tulburarea ordinii publice, infracțiuni contra familiei și libertății religioase",
    articles: ["Art. 367-384 C.pen."],
    subcategories: [
      "Infracțiuni contra ordinii și liniștii publice",
      "Infracțiuni contra familiei",
      "Infracțiuni contra libertății religioase și respectului datorat persoanelor decedate"
    ]
  },

  {
    id: "infractiuni_electorale",
    name: "Infracțiuni electorale",
    description: "Infracțiuni legate de procesul electoral și votul democratic",
    articles: ["Art. 385-393 C.pen."],
    subcategories: [
      "Coruperea alegătorilor",
      "Fraudarea alegerilor",
      "Împiedicarea exercitării drepturilor electorale",
      "Alte infracțiuni electorale"
    ]
  },

  {
    id: "infractiuni_securitate_nationala",
    name: "Infracțiuni contra securității naționale",
    description: "Trădare, spionaj, sabotaj și alte infracțiuni contra statului",
    articles: ["Art. 394-412 C.pen."],
    subcategories: [
      "Trădarea",
      "Spionajul",
      "Sabotajul",
      "Diversiunea",
      "Asocierea în vederea săvârșirii de infracțiuni contra securității naționale"
    ]
  },

  {
    id: "infractiuni_forte_armate",
    name: "Infracțiuni contra capacității de luptă a forțelor armate",
    description: "Infracțiuni militare specifice",
    articles: ["Art. 413-437 C.pen."],
    subcategories: [
      "Infracțiuni săvârșite de militari",
      "Infracțiuni săvârșite de militari sau de civili"
    ]
  },

  {
    id: "genocid_umanitate_razboi",
    name: "Infracțiuni de genocid, contra umanității și de război",
    description: "Crime împotriva umanității și dreptului internațional umanitar",
    articles: ["Art. 438-445 C.pen."],
    subcategories: [
      "Infracțiuni de genocid și contra umanității",
      "Infracțiuni de război"
    ]
  },

  // General Theory Categories (Partea Generală)
  {
    id: "teoria_generala_infractiune",
    name: "Teoria generală a infracțiunii",
    description: "Element material, vinovăție, tentativă, forme de participație",
    articles: ["Art. 15-52 C.pen."],
    subcategories: [
      "Trăsăturile esențiale ale infracțiunii",
      "Vinovăția (intenție și culpă)",
      "Cauzele justificative",
      "Cauzele de neimputabilitate",
      "Tentativa",
      "Unitatea și pluralitatea de infracțiuni",
      "Autorul și participanții"
    ]
  },

  {
    id: "pedepse_sanctiuni",
    name: "Pedepse și sancțiuni penale",
    description: "Categorii de pedepse, individualizare, măsuri de siguranță",
    articles: ["Art. 53-112 C.pen."],
    subcategories: [
      "Categoriile pedepselor",
      "Pedepsele principale",
      "Pedeapsa accesorie și pedepsele complementare",
      "Individualizarea pedepselor",
      "Circumstanțe atenuante și agravante",
      "Renunțarea la aplicarea pedepsei",
      "Amânarea aplicării pedepsei",
      "Suspendarea executării pedepsei sub supraveghere",
      "Liberarea condiționată",
      "Măsurile de siguranță"
    ]
  },

  {
    id: "raspundere_persoana_juridica",
    name: "Răspunderea penală a persoanei juridice",
    description: "Condiții, pedepse complementare, măsuri de siguranță",
    articles: ["Art. 135-151 C.pen."],
    subcategories: [
      "Dispoziții generale",
      "Regimul pedepselor complementare aplicate persoanei juridice",
      "Dispoziții comune"
    ]
  },

  {
    id: "cauze_inlaturare_raspundere",
    name: "Cauze care înlătură răspunderea penală",
    description: "Amnistie, prescripție, lipsa plângerii prealabile",
    articles: ["Art. 152-159 C.pen."],
    subcategories: [
      "Amnistia",
      "Prescripția răspunderii penale",
      "Lipsa plângerii prealabile",
      "Retragerea plângerii prealabile",
      "Împăcarea"
    ]
  },

  {
    id: "aplicarea_legii_penale",
    name: "Aplicarea legii penale",
    description: "Aplicarea în timp și spațiu, legalitate, imunitate",
    articles: ["Art. 1-14 C.pen."],
    subcategories: [
      "Principii generale (legalitate)",
      "Aplicarea legii penale în timp",
      "Aplicarea legii penale în spațiu",
      "Legea penală și tratatele internaționale",
      "Extrădarea"
    ]
  }
];

// Helper function to get all subcategories as a flat array
export function getAllPenalSubcategories(): string[] {
  return PENAL_LAW_CATEGORIES.flatMap(category => category.subcategories);
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
