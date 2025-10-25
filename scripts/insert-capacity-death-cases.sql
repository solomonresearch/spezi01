-- Insert legal cases for "Capacitatea de folosință. Declararea judecătorească a morții"
-- 15 cases: 5 Easy (Ușor), 5 Medium (Mediu), 5 Hard (Dificil)

-- ============================================================================
-- CAZURI UȘOARE (Easy Cases) - Capacitatea de folosință
-- ============================================================================

-- Caz 1: Moștenirea copilului conceput
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 1: Moștenirea copilului conceput',
    'Ușor',
    1,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Capacitatea de folosință a copilului conceput și dreptul acestuia de a moșteni.',
    'Maria este însărcinată în luna a șasea când soțul ei, Ion, decedează într-un accident de mașină. Ion lasă o moștenire constând într-un apartament și economii de 100.000 lei. La câteva luni după deces, Maria naște un băiețel sănătos, pe nume Andrei. Fratele lui Ion, Pavel, contestă dreptul copilului Andrei de a moșteni, susținând că acesta nu era născut la momentul deschiderii succesiunii și prin urmare nu are capacitate de folosință.',
    'Are copilul Andrei dreptul de a moșteni de la tatăl său decedat?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 1: Moștenirea copilului conceput';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '35', 'Art. 35'),
        (case_id, '36', 'Art. 36'), (case_id, '957', 'Art. 957');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea momentului dobândirii capacității de folosință conform art. 34 (de la naștere și retroactiv pentru conceput dacă se naște viu)'),
        (case_id, 2, 'Analiza excepției prevăzute de art. 36 alin. 1 (copilul conceput este considerat născut când este vorba de interesele sale)'),
        (case_id, 3, 'Verificarea condiției pentru aplicarea ficțiunii juridice (copilul să se nască viu)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (Andrei are drept de moștenire - "infans conceptus pro nato habetur")');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Consultați art. 34 privind momentul dobândirii capacității de folosință'),
        (case_id, 2, 'Verificați art. 36 alin. 1 despre ficțiunea juridică "infans conceptus pro nato habetur"'),
        (case_id, 3, 'Copilul trebuie să se nască viu pentru a beneficia de drepturi'),
        (case_id, 4, 'Moștenirea se deschide la data decesului, dar copilul conceput poate moșteni');
END $$;

-- Caz 2: Donația către copilul nenăscut
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 2: Donația către copilul nenăscut',
    'Ușor',
    1,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Validitatea unei donații făcute în favoarea unui copil conceput dar nenăscut încă.',
    'Bunicul Gheorghe dorește să facă o donație de 50.000 lei fiicei sale Maria, care este însărcinată în luna a cincea, specificând în actul de donație că banii sunt destinați copilului nenăscut. Maria acceptă donația în numele copilului. După trei luni, Maria naște o fetiță sănătoasă, Elena. Un văr al Mariei, Cristian, contestă donația, afirmând că la momentul donației copilul nu avea capacitate de folosință și prin urmare donația este nulă.',
    'Este valabilă donația făcută de Gheorghe în favoarea copilului nenăscut?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 2: Donația către copilul nenăscut';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '36', 'Art. 36'),
        (case_id, '985', 'Art. 985');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de folosință a copilului conceput (art. 34-36)'),
        (case_id, 2, 'Analiza aplicabilității art. 36 alin. 1 pentru donații (copilul conceput este considerat născut)'),
        (case_id, 3, 'Verificarea condiției suspensive (copilul să se nască viu pentru validarea donației)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (donația este valabilă - copilul s-a născut viu)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Verificați dacă art. 36 alin. 1 se aplică și la donații, nu doar la moșteniri'),
        (case_id, 2, 'Copilul conceput poate primi donații dacă se naște viu'),
        (case_id, 3, 'Care este condiția pentru ca donația să devină definitivă?'),
        (case_id, 4, 'Ficțiunea "infans conceptus pro nato habetur" protejează interesele copilului nenăscut');
END $$;

