#!/usr/bin/env node

/**
 * Use Claude AI to classify all cases into categories and subcategories
 * based on their content
 */

const { Client } = require('pg');
const Anthropic = require('@anthropic-ai/sdk');

const connectionString = 'postgresql://postgres.pgprhlzpzegwfwcbsrww:3S_LRQm!gnJf3V$@aws-1-eu-north-1.pooler.supabase.com:6543/postgres';

// Civil Law Categories from our taxonomy
const CIVIL_LAW_CATEGORIES = [
  {
    id: "persoane_fizice",
    name: "Persoane fizice",
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
    subcategories: [
      "Filiația din căsătorie",
      "Filiația din afara căsătoriei",
      "Adopția",
      "Autoritatea părintească",
      "Obligația de întreținere"
    ]
  },
  {
    id: "altele",
    name: "Altele",
    subcategories: ["Altele"]
  }
];

// Initialize Anthropic client
// Set ANTHROPIC_API_KEY environment variable before running this script
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.VITE_CLAUDE_API_KEY
});

if (!process.env.ANTHROPIC_API_KEY && !process.env.VITE_CLAUDE_API_KEY) {
  console.error('❌ Error: ANTHROPIC_API_KEY or VITE_CLAUDE_API_KEY environment variable must be set');
  console.error('   Export it before running: export ANTHROPIC_API_KEY=your_key_here');
  process.exit(1);
}

async function classifyWithAI(caseData) {
  const prompt = `You are a Romanian civil law expert. Analyze this legal case and classify it into the most appropriate category and subcategory from the taxonomy below.

CASE INFORMATION:
Title: ${caseData.title}
Legal Problem: ${caseData.legal_problem}
Case Description: ${caseData.case_description}
Question: ${caseData.question}
${caseData.articles ? `Relevant Articles: ${caseData.articles}` : ''}

AVAILABLE CATEGORIES AND SUBCATEGORIES:
${CIVIL_LAW_CATEGORIES.map((cat, idx) =>
  `${idx + 1}. ${cat.name}
   Subcategories: ${cat.subcategories.join(', ')}`
).join('\n\n')}

INSTRUCTIONS:
1. Read and analyze the case content carefully
2. Identify the main legal area and specific topic
3. Select the MOST APPROPRIATE category and subcategory
4. Respond ONLY with valid JSON in this exact format:

{
  "category": "Category Name",
  "subcategory": "Subcategory Name",
  "reasoning": "Brief explanation (1 sentence)"
}

IMPORTANT:
- Use exact category and subcategory names from the list above
- If the case doesn't fit any category well, use "Altele" / "Altele"
- Be precise and specific in your classification`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].text;

    // Extract JSON from response (in case there's extra text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const classification = JSON.parse(jsonMatch[0]);

    // Validate the classification
    const categoryExists = CIVIL_LAW_CATEGORIES.find(c => c.name === classification.category);
    if (!categoryExists) {
      console.warn(`Warning: AI returned invalid category "${classification.category}". Using "Altele".`);
      return { category: 'Altele', subcategory: 'Altele', reasoning: 'Invalid category' };
    }

    const subcategoryExists = categoryExists.subcategories.includes(classification.subcategory);
    if (!subcategoryExists) {
      console.warn(`Warning: AI returned invalid subcategory "${classification.subcategory}". Using first subcategory.`);
      classification.subcategory = categoryExists.subcategories[0];
    }

    return classification;
  } catch (error) {
    console.error('AI classification error:', error.message);
    return { category: 'Altele', subcategory: 'Altele', reasoning: 'Classification failed' };
  }
}

async function classifyAllCases() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🤖 Starting AI-powered case classification...\n');

    // Get all civil cases
    const { rows: cases } = await client.query(`
      SELECT
        id,
        case_code,
        title,
        legal_problem,
        case_description,
        question,
        subcategory,
        category
      FROM cases
      WHERE case_code LIKE 'CIV%'
      ORDER BY case_code;
    `);

    console.log(`Found ${cases.length} civil cases to classify\n`);
    console.log('═'.repeat(80));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < cases.length; i++) {
      const caseData = cases[i];
      console.log(`\n[${i + 1}/${cases.length}] ${caseData.case_code}: ${caseData.title}`);
      console.log(`  Current: ${caseData.category || '(null)'} / ${caseData.subcategory || '(null)'}`);

      // Get articles for this case
      const { rows: articles } = await client.query(`
        SELECT article_reference
        FROM case_articles
        WHERE case_id = $1;
      `, [caseData.id]);

      caseData.articles = articles.map(a => a.article_reference).join(', ');

      // Classify with AI
      console.log('  🤖 Classifying with Claude AI...');
      const classification = await classifyWithAI(caseData);

      if (classification.category !== 'Altele' || classification.subcategory !== 'Altele') {
        console.log(`  ✅ AI: ${classification.category} / ${classification.subcategory}`);
        console.log(`  💡 ${classification.reasoning}`);

        // Update database
        const formattedSubcategory = classification.subcategory === 'Altele'
          ? 'Altele'
          : `${classification.category} (${classification.subcategory})`;

        await client.query(`
          UPDATE cases
          SET
            category = $1,
            subcategory = $2,
            updated_at = NOW()
          WHERE id = $3;
        `, [classification.category, formattedSubcategory, caseData.id]);

        successCount++;
      } else {
        console.log(`  ⚠️  Classified as Altele`);
        errorCount++;
      }

      // Rate limiting: small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n\n═'.repeat(80));
    console.log('CLASSIFICATION COMPLETE');
    console.log('═'.repeat(80));
    console.log(`✅ Successfully classified: ${successCount} cases`);
    console.log(`⚠️  Classified as Altele: ${errorCount} cases`);

    // Show final distribution
    console.log('\n📊 Final distribution by category:\n');
    const { rows: distribution } = await client.query(`
      SELECT
        category,
        COUNT(*) as count
      FROM cases
      WHERE case_code LIKE 'CIV%'
      GROUP BY category
      ORDER BY count DESC, category;
    `);

    distribution.forEach(row => {
      console.log(`  ${(row.category || '(null)').padEnd(45)} ${row.count.toString().padStart(3)} cases`);
    });

    console.log('\n✅ All cases classified!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

classifyAllCases();
