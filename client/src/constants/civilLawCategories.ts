// Comprehensive Civil Law Categories Structure
// Based on Romanian Civil Code (Codul Civil)

export interface CivilLawCategory {
  id: string;
  name: string;
  description: string;
  articles: string[];
  subcategories: string[];
}

export const CIVIL_LAW_CATEGORIES: CivilLawCategory[] = [
  {
    id: "persoane_fizice",
    name: "Persoane fizice",
    description: "Capacitate juridică, capacitate de exercițiu, domiciliu, reședință",
    articles: ["Art. 25-78 C.civ."],
    subcategories: [
      "Capacitatea de folosință",
      "Capacitatea de exercițiu",
      "Incapacități și interdicții",
      "Domiciliul și reședința",
      "Declararea morții și dispariția"
    ]
  },

  {
    id: "persoane_juridice",
    name: "Persoane juridice",
    description: "Înființare, funcționare, dizolvare, sediu social, reprezentare",
    articles: ["Art. 185-267 C.civ."],
    subcategories: [
      "Asociații și fundații",
      "Fuziune și divizare",
      "Dizolvare și lichidare",
      "Organe de conducere",
      "Patrimoniul persoanei juridice"
    ]
  },

  {
    id: "bunuri_clasificare",
    name: "Bunuri - Clasificare și regim juridic",
    description: "Bunuri mobile/imobile, corporale/incorporale, fungibile/nefungibile",
    articles: ["Art. 534-560 C.civ."],
    subcategories: [
      "Bunuri imobile și mobile",
      "Bunuri în circuitul civil",
      "Fructe naturale și civile",
      "Bunuri fungibile și nefungibile",
      "Patrimoniul privat și public"
    ]
  },

  {
    id: "dreptul_proprietate",
    name: "Dreptul de proprietate",
    description: "Conținut, moduri de dobândire, apărare, limitări",
    articles: ["Art. 555-653 C.civ."],
    subcategories: [
      "Atributele dreptului de proprietate",
      "Coproprietate și proprietate comună",
      "Limitări legale ale proprietății",
      "Acțiuni în apărarea proprietății",
      "Proprietatea publică și privată"
    ]
  },

  {
    id: "posesia",
    name: "Posesia",
    description: "Dobândirea, efectele, apărarea posesiei, posesia de bună/rea-credință",
    articles: ["Art. 910-930 C.civ."],
    subcategories: [
      "Posesia de bună-credință",
      "Posesia de rea-credință",
      "Viciile posesiei",
      "Acțiuni posesorii",
      "Efectele posesiei"
    ]
  },

  {
    id: "uzufruct",
    name: "Uzufruct, uz și abitație",
    description: "Constituire, exercitare, stingere, drepturi și obligații",
    articles: ["Art. 700-754 C.civ."],
    subcategories: [
      "Uzufruct legal și convențional",
      "Drepturile uzufructuarului",
      "Obligațiile uzufructuarului",
      "Stingerea uzufructului",
      "Dreptul de uz și abitație"
    ]
  },

  {
    id: "servituti",
    name: "Servituți",
    description: "Servituți legale și convenționale, constituire, exercitare, stingere",
    articles: ["Art. 755-809 C.civ."],
    subcategories: [
      "Servituți de trecere",
      "Servituți de apă",
      "Servituți de prospect și lumină",
      "Servituți convenționale",
      "Stingerea servituților"
    ]
  },

  {
    id: "superficie",
    name: "Dreptul de superficie",
    description: "Constituire, transmitere, stingere, raport cu proprietatea",
    articles: ["Art. 693-699 C.civ."],
    subcategories: [
      "Constituirea superficiei",
      "Drepturile superficiarului",
      "Transmiterea superficiei",
      "Stingerea dreptului de superficie",
      "Efectele stingerii"
    ]
  },

  {
    id: "prescriptie_achizitiva",
    name: "Prescripția achizitivă",
    description: "Condiții, termene, întrerupere, suspendare, efecte",
    articles: ["Art. 930-931, 948-970 C.civ."],
    subcategories: [
      "Prescripția de 10 ani (bună-credință)",
      "Prescripția de 30 ani (rea-credință)",
      "Întreruperea prescripției",
      "Suspendarea prescripției",
      "Efectele prescripției achizitive"
    ]
  },

  {
    id: "publicitate_imobiliara",
    name: "Publicitatea imobiliară",
    description: "Cartea funciară, înscrierea drepturilor, opozabilitate",
    articles: ["Art. 876-909 C.civ."],
    subcategories: [
      "Înscrierea în cartea funciară",
      "Efectele înscrierii",
      "Intabularea și notarea provizorie",
      "Radierea înscrierii",
      "Erori în cartea funciară"
    ]
  },

  {
    id: "formarea_contractului",
    name: "Formarea contractului",
    description: "Ofertă, acceptare, negociere, forme de validitate",
    articles: ["Art. 1178-1236 C.civ."],
    subcategories: [
      "Oferta și acceptarea",
      "Negocierea contractului",
      "Responsabilitatea precontractuală",
      "Promisiunea de contract",
      "Contractul prin corespodență"
    ]
  },

  {
    id: "conditii_validitate",
    name: "Condițiile de validitate ale contractului",
    description: "Consimțământ, capacitate, obiect, cauză",
    articles: ["Art. 1179-1236 C.civ."],
    subcategories: [
      "Consimțământul liber și neviciat",
      "Viciile de consimțământ (eroare, dol, violență)",
      "Capacitatea de a contracta",
      "Obiectul și cauza contractului",
      "Forma contractului"
    ]
  },

  {
    id: "efectele_contractului",
    name: "Efectele contractului",
    description: "Forța obligatorie, efecte între părți și față de terți",
    articles: ["Art. 1270-1326 C.civ."],
    subcategories: [
      "Forța obligatorie a contractului",
      "Buna-credință contractuală",
      "Efecte față de terți",
      "Simulația",
      "Interpretarea contractului"
    ]
  },

  {
    id: "neexecutarea_contractului",
    name: "Neexecutarea contractului",
    description: "Executare silită, daune-interese, rezoluțiune, reziliere",
    articles: ["Art. 1516-1554 C.civ."],
    subcategories: [
      "Executarea în natură",
      "Rezoluțiunea pentru neexecutare",
      "Excepția de neexecutare",
      "Daune-interese compensatorii",
      "Clauza penală"
    ]
  },

  {
    id: "nulitatea_contractului",
    name: "Nulitatea contractului",
    description: "Nulitate absolută/relativă, anulabilitate, confirmarea actului",
    articles: ["Art. 1246-1269 C.civ."],
    subcategories: [
      "Nulitatea absolută",
      "Nulitatea relativă",
      "Acțiunea în anulare",
      "Confirmarea actului anulabil",
      "Efectele nulității"
    ]
  },

  {
    id: "contracte_speciale_vanzare",
    name: "Contractul de vânzare-cumpărare",
    description: "Obligații vânzător/cumpărător, garanții, efecte",
    articles: ["Art. 1650-1766 C.civ."],
    subcategories: [
      "Obligațiile vânzătorului",
      "Obligațiile cumpărătorului",
      "Garanția pentru evicțiune",
      "Garanția pentru vicii ascunse",
      "Vânzări speciale (pe credit, cu rezerva proprietății)"
    ]
  },

  {
    id: "contracte_speciale_locatiune",
    name: "Contractul de locațiune",
    description: "Închiriere bunuri mobile/imobile, drepturi și obligații",
    articles: ["Art. 1777-1850 C.civ."],
    subcategories: [
      "Obligațiile locatorului",
      "Obligațiile locatarului",
      "Subînchirierea",
      "Încetarea locațiunii",
      "Locațiunea de bunuri imobile"
    ]
  },

  {
    id: "contracte_speciale_mandat",
    name: "Contractul de mandat",
    description: "Reprezentare, împuterniciri, obligații mandatar/mandant",
    articles: ["Art. 2009-2086 C.civ."],
    subcategories: [
      "Mandatul cu/fără reprezentare",
      "Obligațiile mandatarului",
      "Obligațiile mandantului",
      "Încetarea mandatului",
      "Mandatul aparent"
    ]
  },

  {
    id: "contracte_speciale_antrepriza",
    name: "Contractul de antrepriză și prestări servicii",
    description: "Execuție lucrări, obligații antreprenor/beneficiar",
    articles: ["Art. 1851-1886 C.civ."],
    subcategories: [
      "Obligațiile antreprenorului",
      "Obligațiile beneficiarului",
      "Răspunderea pentru vicii",
      "Receptia lucrărilor",
      "Rezilierea contractului"
    ]
  },

  {
    id: "contracte_speciale_alte",
    name: "Alte contracte speciale",
    description: "Donație, comodat, împrumut, depozit, tranzacție",
    articles: ["Art. 1011-2157 C.civ."],
    subcategories: [
      "Contractul de donație",
      "Contractul de comodat",
      "Contractul de împrumut",
      "Contractul de depozit",
      "Contractul de tranzacție"
    ]
  },

  {
    id: "obligatii_izvoare",
    name: "Izvoarele obligațiilor",
    description: "Contract, fapt juridic licit/ilicit, quasi-contract",
    articles: ["Art. 1164-1395 C.civ."],
    subcategories: [
      "Obligațiile din contract",
      "Obligațiile din fapt juridic",
      "Gestiunea de afaceri",
      "Plata nedatorată",
      "Îmbogățirea fără justă cauză"
    ]
  },

  {
    id: "obligatii_executare",
    name: "Executarea și transmiterea obligațiilor",
    description: "Plata, novație, compensație, cesiune de creanță",
    articles: ["Art. 1469-1515 C.civ."],
    subcategories: [
      "Executarea obligațiilor",
      "Daținrea în plată",
      "Novația",
      "Compensația",
      "Cesiunea de creanță"
    ]
  },

  {
    id: "obligatii_stingere",
    name: "Stingerea obligațiilor",
    description: "Plată, confuziune, remitere de datorie, imposibilitate",
    articles: ["Art. 1469-1515 C.civ."],
    subcategories: [
      "Plata",
      "Confuziunea",
      "Remiterea de datorie",
      "Imposibilitatea fortuită",
      "Prescripția extinctivă"
    ]
  },

  {
    id: "prescriptie_extinctiva",
    name: "Prescripția extinctivă",
    description: "Termene, întrerupere, suspendare, efecte",
    articles: ["Art. 2500-2530 C.civ."],
    subcategories: [
      "Termenul prescripției extinctive",
      "Întreruperea prescripției",
      "Suspendarea prescripției",
      "Efectele prescripției",
      "Renunțarea la prescripție"
    ]
  },

  {
    id: "raspundere_civila",
    name: "Răspunderea civilă delictuală",
    description: "Fapta ilicită, prejudiciu, raport de cauzalitate, daune",
    articles: ["Art. 1349-1395 C.civ."],
    subcategories: [
      "Condițiile răspunderii civile",
      "Culpa și gradul de culpă",
      "Prejudiciul material și moral",
      "Raportul de cauzalitate",
      "Cauze exoneratoare"
    ]
  },

  {
    id: "raspundere_obiectiva",
    name: "Răspunderi speciale și obiective",
    description: "Comitent, părinți, proprietar, deținător animale/bunuri",
    articles: ["Art. 1373-1395 C.civ."],
    subcategories: [
      "Răspunderea comitentului",
      "Răspunderea părinților",
      "Răspunderea pentru animale",
      "Răspunderea pentru bunuri",
      "Răspunderea pentru produse defecte"
    ]
  },

  {
    id: "garantii_reale_ipoteca",
    name: "Ipoteca",
    description: "Constituire, înscriere, rang, executare, stingere",
    articles: ["Art. 2343-2474 C.civ."],
    subcategories: [
      "Ipoteca legală, judiciară, convențională",
      "Înscrierea ipotecii",
      "Rangul ipotecii",
      "Executarea ipotecii",
      "Stingerea ipotecii"
    ]
  },

  {
    id: "garantii_reale_gaj",
    name: "Gajul și privilegiile",
    description: "Gaj mobil/imobil, privilegii generale/speciale",
    articles: ["Art. 2390-2442 C.civ."],
    subcategories: [
      "Gajul cu deposedare",
      "Gajul fără deposedare",
      "Privilegiile generale",
      "Privilegiile speciale",
      "Rangul privilegiilor"
    ]
  },

  {
    id: "garantii_personale",
    name: "Garanțiile personale",
    description: "Fidejusiune, scrisoare de garanție bancară",
    articles: ["Art. 2280-2333 C.civ."],
    subcategories: [
      "Fidejusiunea",
      "Obligațiile fidejusorului",
      "Beneficiul de discuțiune",
      "Beneficiul de diviziune",
      "Stingerea fidejusiunii"
    ]
  },

  {
    id: "succesiuni_legale",
    name: "Succesiunile legale",
    description: "Ordine de moștenire, clase de moștenitori, cote",
    articles: ["Art. 953-1011 C.civ."],
    subcategories: [
      "Clasele de moștenitori",
      "Reprezentarea succesorală",
      "Cote succesorale",
      "Dreptul de abitație al soțului supraviețuitor",
      "Nevrednicul și exclus din succesiune"
    ]
  },

  {
    id: "succesiuni_testamentare",
    name: "Succesiunile testamentare",
    description: "Testament, forme, capacitate, legat, rezervă succesorală",
    articles: ["Art. 1034-1091 C.civ."],
    subcategories: [
      "Testamentul olograf",
      "Testamentul autentic",
      "Capacitatea de a testa",
      "Legatul universal și cu titlu universal",
      "Rezerva succesorală și cotitatea disponibilă"
    ]
  },

  {
    id: "partaj_succesoral",
    name: "Partajul succesoral",
    description: "Lichidarea masei, împărțeală, raport, reducțiune",
    articles: ["Art. 1111-1163 C.civ."],
    subcategories: [
      "Masa succesorală",
      "Raportul donațiilor și legatelor",
      "Reducțiunea liberalităților excesive",
      "Partajul bunurilor",
      "Efectele partajului"
    ]
  },

  {
    id: "familie_casatorie",
    name: "Căsătoria",
    description: "Condiții, efecte, regimuri matrimoniale",
    articles: ["Art. 258-383 C.civ."],
    subcategories: [
      "Condițiile de fond și formă",
      "Efectele căsătoriei",
      "Regimul legal (comunitate)",
      "Regimul separației de bunuri",
      "Nulitatea căsătoriei"
    ]
  },

  {
    id: "familie_divort",
    name: "Divorțul",
    description: "Cauze, procedură, efecte, contribuție creștere copii",
    articles: ["Art. 373-383 C.civ."],
    subcategories: [
      "Divorțul prin consimțământul soților",
      "Divorțul pentru culpă",
      "Divorțul pentru destrămarea căsătoriei",
      "Efectele divorțului",
      "Partajul bunurilor la desfacerea căsătoriei"
    ]
  },

  {
    id: "familie_filiatie",
    name: "Filiația și autoritatea părintească",
    description: "Stabilirea filiației, adopție, obligații părinți-copii",
    articles: ["Art. 408-515 C.civ."],
    subcategories: [
      "Filiația din căsătorie",
      "Filiația din afara căsătoriei",
      "Adopția",
      "Autoritatea părintească",
      "Obligația de întreținere"
    ]
  }
];

// Helper function to get all subcategories for dropdown
export function getAllCivilSubcategories(): string[] {
  const allSubcategories: string[] = [];

  CIVIL_LAW_CATEGORIES.forEach(category => {
    category.subcategories.forEach(subcat => {
      allSubcategories.push(`${category.name} (${subcat})`);
    });
  });

  allSubcategories.push('Altele');

  return allSubcategories;
}

// Helper function to get subcategories by category
export function getSubcategoriesByCategory(categoryId: string): string[] {
  const category = CIVIL_LAW_CATEGORIES.find(c => c.id === categoryId);
  return category ? category.subcategories : [];
}

// Helper function to format subcategory for database
export function formatSubcategoryForDB(categoryName: string, subcategory: string): string {
  return `${categoryName} (${subcategory})`;
}