-- Caz 3: Despăgubirile pentru copilul conceput
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 3: Despăgubirile pentru copilul conceput',
    'Ușor',
    1,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Dreptul copilului conceput de a primi despăgubiri pentru decesul tatălui în accident.',
    'Ana este însărcinată în luna a patra când soțul ei, Mihai, este ucis într-un accident de muncă. Compania angajatoare oferă despăgubiri soției și copiilor defunctului. Ana solicită despăgubiri și pentru copilul pe care îl poartă în pântece. Compania refuză, argumentând că despăgubirile se acordă doar copiilor deja născuți la data accidentului. După patru luni, Ana naște un băiat sănătos, Radu.',
    'Are dreptul copilul Radu la despăgubiri pentru decesul tatălui său?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 3: Despăgubirile pentru copilul conceput';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '36', 'Art. 36'),
        (case_id, '1349', 'Art. 1349');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea naturii despăgubirilor (despăgubiri civile pentru prejudiciu moral și material)'),
        (case_id, 2, 'Analiza aplicării art. 36 alin. 1 la despăgubiri (copilul conceput beneficiază când este vorba de interesele sale)'),
        (case_id, 3, 'Verificarea condiției că Radu s-a născut viu'),
        (case_id, 4, 'Stabilirea consecințelor juridice (Radu are drept la despăgubiri retroactiv de la data decesului tatălui)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Despăgubirile sunt în interesul copilului - se aplică art. 36?'),
        (case_id, 2, 'Copilul conceput poate avea drepturi patrimoniale dacă se naște viu'),
        (case_id, 3, 'Momentul relevant este data accidentului sau data nașterii?'),
        (case_id, 4, 'Ficțiunea juridică protejează și drepturile la despăgubiri');
END $$;

-- Caz 4: Capacitatea de folosință de la concepție
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 4: Capacitatea de folosință și nașterea vie',
    'Ușor',
    1,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Cerința nașterii vii pentru dobândirea retroactivă a capacității de folosință.',
    'Sofia este însărcinată când bunica ei, Ileana, decedează, lăsându-i o moștenire de 80.000 lei. În testament, Ileana specifică că lasă o parte din moștenire și copilului nenăscut al Sofiei. Din păcate, la naștere, copilul este mort-născut. Părinții Sofiei cer ca partea din moștenire destinată copilului să revină Sofiei, în calitate de mamă. Celeilalte moștenitori contestă, susținând că Sofia nu are niciun drept asupra acestei părți.',
    'Cui revine partea din moștenire destinată copilului mort-născut?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 4: Capacitatea de folosință și nașterea vie';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '36', 'Art. 36');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea condiției pentru aplicarea ficțiunii din art. 36 alin. 1 (naștere vie)'),
        (case_id, 2, 'Analiza consecințelor juridice ale nașterii unui copil mort-născut'),
        (case_id, 3, 'Verificarea retroactivității capacității de folosință (condiționată de naștere vie)'),
        (case_id, 4, 'Stabilirea destinatarilor moștenirii (copilul mort-născut nu a avut niciodată capacitate - moștenirea revine moștenitorilor legali)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce condiție prevede art. 36 pentru aplicarea ficțiunii juridice?'),
        (case_id, 2, 'Un copil mort-născut a avut vreodată capacitate de folosință?'),
        (case_id, 3, 'Dacă copilul nu se naște viu, ficțiunea "pro nato habetur" se aplică?'),
        (case_id, 4, 'Cui revine moștenirea când beneficiarul nu dobândește niciodată capacitate?');
END $$;

-- Caz 5: Momentul dobândirii capacității de folosință
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 5: Capacitatea de folosință de la naștere',
    'Ușor',
    1,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Dobândirea capacității de folosință de la naștere pentru un copil născut viu.',
    'Gabriela a născut un băiețel sănătos, Vlad, pe data de 15 martie 2024. La câteva zile după naștere, bunicul dorește să facă o donație de 30.000 lei copilului. Un consultant juridic îi spune bunicului că trebuie să aștepte până când copilul împlinește 1 an pentru ca donația să fie valabilă, deoarece până atunci copilul nu are capacitate de folosință. Bunicul este confuz și cere clarificări.',
    'De când dobândește Vlad capacitatea de folosință și poate primi donația?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 5: Capacitatea de folosință de la naștere';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '35', 'Art. 35');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea momentului dobândirii capacității de folosință conform art. 34 (de la naștere vie și viabilă)'),
        (case_id, 2, 'Analiza egalității în drepturi conform art. 35 (toți oamenii au capacitate de folosință egală)'),
        (case_id, 3, 'Verificarea condiției pentru capacitate (naștere vie - deja îndeplinită)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (Vlad are capacitate de folosință de la naștere - donația este valabilă imediat)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Consultați art. 34 - când începe capacitatea de folosință?'),
        (case_id, 2, 'Este nevoie de o vârstă minimă pentru capacitatea de folosință?'),
        (case_id, 3, 'Confundați capacitatea de folosință cu capacitatea de exercițiu?'),
        (case_id, 4, 'Copiii nou-născuți au capacitate de folosință egală cu adulții');
