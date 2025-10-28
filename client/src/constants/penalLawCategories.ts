// Comprehensive Penal Law Categories Structure
// Based on Romanian Penal Code (Codul Penal) - Official Table of Contents
// Structure: Parte > Titlu > Capitol > Secțiune

export interface PenalLawCategory {
  id: string;
  name: string;
  description: string;
  articles: string[];
  subcategories: string[];
  part?: 'GENERALĂ' | 'SPECIALĂ'; // Partea GENERALĂ or Partea SPECIALĂ
}

// ==================== PARTEA GENERALĂ ====================

export const PENAL_LAW_CATEGORIES: PenalLawCategory[] = [
  // Titlul I - Legea penală și limitele ei de aplicare
  {
    id: "titlul_i_legea_penala",
    name: "Titlul I - Legea penală și limitele ei de aplicare",
    description: "Principii generale, aplicarea legii penale în timp și spațiu",
    articles: ["Art. 1-14 C.pen."],
    part: "GENERALĂ",
    subcategories: [
      "Capitolul I - Principii generale",
      "Capitolul II - Aplicarea legii penale",
      "Secțiunea 1 - Aplicarea legii penale în timp",
      "Secțiunea a 2-a - Aplicarea legii penale în spațiu"
    ]
  },

  // Titlul II - Infracțiunea
  {
    id: "titlul_ii_infractiunea",
    name: "Titlul II - Infracțiunea",
    description: "Trăsături esențiale, cauze justificative, tentativa, participanții",
    articles: ["Art. 15-52 C.pen."],
    part: "GENERALĂ",
    subcategories: [
      "Capitolul I - Dispoziții generale",
      "Capitolul II - Cauzele justificative",
      "Capitolul III - Cauzele de neimputabilitate",
      "Capitolul IV - Tentativa",
      "Capitolul V - Unitatea și pluralitatea de infracțiuni",
      "Capitolul VI - Autorul și participanții"
    ]
  },

  // Titlul III - Pedepsele
  {
    id: "titlul_iii_pedepsele",
    name: "Titlul III - Pedepsele",
    description: "Categorii, pedeapsa accesorie, individualizare, circumstanțe atenuante/agravante",
    articles: ["Art. 53-106 C.pen."],
    part: "GENERALĂ",
    subcategories: [
      "Capitolul I - Categoriile pedepselor",
      "Capitolul II - Pedepsele principale",
      "Secțiunea 1 - Detențiunea pe viață",
      "Secțiunea a 2-a - Închisoarea",
      "Secțiunea a 3-a - Amenda",
      "Capitolul III - Pedeapsa accesorie și pedepsele complementare",
      "Secțiunea 1 - Pedeapsa accesorie",
      "Secțiunea a 2-a - Pedepsele complementare",
      "Capitolul IV - Calculul duratei pedepselor",
      "Capitolul V - Individualizarea pedepselor",
      "Secțiunea 1 - Dispoziții generale",
      "Secțiunea a 2-a - Circumstanțele atenuante și circumstanțele agravante",
      "Secțiunea a 3-a - Renunțarea la aplicarea pedepsei",
      "Secțiunea a 4-a - Amânarea aplicării pedepsei",
      "Secțiunea a 5-a - Suspendarea executării pedepsei sub supraveghere",
      "Secțiunea a 6-a - Liberarea condiționată"
    ]
  },

  // Titlul IV - Măsurile de siguranță
  {
    id: "titlul_iv_masuri_siguranta",
    name: "Titlul IV - Măsurile de siguranță",
    description: "Dispoziții generale, regimul măsurilor de siguranță",
    articles: ["Art. 107-112 C.pen."],
    part: "GENERALĂ",
    subcategories: [
      "Capitolul I - Dispoziții generale",
      "Capitolul II - Regimul măsurilor de siguranță"
    ]
  },

  // Titlul V - Minoritatea
  {
    id: "titlul_v_minoritatea",
    name: "Titlul V - Minoritatea",
    description: "Răspunderea penală a minorului, măsuri educative",
    articles: ["Art. 113-134 C.pen."],
    part: "GENERALĂ",
    subcategories: [
      "Capitolul I - Regimul răspunderii penale a minorului",
      "Capitolul II - Regimul măsurilor educative neprivative de libertate",
      "Capitolul III - Regimul măsurilor educative privative de libertate",
      "Capitolul IV - Dispoziții comune"
    ]
  },

  // Titlul VI - Răspunderea penală a persoanei juridice
  {
    id: "titlul_vi_persoana_juridica",
    name: "Titlul VI - Răspunderea penală a persoanei juridice",
    description: "Condițiile și regimul răspunderii penale a persoanei juridice",
    articles: ["Art. 135-151 C.pen."],
    part: "GENERALĂ",
    subcategories: [
      "Capitolul I - Dispoziții generale",
      "Capitolul II - Regimul pedepselor complementare aplicate persoanei juridice",
      "Capitolul III - Dispoziții comune"
    ]
  },

  // Titlul VII - Cauzele care înlătură răspunderea penală
  {
    id: "titlul_vii_inlaturare_raspundere",
    name: "Titlul VII - Cauzele care înlătură răspunderea penală",
    description: "Amnistie, prescripție, lipsa plângerii prealabile, împăcare",
    articles: ["Art. 152-159 C.pen."],
    part: "GENERALĂ",
    subcategories: [
      "Amnistia",
      "Prescripția răspunderii penale",
      "Lipsa plângerii prealabile",
      "Retragerea plângerii prealabile",
      "Împăcarea"
    ]
  },

  // Titlul VIII - Cauzele care înlătură sau modifică executarea pedepsei
  {
    id: "titlul_viii_executare_pedeapsa",
    name: "Titlul VIII - Cauzele care înlătură sau modifică executarea pedepsei",
    description: "Grațierea, amnistia post-condamnatorie, prescripția executării pedepsei",
    articles: ["Art. 160-164 C.pen."],
    part: "GENERALĂ",
    subcategories: [
      "Grațierea",
      "Amnistia post-condamnatorie",
      "Prescripția executării pedepsei"
    ]
  },

  // Titlul IX - Cauzele care înlătură consecințele condamnării
  {
    id: "titlul_ix_consecinte_condamnare",
    name: "Titlul IX - Cauzele care înlătură consecințele condamnării",
    description: "Reabilitarea, reabilitarea de drept, reabilitarea judecătorească",
    articles: ["Art. 165-171 C.pen."],
    part: "GENERALĂ",
    subcategories: [
      "Reabilitarea de drept",
      "Reabilitarea judecătorească",
      "Efectele reabilitării"
    ]
  },

  // Titlul X - Înțelesul unor termeni sau expresii în legea penală
  {
    id: "titlul_x_inteles_termeni",
    name: "Titlul X - Înțelesul unor termeni sau expresii în legea penală",
    description: "Definiții și clarificări terminologice",
    articles: ["Art. 172-187 C.pen."],
    part: "GENERALĂ",
    subcategories: [
      "Funcționar public",
      "Înscris",
      "Valori",
      "Violență",
      "Bunuri",
      "Alte definiții legale"
    ]
  },

  // ==================== PARTEA SPECIALĂ ====================

  // Titlul I - Infracțiuni contra persoanei
  {
    id: "titlul_i_contra_persoanei",
    name: "Titlul I - Infracțiuni contra persoanei",
    description: "Infracțiuni contra vieții, integrității corporale, libertății persoanei",
    articles: ["Art. 188-227 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Capitolul I - Infracțiuni contra vieții",
      "Capitolul II - Infracțiuni contra integrității corporale sau sănătății",
      "Capitolul III - Infracțiuni săvârșite asupra unui membru de familie",
      "Capitolul IV - Agresiuni asupra fătului",
      "Capitolul V - Infracțiuni privind obligația de asistență a celor în primejdie",
      "Capitolul VI - Infracțiuni contra libertății persoanei",
      "Capitolul VII - Traficul și exploatarea persoanelor vulnerabile",
      "Capitolul VIII - Infracțiuni contra libertății și integrității sexuale",
      "Capitolul IX - Infracțiuni ce aduc atingere domiciliului și vieții private"
    ]
  },

  // Titlul II - Infracțiuni contra patrimoniului
  {
    id: "titlul_ii_contra_patrimoniului",
    name: "Titlul II - Infracțiuni contra patrimoniului",
    description: "Furt, tâlhărie, înșelăciune, fraude și alte infracțiuni patrimoniale",
    articles: ["Art. 228-256 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Capitolul I - Furtul",
      "Capitolul II - Tâlhăria și pirateria",
      "Capitolul III - Infracțiuni contra patrimoniului prin nesocotirea încrederii",
      "Capitolul IV - Fraude comise prin sisteme informatice și mijloace de plată electronice",
      "Capitolul V - Distrugerea și tulburarea de posesie"
    ]
  },

  // Titlul III - Infracțiuni privind autoritatea și frontiera de stat
  {
    id: "titlul_iii_autoritate_frontiera",
    name: "Titlul III - Infracțiuni privind autoritatea și frontiera de stat",
    description: "Ultraj, evadare, trecerea frauduloasă a frontierei",
    articles: ["Art. 257-265 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Capitolul I - Infracțiuni contra autorității",
      "Capitolul II - Infracțiuni privind frontiera de stat"
    ]
  },

  // Titlul IV - Infracțiuni contra înfăptuirii justiției
  {
    id: "titlul_iv_infaptuirea_justitiei",
    name: "Titlul IV - Infracțiuni contra înfăptuirii justiției",
    description: "Mărturie mincinoasă, favorizarea infractorului, ultraj",
    articles: ["Art. 266-288 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Mărturie mincinoasă",
      "Favorizarea infractorului",
      "Sustragerea de la urmărire sau judecată",
      "Îngrădirea exercitării drepturilor",
      "Ultraj și alte infracțiuni"
    ]
  },

  // Titlul V - Infracțiuni de corupție și de serviciu
  {
    id: "titlul_v_coruptie_serviciu",
    name: "Titlul V - Infracțiuni de corupție și de serviciu",
    description: "Luare/dare de mită, trafic de influență, abuz în serviciu",
    articles: ["Art. 289-309 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Capitolul I - Infracțiuni de corupție",
      "Capitolul II - Infracțiuni de serviciu"
    ]
  },

  // Titlul VI - Infracțiuni de fals
  {
    id: "titlul_vi_fals",
    name: "Titlul VI - Infracțiuni de fals",
    description: "Falsificarea de monede, timbre, înscrisuri și alte valori",
    articles: ["Art. 310-328 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Capitolul I - Falsificarea de monede, timbre sau de alte valori",
      "Capitolul II - Falsificarea instrumentelor de autentificare sau de marcare",
      "Capitolul III - Falsuri în înscrisuri"
    ]
  },

  // Titlul VII - Infracțiuni contra siguranței publice
  {
    id: "titlul_vii_siguranta_publica",
    name: "Titlul VII - Infracțiuni contra siguranței publice",
    description: "Siguranța circulației, regimul armelor, sănătate publică, securitate IT",
    articles: ["Art. 329-366 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Capitolul I - Infracțiuni contra siguranței circulației pe căile ferate",
      "Capitolul II - Infracțiuni contra siguranței circulației pe drumurile publice",
      "Capitolul III - Nerespectarea regimului armelor, munițiilor, materialelor nucleare și al materiilor explozive",
      "Capitolul IV - Infracțiuni privitoare la regimul stabilit pentru alte activități reglementate de lege",
      "Capitolul V - Infracțiuni contra sănătății publice",
      "Capitolul VI - Infracțiuni contra siguranței și integrității sistemelor și datelor informatice"
    ]
  },

  // Titlul VIII - Infracțiuni care aduc atingere unor relații privind conviețuirea socială
  {
    id: "titlul_viii_convietuire_sociala",
    name: "Titlul VIII - Infracțiuni contra convietuirii sociale",
    description: "Tulburarea ordinii publice, infracțiuni contra familiei și libertății religioase",
    articles: ["Art. 367-384 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Capitolul I - Infracțiuni contra ordinii și liniștii publice",
      "Capitolul II - Infracțiuni contra familiei",
      "Capitolul III - Infracțiuni contra libertății religioase și respectului datorat persoanelor decedate"
    ]
  },

  // Titlul IX - Infracțiuni electorale
  {
    id: "titlul_ix_electorale",
    name: "Titlul IX - Infracțiuni electorale",
    description: "Infracțiuni legate de procesul electoral și votul democratic",
    articles: ["Art. 385-393 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Coruperea alegătorilor",
      "Fraudarea alegerilor",
      "Împiedicarea exercitării drepturilor electorale",
      "Alte infracțiuni electorale"
    ]
  },

  // Titlul X - Infracțiuni contra securității naționale
  {
    id: "titlul_x_securitate_nationala",
    name: "Titlul X - Infracțiuni contra securității naționale",
    description: "Trădare, spionaj, sabotaj și alte infracțiuni contra statului",
    articles: ["Art. 394-412 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Trădarea",
      "Spionajul",
      "Sabotajul",
      "Diversiunea",
      "Asocierea în vederea săvârșirii de infracțiuni contra securității naționale"
    ]
  },

  // Titlul XI - Infracțiuni contra capacității de luptă a forțelor armate
  {
    id: "titlul_xi_forte_armate",
    name: "Titlul XI - Infracțiuni contra capacității de luptă a forțelor armate",
    description: "Infracțiuni militare specifice",
    articles: ["Art. 413-437 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Capitolul I - Infracțiuni săvârșite de militari",
      "Capitolul II - Infracțiuni săvârșite de militari sau de civili"
    ]
  },

  // Titlul XII - Infracțiuni de genocid, contra umanității și de război
  {
    id: "titlul_xii_genocid_umanitate_razboi",
    name: "Titlul XII - Infracțiuni de genocid, contra umanității și de război",
    description: "Crime împotriva umanității și dreptului internațional umanitar",
    articles: ["Art. 438-445 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Capitolul I - Infracțiuni de genocid și contra umanității",
      "Capitolul II - Infracțiuni de război"
    ]
  },

  // Titlul XIII - Dispoziții finale
  {
    id: "titlul_xiii_dispozitii_finale",
    name: "Titlul XIII - Dispoziții finale",
    description: "Dispoziții finale și tranzitorii",
    articles: ["Art. 446 C.pen."],
    part: "SPECIALĂ",
    subcategories: [
      "Dispoziții finale"
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

// Helper function to get categories by part (GENERALĂ or SPECIALĂ)
export function getPenalCategoriesByPart(part: 'GENERALĂ' | 'SPECIALĂ'): PenalLawCategory[] {
  return PENAL_LAW_CATEGORIES.filter(c => c.part === part);
}

// Get Partea GENERALĂ categories
export const PENAL_PARTEA_GENERALA = getPenalCategoriesByPart('GENERALĂ');

// Get Partea SPECIALĂ categories
export const PENAL_PARTEA_SPECIALA = getPenalCategoriesByPart('SPECIALĂ');