END $$;

-- ============================================================================
-- CAZURI MEDII (Medium Cases) - Declararea judecătorească a morții
-- ============================================================================

-- Caz 6: Declararea judecătorească a morții după dispariție
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 6: Declararea judecătorească a morții după dispariție',
    'Mediu',
    2,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Condiții pentru declararea judecătorească a morții și efectele acesteia asupra drepturilor succesorale.',
    'Victor a plecat în 2010 într-o expediție în Amazon și nu a mai fost văzut sau auzit de atunci. Soția sa, Elena, a făcut demersuri de căutare dar fără rezultat. În 2024, după 14 ani de la dispariție, Elena solicită instanței declararea judecătorească a morții lui Victor pentru a putea rezolva situația juridică a bunurilor comune și a se recăsători. Fratele lui Victor se opune, susținând că nu s-au scurs suficienți ani și că există șansa ca Victor să fie în viață undeva în junglă.',
    'Poate instanța să pronunțe declararea judecătorească a morții lui Victor?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 6: Declararea judecătorească a morții după dispariție';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '25', 'Art. 25'), (case_id, '26', 'Art. 26'),
        (case_id, '27', 'Art. 27'), (case_id, '28', 'Art. 28');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea condițiilor pentru declararea morții conform art. 25-26 (dispariție + trecere timp)'),
        (case_id, 2, 'Verificarea termenului legal (regula generală - 4 ani de la ultima veste conform art. 26 alin. 1)'),
        (case_id, 3, 'Analiza cazurilor speciale și a pericolelor care justifică prezumția morții'),
        (case_id, 4, 'Stabilirea consecințelor juridice (14 ani > 4 ani - condiția îndeplinită, instanța poate declara moartea)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Verificați art. 26 alin. 1 pentru termenul general de declarare a morții'),
        (case_id, 2, 'Care este termenul minim pentru declararea morții în cazuri obișnuite?'),
        (case_id, 3, 'Au trecut 14 ani - este suficient conform legii?'),
        (case_id, 4, 'Lipsa veștilor timp de 4 ani creează prezumția morții');
END $$;

-- Caz 7: Declararea morții în caz de pericol
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 7: Declararea morții după accident de avion',
    'Mediu',
    2,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Declararea judecătorească a morții în termen redus datorită circumstanțelor de pericol de moarte.',
    'Andrei era pasager pe un avion care s-a prăbușit în океан в 2022. Echipele de salvare au găsit epava dar nu au recuperat toate corpurile. Andrei este declarat dispărut. În 2024, după 2 ani, soția sa cere declararea judecătorească a morții pentru a putea accesa asigurarea de viață și a rezolva succesiunea. Compania de asigurări refuză să plătească, susținând că nu au trecut 4 ani de la dispariție conform legii și că trebuie așteptat termenul complet.',
    'Poate fi declarată moartea lui Andrei după doar 2 ani de la prăbușirea avionului?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 7: Declararea morții după accident de avion';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '25', 'Art. 25'), (case_id, '26', 'Art. 26'),
        (case_id, '27', 'Art. 27');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea naturii dispariției (circumstanțe de pericol pentru viață - prăbușire avion)'),
        (case_id, 2, 'Analiza aplicării art. 26 alin. 2 pentru cazuri speciale (pericol de moarte - termen redus)'),
        (case_id, 3, 'Verificarea termenului special (2 ani în loc de 4 pentru pericol de moarte)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (condiția îndeplinită - 2 ani au trecut, declararea morții posibilă)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Verificați art. 26 alin. 2 despre cazurile speciale de pericol'),
        (case_id, 2, 'Există termene reduse pentru dispariții în circumstanțe periculoase?'),
        (case_id, 3, 'Prăbușirea unui avion constituie pericol de moarte conform art. 26 alin. 2?'),
        (case_id, 4, 'Termenul de 2 ani este suficient în cazuri de pericol de moarte');
END $$;

-- Caz 8: Anularea declarării morții când persoana revine
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 8: Anularea declarării morții persoanei găsite în viață',
    'Mediu',
    2,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Efectele anulării declarării judecătorești a morții când persoana declarată moartă este găsită în viață.',
    'În 2015, Mircea a fost declarat mort prin hotărâre judecătorească după ce dispăruse în 2010 în urma unui cutremur. Soția sa, Carmen, s-a recăsătorit în 2017 cu Daniel. Moștenirea lui Mircea (un apartament și 100.000 lei) a fost împărțită între Carmen și copiii lor. În 2024, Mircea reapare - fusese captiv și a reușit să scape. El cere anularea declarării morții și restituirea bunurilor sale. Carmen și noua ei familie sunt șocați.',
    'Care sunt efectele anulării declarării morții lui Mircea și ce se întâmplă cu bunurile și căsătoria Carmenei?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 8: Anularea declarării morții persoanei găsite în viață';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '25', 'Art. 25'), (case_id, '32', 'Art. 32'),
        (case_id, '33', 'Art. 33'), (case_id, '277', 'Art. 277');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea dreptului de a cere anularea declarării morții (persoana în viață - art. 32)'),
        (case_id, 2, 'Analiza efectelor anulării asupra căsătoriei (prima căsătorie reînvie sau se menține a doua?)'),
        (case_id, 3, 'Verificarea efectelor asupra bunurilor (drept la restituire conform art. 33)'),
        (case_id, 4, 'Stabilirea consecințelor: anulare declarație, prima căsătorie nu reînvie (art. 277), bunurile se restituie dacă există');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Consultați art. 32 despre anularea declarării morții'),
        (case_id, 2, 'Ce se întâmplă cu căsătoria anterioară când declararea morții este anulată?'),
        (case_id, 3, 'Verificați art. 33 privind restituirea bunurilor'),
        (case_id, 4, 'A doua căsătorie este valabilă dacă a fost încheiată de bună-credință?');
END $$;

-- Caz 9: Data morții stabilită de instanță
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 9: Stabilirea datei morții în declararea judecătorească',
    'Mediu',
    2,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Determinarea datei morții de către instanță și efectele acesteia asupra succesiunii.',
    'Ștefan a dispărut în martie 2018 în timpul unei drumeții în munți. Familia a cerut declararea judecătorească a morții în 2023. Instanța urmează să stabilească data morții. Între timp, în aprilie 2018, tatăl lui Ștefan a decedat lăsând o moștenire importantă. Dacă Ștefan este declarat mort cu data martie 2018, nu va moșteni de la tatăl său. Dacă data este stabilită mai târziu (după aprilie 2018), Ștefan ar fi moștenit și moștenirea ar trece apoi la copiii lui.',
    'Ce dată a morții va stabili instanța și cum afectează aceasta drepturile succesorale?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 9: Stabilirea datei morții în declararea judecătorească';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '27', 'Art. 27'), (case_id, '28', 'Art. 28'),
        (case_id, '957', 'Art. 957');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea criteriilor pentru stabilirea datei morții conform art. 27'),
        (case_id, 2, 'Analiza probelor despre ultima dată când Ștefan a fost văzut (martie 2018)'),
        (case_id, 3, 'Verificarea posibilității instanței de a stabili o altă dată dacă există probe'),
        (case_id, 4, 'Stabilirea efectului datei morții asupra succesiunii (data morții determină capacitatea de a moșteni)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Consultați art. 27 despre criteriile pentru stabilirea datei morții'),
        (case_id, 2, 'Care este regula generală - ultima veste sau altă dată?'),
        (case_id, 3, 'Poate instanța stabili o dată diferită de ultima veste dacă există probe?'),
        (case_id, 4, 'Data morții stabilită de instanță este relevantă pentru toate raporturile juridice');
END $$;

-- Caz 10: Dispariția simultană a mai multor persoane
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 10: Comorienții - dispariția simultană',
    'Mediu',
    2,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Prezumția legală în cazul dispariției simultane a mai multor persoane (comoriență).',
    'Tatăl Gheorghe și fiul său Radu au dispărut împreună într-un accident de navă în 2019. Ambii au fost declarați morți în 2024. Gheorghe avea o moștenire importantă. Dacă Radu este considerat că a supraviețuit tatălui său, moștenirea lui Gheorghe ar trece la Radu și apoi la soția acestuia. Dacă Gheorghe este considerat că l-a supraviețuit pe Radu, moștenirea rămâne la ceilalți moștenitori ai lui Gheorghe (frații săi). Nu există probe despre cine a murit primul.',
    'Cum se stabilește ordinea deceselor când nu există probe despre cine a murit primul?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 10: Comorienții - dispariția simultană';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '29', 'Art. 29'), (case_id, '957', 'Art. 957');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea situației de comoriență (dispariție simultană conform art. 29)'),
        (case_id, 2, 'Analiza prezumției legale când nu există probe despre ordinea deceselor'),
        (case_id, 3, 'Aplicarea regulii: se prezumă că au murit în același timp (niciuna nu-l supraviețuiește pe celălalt)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (nu există moștenire între ei - fiecare moștenire merge la proprii moștenitori)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Consultați art. 29 despre prezumția de comoriență'),
        (case_id, 2, 'Ce se întâmplă când nu se poate stabili ordinea deceselor?'),
        (case_id, 3, 'Prezumția de moarte simultană împiedică moștenirea între comori enți'),
        (case_id, 4, 'Fiecare moștenire se deschide ca și cum celălalt ar fi murit deja');
END $$;

-- ============================================================================
-- CAZURI DIFICILE (Hard Cases) - Interacțiuni complexe
-- ============================================================================

-- Caz 11: Declararea morții și anulare - efecte asupra terților dobânditori
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 11: Anularea declarării morții și protecția terților de bună-credință',
    'Dificil',
    3,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Efectele anulării declarării morții asupra actelor juridice încheiate de moștenitori cu terți de bună-credință.',
    'Laura a fost declarată moartă în 2016 după o dispariție în 2012. Moștenirea ei (un apartament și un teren) a fost împărțită între cei doi fii, Matei și Cristian. În 2018, Matei a vândut apartamentul moștenit către Victor pentru 150.000 lei. Victor a renovat apartamentul investind 50.000 lei. În 2024, Laura reapare - fusese captivă într-o țară în conflict. Ea cere anularea declarării morții și restituirea apartamentului. Victor invocă bună-credința - el nu știa că Laura era în viață și a cumpărat apartamentul legal de la moștenitorul aparent.',
    'Se poate restitui apartamentul Laurei sau Victor este protejat ca terț dobânditor de bună-credință?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 11: Anularea declarării morții și protecția terților de bună-credință';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '32', 'Art. 32'), (case_id, '33', 'Art. 33'),
        (case_id, '17', 'Art. 17'), (case_id, '1909', 'Art. 1909');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea dreptului Laurei de a cere anularea declarării morții și restituirea bunurilor (art. 32-33)'),
        (case_id, 2, 'Analiza protecției terțului dobânditor Victor (bună-credință, onerozitate, titlu translativ)'),
        (case_id, 3, 'Verificarea conflictului între dreptul de restituire și protecția terțului de bună-credință'),
        (case_id, 4, 'Stabilirea soluției: restituirea în echivalent bani (art. 33) dacă bunul nu mai există în natură sau e la terț de bună-credință');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Art. 33 prevede restituirea bunurilor - în ce formă?'),
        (case_id, 2, 'Victor este terț dobânditor de bună-credință conform art. 17?'),
        (case_id, 3, 'Se poate restitui bunul dacă este la un terț de bună-credință?'),
        (case_id, 4, 'Restituirea în echivalent (bani) versus restituirea în natură');
END $$;

-- Caz 12: Cumul ficțiune juridică - copil conceput și declarare moarte
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 12: Copilul conceput și declararea morții tatălui',
    'Dificil',
    3,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Interacțiunea dintre ficțiunea copilului conceput și declararea judecătorească a morții - stabilirea drepturilor succesorale.',
    'Emil a dispărut în 2019 în urma unui tsunami. Soția sa Maria era însărcinată în luna a doua. În 2020, familia cere declararea judecătorească a morții. Instanța stabilește data morții ca fiind martie 2019 (data tsunamiului). Maria naște un băiat, Alexandru, în octombrie 2019. Între timp, tatăl lui Emil a decedat în august 2019, lăsând o moștenire. Se ridică întrebarea: a moștenit Emil de la tatăl său (decedat august 2019) dacă data morții lui Emil este stabilită martie 2019? Și poate Alexandru să moștenească de la bunicul său prin reprezentare?',
    'Care este ordinea deceselor și cine moștenește de la tatăl lui Emil?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 12: Copilul conceput și declararea morții tatălui';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '27', 'Art. 27'), (case_id, '36', 'Art. 36'),
        (case_id, '957', 'Art. 957'), (case_id, '967', 'Art. 967');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Stabilirea datei morții lui Emil (martie 2019 conform hotărârii de declarare a morții - art. 27)'),
        (case_id, 2, 'Analiza capacității lui Emil de a moșteni de la tatăl său decedat în august 2019 (Emil deja mort în martie)'),
        (case_id, 3, 'Verificarea dreptului lui Alexandru prin reprezentare (art. 967) - poate reprezenta pe tatăl decedat'),
        (case_id, 4, 'Aplicarea art. 36 pentru Alexandru (conceput în februarie, născut octombrie - poate moșteni prin reprezentare)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Data morții stabilită de instanță este relevantă pentru toate raporturile juridice'),
        (case_id, 2, 'Poate o persoană decedată să moștenească de la cineva care moare ulterior?'),
        (case_id, 3, 'Moștenirea prin reprezentare permite descendenților să ia locul ascendentului decedat'),
        (case_id, 4, 'Alexandru este conceput și se naște viu - poate moșteni prin reprezentare de la bunic');
END $$;

-- Caz 13: Declararea morții cu data incertă și prescripție
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 13: Data incertă a morții și prescripția drepturilor',
    'Dificil',
    3,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Efectele incertitudinii datei morții asupra prescripției drepturilor patrimoniale și personale.',
    'Sorin a dispărut în 2015 fără a lăsa urme. A fost declarat mort în 2020, instanța stabilind data morții ca fiind 2015 (ultima veste). Înainte de dispariție, Sorin avea un contract de împrumut cu Radu pentru 100.000 lei, scadent în 2017. Moștenitorii lui Sorin (copiii) cer în 2024 recuperarea sumei de la Radu. Radu invocă prescripția - termenul de prescripție pentru creanțe este 3 ani. Dacă data morții este 2015, prescripția a început să curgă de atunci și s-a împlinit în 2020 (înainte de declararea morții). Moștenitorii susțin că prescripția începe de la declararea morții în 2020.',
    'De când curge termenul de prescripție - de la data morții stabilite sau de la declararea judecătorească?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 13: Data incertă a morții și prescripția drepturilor';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '27', 'Art. 27'), (case_id, '28', 'Art. 28'),
        (case_id, '2517', 'Art. 2517'), (case_id, '2523', 'Art. 2523');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea datei morții stabilite de instanță (2015 conform art. 27)'),
        (case_id, 2, 'Analiza efectelor retroactive ale declarării morții (produce efecte de la data stabilită, nu de la hotărâre)'),
        (case_id, 3, 'Verificarea momentului de la care curge prescripția (de la nașterea dreptului sau exigibilitate)'),
        (case_id, 4, 'Stabilirea soluției: prescripția curge de la data morții stabilite (2015), nu de la declarare (2020) - dreptul prescris');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Data morții stabilită de instanță are efecte retroactive?'),
        (case_id, 2, 'De când încep să curgă termenele de prescripție pentru drepturile defunctului?'),
        (case_id, 3, 'Declararea judecătorească a morții creează o ficțiune retroactivă'),
        (case_id, 4, 'Efectele juridice se calculează de la data morții stabilite, nu de la data hotărârii');
END $$;

-- Caz 14: Declararea morții și căsătoria putativă
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 14: Anularea declarării morții și bigamia putativă',
    'Dificil',
    3,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Valabilitatea celei de-a doua căsătorii încheiate după declararea morții când primul soț reapare.',
    'Ana s-a căsătorit cu Bogdan în 2008. În 2014, Bogdan a dispărut în urma unui accident de muncă în străinătate. În 2018, a fost declarat mort. Ana s-a recăsătorit cu Claudiu în 2019, având un copil împreună în 2020. În 2024, Bogdan reapare - fusese captiv și nu putea comunica. El cere anularea declarării morții. Se ridică întrebări: (1) Prima căsătorie reînvie? (2) A doua căsătorie este nulă pentru bigamie? (3) Copilul Anei cu Claudiu este legitim? (4) Bunurile dobândite în cea de-a doua căsătorie ce regim au?',
    'Care este situația juridică a celor două căsătorii și ce efecte are anularea declarării morții?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 14: Anularea declarării morții și bigamia putativă';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '32', 'Art. 32'), (case_id, '277', 'Art. 277'),
        (case_id, '299', 'Art. 299'), (case_id, '304', 'Art. 304');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Verificarea efectelor anulării declarării morții asupra primei căsătorii (art. 277 - nu reînvie automat)'),
        (case_id, 2, 'Analiza valabilității celei de-a doua căsătorii (art. 277 alin. 2 - rămâne valabilă dacă de bună-credință)'),
        (case_id, 3, 'Stabilirea situației copilului (copil din căsătorie putativă - legitim conform art. 304)'),
        (case_id, 4, 'Determinarea regimului matrimonial (bunurile din a doua căsătorie rămân în regimul stabilit)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Consultați art. 277 despre efectele anulării declarării morții asupra căsătoriei'),
        (case_id, 2, 'Prima căsătorie reînvie automat când declararea morții este anulată?'),
        (case_id, 3, 'A doua căsătorie este nulă sau putativă (validă pentru soțul de bună-credință)?'),
        (case_id, 4, 'Copiii din căsătoria putativă sunt legitimi conform art. 304');
END $$;

-- Caz 15: Comoriența și moștenirea în lanț
INSERT INTO cases (title, level, week_number, subcategory, legal_problem, case_description, question)
VALUES (
    'Caz 15: Comoriența în familie și moștenirea în lanț',
    'Dificil',
    3,
    'Persoana fizică (Capacitatea de folosință. Declararea judecătorească a morții)',
    'Aplicarea prezumției de comoriență în cazul dispariției simultane a mai multor membri de familie și efectele asupra succesiunilor multiple.',
    'O familie întreagă - bunicul Gheorghe (80 ani), fiul său Mihai (50 ani), și nepotul Alexandru (20 ani) - au dispărut într-un accident de avion în 2020. Toți trei au fost declarați morți în 2024. Gheorghe avea o avere de 500.000 lei. Mihai avea propria sa avere de 200.000 lei. Alexandru nu avea bunuri. Dacă se consideră că au murit în ordine (bunic → fiu → nepot), moștenirea lui Gheorghe ar trece la Mihai, apoi la Alexandru, și în final la mama Alexandrului (fosta soție a lui Mihai). Dacă se aplică comoriența, fiecare moștenire se deschide separat. Nu există probe despre ordinea deceselor.',
    'Cum se împarte moștenirea lui Gheorghe aplicând regulile despre comoriență?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 15: Comoriența în familie și moștenirea în lanț';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '29', 'Art. 29'), (case_id, '957', 'Art. 957'),
        (case_id, '963', 'Art. 963'), (case_id, '967', 'Art. 967');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Aplicarea prezumției de comoriență conform art. 29 (toți trei morți simultan - nu se moștenesc între ei)'),
        (case_id, 2, 'Determinarea moștenitorilor pentru fiecare dintre cei trei (fără a presupune supraviețuire între ei)'),
        (case_id, 3, 'Analiza moștenirii lui Gheorghe (Mihai considerat mort simultan - nu moștenește, se trece la alți moștenitori)'),
        (case_id, 4, 'Stabilirea moștenitorilor finali prin reprezentare sau ordine legală (probabil soții/frați supraviețuitori, nu în lanț)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Art. 29 prezumă moarte simultană când ordinea nu poate fi stabilită'),
        (case_id, 2, 'Comorienții nu se moștenesc între ei - fiecare succesiune se deschide independent'),
        (case_id, 3, 'Pentru moștenirea lui Gheorghe, Mihai este tratat ca și cum ar fi murit deja'),
        (case_id, 4, 'Moștenirea nu trece în lanț prin comoriențieni - merge la alți moștenitori');
END $$;
