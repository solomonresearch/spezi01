-- Insert all legal cases (Spete) into Supabase
-- Run this script in Supabase SQL Editor after creating the tables

-- ============================================================================
-- CAZURI UȘOARE (Easy Cases) - Week 3
-- ============================================================================

-- Note: Caz 1 already exists from the table creation script

-- Caz 2: Donația unei colecții de cărți
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 2: Donația unei colecții de cărți',
    'Ușor',
    3,
    'Validitatea unei donații efectuate de un minor cu capacitate de exercițiu restrânsă fără încuviințarea părintelui.',
    'Elena, în vârstă de 17 ani, i-a donat prietenei sale, Sofia, întreaga sa colecție de cărți rare, evaluată la aproximativ 4.000 lei. Elena își dorește să fie generoasă, deoarece Sofia o ajutase mult la pregătirea pentru bacalaureat. Mama Elenei, descoperind donația după două săptămâni, cere returnarea cărților, susținând că donația nu este valabilă. Sofia refuză, argumentând că Elena i-a dat cărțile din proprie inițiativă.',
    'Este valabilă donația colecției de cărți efectuată de Elena?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 2: Donația unei colecții de cărți';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '38', 'Art. 38'),
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42'),
        (case_id, '79', 'Art. 79');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a Elenei (17 ani - capacitate de exercițiu restrânsă conform art. 41)'),
        (case_id, 2, 'Analiza naturii juridice a actului (donație colecție cărți 4.000 lei - act de dispoziție cu titlu gratuit)'),
        (case_id, 3, 'Verificarea îndeplinirii condițiilor legale (lipsa încuviințării părintelui conform art. 41 alin. 2)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (anulabilitatea actului pentru lipsa capacității)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce capacitate de exercițiu are Elena la 17 ani conform art. 41 Cod civil?'),
        (case_id, 2, 'Donația este un act cu titlu gratuit - poate Elena să facă singură acest act?'),
        (case_id, 3, 'Era necesară încuviințarea mamei pentru această donație?'),
        (case_id, 4, 'Care sunt consecințele juridice ale unui act făcut fără respectarea condițiilor de capacitate?');
END $$;

-- Caz 3: Închirierea unui apartament
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 3: Închirierea unui apartament',
    'Ușor',
    3,
    'Validitatea unui contract de închiriere încheiat de un minor cu capacitate de exercițiu restrânsă fără încuviințarea părintelui.',
    'Mihai, în vârstă de 16 ani, a moștenit un apartament de la bunica sa. Fără să îi spună tatălui său, Mihai a încheiat un contract de închiriere pe 2 ani cu Cristina, stabilind o chirie lunară de 1.500 lei. După 3 luni, tatăl lui Mihai descoperă contractul și dorește anularea acestuia, considerând că fiul său nu putea lua această decizie singur. Cristina refuză să plece, susținând că are un contract valabil.',
    'Este valabil contractul de închiriere încheiat de Mihai?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 3: Închirierea unui apartament';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '38', 'Art. 38'),
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42'),
        (case_id, '79', 'Art. 79');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a lui Mihai (16 ani - capacitate de exercițiu restrânsă conform art. 41)'),
        (case_id, 2, 'Analiza naturii juridice a actului (contract de închiriere pe 2 ani - act de administrare/dispoziție)'),
        (case_id, 3, 'Verificarea îndeplinirii condițiilor legale (lipsa încuviințării părintelui conform art. 41 alin. 2)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (anulabilitatea actului pentru lipsa capacității)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce capacitate de exercițiu are Mihai la 16 ani conform art. 41?'),
        (case_id, 2, 'Închirierea unui apartament pe 2 ani este un act de administrare sau de dispoziție?'),
        (case_id, 3, 'Putea Mihai să încheie singur acest contract fără acordul tatălui?'),
        (case_id, 4, 'Ce consecințe are încheierea unui contract fără respectarea condițiilor de capacitate?');
END $$;

-- Caz 4: Vânzarea unui laptop
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 4: Vânzarea unui laptop',
    'Ușor',
    3,
    'Validitatea unui contract de vânzare-cumpărare încheiat de un minor cu capacitate de exercițiu restrânsă fără încuviințarea părintelui.',
    'Ioana, în vârstă de 17 ani, și-a vândut laptopul pe care îl primise cadou de ziua ei colegului său, Răzvan, pentru suma de 3.500 lei. Ioana avea nevoie urgentă de bani pentru a-și cumpăra un telefon nou. Mama Ioanei, aflând despre vânzare după o săptămână, cere anularea tranzacției și returnarea laptopului. Răzvan refuză, susținând că a cumpărat laptopul în bună-credință și că Ioana nu i-a spus că este minoră.',
    'Este valabilă vânzarea laptopului încheiată între Ioana și Răzvan?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 4: Vânzarea unui laptop';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '38', 'Art. 38'),
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42'),
        (case_id, '79', 'Art. 79');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a Ioanei (17 ani - capacitate de exercițiu restrânsă conform art. 41)'),
        (case_id, 2, 'Analiza naturii juridice a actului (vânzare laptop 3.500 lei - act de dispoziție care depășește valoarea mică)'),
        (case_id, 3, 'Verificarea îndeplinirii condițiilor legale (lipsa încuviințării părintelui conform art. 41 alin. 2)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (anulabilitatea actului pentru lipsa capacității)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce capacitate de exercițiu are Ioana la 17 ani conform art. 41?'),
        (case_id, 2, 'Vânzarea unui laptop de 3.500 lei este un act de mică valoare conform art. 41 alin. 3?'),
        (case_id, 3, 'Era necesară încuviințarea mamei pentru această vânzare?'),
        (case_id, 4, 'Buna-credință a cumpărătorului influențează validitatea contractului?');
END $$;

-- Caz 5: Deschiderea unui cont bancar
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 5: Deschiderea unui cont bancar',
    'Ușor',
    3,
    'Validitatea unui contract de deschidere cont bancar încheiat de un minor cu capacitate de exercițiu restrânsă fără încuviințarea părintelui.',
    'Gabriel, în vârstă de 16 ani, s-a prezentat la o bancă și a deschis un cont curent, depunând 5.000 lei pe care îi primise moștenire de la unchiul său. Gabriel a semnat singur contractul de cont bancar. Tatăl lui Gabriel, aflând despre deschiderea contului după o lună, contestă validitatea contractului, considerând că fiul său nu avea voie să facă acest lucru fără acordul său. Banca susține că contractul este valabil deoarece Gabriel a prezentat actele necesare.',
    'Este valabil contractul de deschidere a contului bancar încheiat de Gabriel?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 5: Deschiderea unui cont bancar';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '38', 'Art. 38'),
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42'),
        (case_id, '79', 'Art. 79');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a lui Gabriel (16 ani - capacitate de exercițiu restrânsă conform art. 41)'),
        (case_id, 2, 'Analiza naturii juridice a actului (deschidere cont bancar - act de administrare/dispoziție)'),
        (case_id, 3, 'Verificarea îndeplinirii condițiilor legale (lipsa încuviințării părintelui conform art. 41 alin. 2)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (anulabilitatea actului pentru lipsa capacității)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce capacitate de exercițiu are Gabriel la 16 ani conform art. 41?'),
        (case_id, 2, 'Deschiderea unui cont bancar necesită acordul părintelui pentru un minor?'),
        (case_id, 3, 'Putea Gabriel să încheie singur contractul cu banca?'),
        (case_id, 4, 'Ce consecințe are încheierea contractului fără respectarea condițiilor de capacitate?');
END $$;

-- Caz 6: Cumpărarea unei console de jocuri
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 6: Cumpărarea unei console de jocuri',
    'Ușor',
    3,
    'Validitatea unui contract de vânzare-cumpărare încheiat de un minor cu capacitate de exercițiu restrânsă fără încuviințarea părintelui.',
    'Vlad, în vârstă de 15 ani, și-a cumpărat o consolă PlayStation 5 de la un magazin online pentru suma de 2.800 lei, plătind cu cardul părinților săi pe care îl împrumutase. Mama lui Vlad, văzând extrasul de cont, dorește returnarea consolei și recuperarea banilor. Magazinul refuză, susținând că vânzarea este finalizată și că produsul nu poate fi returnat decât dacă este defect.',
    'Este valabilă cumpărarea consolei efectuată de Vlad?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 6: Cumpărarea unei console de jocuri';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '38', 'Art. 38'),
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42'),
        (case_id, '79', 'Art. 79');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a lui Vlad (15 ani - capacitate de exercițiu restrânsă conform art. 41)'),
        (case_id, 2, 'Analiza naturii juridice a actului (cumpărare consolă 2.800 lei - act de dispoziție care depășește valoarea mică)'),
        (case_id, 3, 'Verificarea îndeplinirii condițiilor legale (lipsa încuviințării părintelui conform art. 41 alin. 2)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (anulabilitatea actului pentru lipsa capacității)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce capacitate de exercițiu are Vlad la 15 ani conform art. 41?'),
        (case_id, 2, 'Cumpărarea unei console de 2.800 lei poate fi considerată act de mică valoare conform art. 41 alin. 3?'),
        (case_id, 3, 'Era necesară încuviințarea mamei pentru această cumpărare?'),
        (case_id, 4, 'Faptul că Vlad a folosit cardul părinților influențează validitatea contractului?');
END $$;

-- Caz 7: Acceptarea unei moșteniri
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 7: Acceptarea unei moșteniri',
    'Ușor',
    3,
    'Validitatea acceptării unei moșteniri de către un minor cu capacitate de exercițiu restrânsă fără încuviințarea părintelui.',
    'Maria, în vârstă de 17 ani, a acceptat o moștenire de la mătușa sa, constând într-un teren agricol în valoare de 50.000 lei și datorii ale defunctei în sumă de 30.000 lei. Maria a semnat actul de acceptare fără să îi spună mamei sale. Mama Mariei, aflând despre acceptarea moștenirii și despre datorii, dorește anularea acceptării. Notarul public susține că actul este valabil deoarece Maria a semnat în cunoștință de cauză.',
    'Este valabilă acceptarea moștenirii efectuată de Maria?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 7: Acceptarea unei moșteniri';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '38', 'Art. 38'),
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42'),
        (case_id, '79', 'Art. 79');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a Mariei (17 ani - capacitate de exercițiu restrânsă conform art. 41)'),
        (case_id, 2, 'Analiza naturii juridice a actului (acceptare moștenire - act de dispoziție important)'),
        (case_id, 3, 'Verificarea îndeplinirii condițiilor legale (lipsa încuviințării părintelui conform art. 41 alin. 2)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (anulabilitatea actului pentru lipsa capacității)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce capacitate de exercițiu are Maria la 17 ani conform art. 41?'),
        (case_id, 2, 'Acceptarea unei moșteniri este un act care poate fi făcut de un minor singur?'),
        (case_id, 3, 'Era necesară încuviințarea mamei pentru acceptarea moștenirii?'),
        (case_id, 4, 'Ce consecințe are acceptarea moștenirii fără respectarea condițiilor de capacitate?');
END $$;

-- Caz 8: Vânzarea unei cărți de mică valoare
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 8: Vânzarea unei cărți',
    'Ușor',
    3,
    'Validitatea unui contract de vânzare-cumpărare de mică valoare încheiat de un minor cu capacitate de exercițiu restrânsă.',
    'Teodor, în vârstă de 16 ani, și-a vândut o carte pe care o citise colegului său, Andrei, pentru suma de 30 lei. Tatăl lui Teodor, aflând despre vânzare, consideră că trebuia să fie informat și cere anularea tranzacției. Andrei refuză să returneze cartea, susținând că este o sumă foarte mică și că vânzarea este valabilă.',
    'Este valabilă vânzarea cărții încheiată între Teodor și Andrei?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 8: Vânzarea unei cărți';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '38', 'Art. 38'),
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42'),
        (case_id, '79', 'Art. 79');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a lui Teodor (16 ani - capacitate de exercițiu restrânsă conform art. 41)'),
        (case_id, 2, 'Analiza naturii juridice a actului (vânzare carte 30 lei - act de dispoziție de mică valoare)'),
        (case_id, 3, 'Verificarea îndeplinirii condițiilor legale (exceptarea de la necesitatea încuviințării conform art. 41 alin. 3)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (validitatea actului ca act de mică valoare)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce capacitate de exercițiu are Teodor la 16 ani conform art. 41?'),
        (case_id, 2, 'Vânzarea unei cărți de 30 lei poate fi considerată act de dispoziție de mică valoare conform art. 41 alin. 3?'),
        (case_id, 3, 'Era necesară încuviințarea tatălui pentru o tranzacție atât de mică?'),
        (case_id, 4, 'Care sunt actele de mică valoare pe care minorii le pot face singuri?');
END $$;

-- Caz 9: Contractul de muncă part-time
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 9: Contractul de muncă part-time',
    'Ușor',
    3,
    'Validitatea unui contract de muncă încheiat de un minor cu capacitate de exercițiu restrânsă fără încuviințarea părintelui.',
    'Laura, în vârstă de 17 ani, a semnat un contract de muncă part-time cu o cafenea pentru a lucra în weekenduri, cu un salariu de 1.500 lei pe lună. Laura nu i-a spus mamei sale despre acest contract. După o lună, mama Laurei descoperă situația și cere anularea contractului, considerând că Laura trebuie să se concentreze pe studii. Proprietarul cafenelei susține că Laura lucrează foarte bine și că renunțarea la contract ar aduce prejudicii afacerii.',
    'Este valabil contractul de muncă încheiat de Laura?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 9: Contractul de muncă part-time';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '38', 'Art. 38'),
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42'),
        (case_id, '79', 'Art. 79');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a Laurei (17 ani - capacitate de exercițiu restrânsă conform art. 41)'),
        (case_id, 2, 'Analiza naturii juridice a actului (contract de muncă - act juridic special)'),
        (case_id, 3, 'Verificarea îndeplinirii condițiilor legale (lipsa încuviințării părintelui conform art. 41 alin. 2)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (anulabilitatea actului pentru lipsa capacității)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce capacitate de exercițiu are Laura la 17 ani conform art. 41?'),
        (case_id, 2, 'Încheierea unui contract de muncă necesită acordul părintelui pentru un minor?'),
        (case_id, 3, 'Putea Laura să încheie singură contractul de muncă?'),
        (case_id, 4, 'Ce consecințe are încheierea contractului fără respectarea condițiilor de capacitate?');
END $$;

-- Caz 10: Schimbul de jocuri video
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 10: Schimbul de jocuri video',
    'Ușor',
    3,
    'Validitatea unui contract de schimb încheiat de un minor cu capacitate de exercițiu restrânsă fără încuviințarea părintelui.',
    'Alexandru, în vârstă de 16 ani, și-a schimbat jocul video FIFA 2024 (în valoare de 250 lei) cu jocul Call of Duty (în valoare de 300 lei) al prietenului său, Cristian, oferind în plus suma de 50 lei. Tatăl lui Alexandru, aflând despre schimb, consideră că jocul FIFA era mai potrivit pentru vârsta fiului său și dorește anularea tranzacției. Cristian refuză, spunând că schimbul a fost echitabil și că amândoi au fost de acord.',
    'Este valabil contractul de schimb încheiat între Alexandru și Cristian?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 10: Schimbul de jocuri video';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '34', 'Art. 34'), (case_id, '38', 'Art. 38'),
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42'),
        (case_id, '79', 'Art. 79');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a lui Alexandru (16 ani - capacitate de exercițiu restrânsă conform art. 41)'),
        (case_id, 2, 'Analiza naturii juridice a actului (schimb jocuri + diferență 50 lei - act de dispoziție de mică valoare)'),
        (case_id, 3, 'Verificarea îndeplinirii condițiilor legale (posibila exceptare ca act de mică valoare conform art. 41 alin. 3)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (validitatea sau anulabilitatea în funcție de calificarea valorii)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce capacitate de exercițiu are Alexandru la 16 ani conform art. 41?'),
        (case_id, 2, 'Schimbul unor jocuri video de valori mici poate fi considerat act de dispoziție de mică valoare conform art. 41 alin. 3?'),
        (case_id, 3, 'Era necesară încuviințarea tatălui pentru acest schimb?'),
        (case_id, 4, 'Valoarea totală a tranzacției (300 lei) influențează necesitatea acordului părintesc?');
END $$;

-- ============================================================================
-- CAZURI MEDII (Medium Cases) - Week 4
-- ============================================================================

-- Caz 1: Minorul căsătorit și capacitatea deplină
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 1: Minorul căsătorit și capacitatea deplină',
    'Mediu',
    4,
    'Dobândirea capacității depline de exercițiu prin căsătorie de către un minor și consecințele asupra actelor juridice încheiate.',
    'Diana, în vârstă de 16 ani și jumătate, s-a căsătorit cu Alexandru, în vârstă de 20 de ani, cu încuviințarea părinților ambelor părți și autorizarea instanței. La două luni după căsătorie, Diana a vândut autoturismul pe care îl primise cadou de la bunicii săi pentru suma de 15.000 lei, fără a-i cere acordul lui Alexandru sau părinților săi. Părinții Dianei contestă vânzarea, susținând că Diana este încă minoră și nu putea face acest act singură. Cumpărătorul, Bogdan, susține că vânzarea este valabilă.',
    'Este valabilă vânzarea autoturismului efectuată de Diana?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 1: Minorul căsătorit și capacitatea deplină';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '38', 'Art. 38'), (case_id, '39', 'Art. 39'),
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea situației juridice a Dianei (minoră căsătorită - capacitate deplină de exercițiu conform art. 39 alin. 1)'),
        (case_id, 2, 'Analiza naturii juridice a actului (vânzare autoturism 15.000 lei - act de dispoziție)'),
        (case_id, 3, 'Verificarea îndeplinirii condițiilor legale (Diana are capacitate deplină prin căsătorie și nu mai necesită încuviințare)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (validitatea actului - Diana poate încheia singură actul)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce efect are căsătoria asupra capacității de exercițiu a minorului conform art. 39 alin. 1?'),
        (case_id, 2, 'Diana mai are nevoie de încuviințarea părinților pentru acte de dispoziție după căsătorie?'),
        (case_id, 3, 'Care este diferența între capacitatea de exercițiu restrânsă și capacitatea deplină de exercițiu?'),
        (case_id, 4, 'Importă faptul că Diana este încă sub 18 ani din punct de vedere cronologic?');
END $$;

-- Caz 2: Anularea căsătoriei și păstrarea capacității
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 2: Anularea căsătoriei și păstrarea capacității',
    'Mediu',
    4,
    'Efectele anulării căsătoriei asupra capacității de exercițiu a minorului care a fost de bună-credință.',
    'Cristina, în vârstă de 17 ani, s-a căsătorit cu Ionuț, în vârstă de 25 de ani, care i-a ascuns faptul că era deja căsătorit. În timpul căsătoriei, Cristina a încheiat un contract de închiriere pentru un spațiu comercial pe 3 ani, în valoare totală de 45.000 lei. După 6 luni, căsătoria a fost anulată pentru bigamie. Mama Cristinei cere acum anularea contractului de închiriere, susținând că fiica sa nu avea capacitate deplină, căsătoria fiind nulă. Proprietarul spațiului cere menținerea contractului.',
    'Este valabil contractul de închiriere încheiat de Cristina în timpul căsătoriei anulate?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 2: Anularea căsătoriei și păstrarea capacității';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '38', 'Art. 38'), (case_id, '39', 'Art. 39'),
        (case_id, '41', 'Art. 41'), (case_id, '44', 'Art. 44');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea situației juridice a Cristinei (minoră căsătorită ulterior anulat - verificare bună-credință)'),
        (case_id, 2, 'Analiza efectelor anulării căsătoriei conform art. 39 alin. 2 (păstrarea capacității dacă este de bună-credință)'),
        (case_id, 3, 'Verificarea bunei-credințe a Cristinei (ea nu știa de bigamie - bună-credință prezumată)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (validitatea contractului - Cristina păstrează capacitatea deplină)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce prevede art. 39 alin. 2 despre minorul de bună-credință la încheierea căsătoriei?'),
        (case_id, 2, 'Cum se determină dacă Cristina a fost de bună-credință?'),
        (case_id, 3, 'Cristina pierde capacitatea deplină de exercițiu odată cu anularea căsătoriei?'),
        (case_id, 4, 'Care este situația contractelor încheiate în perioada căsătoriei?');
END $$;

-- Caz 3: Capacitatea de exercițiu anticipată
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 3: Capacitatea de exercițiu anticipată - autorizare judecătorească',
    'Mediu',
    4,
    'Recunoașterea capacității depline de exercițiu anticipate pentru un minor care a împlinit 16 ani din motive temeinice.',
    'Robert, în vârstă de 16 ani și 8 luni, a moștenit o afacere de la tatăl său decedat. Mama sa și tutorele au cerut instanței de tutelă să îi recunoască lui Robert capacitatea deplină de exercițiu, având în vedere că acesta lucrase deja 2 ani alături de tatăl său în afacere și demonstrase maturitate și competență. Instanța a admis cererea. După 2 luni, Robert a vândut un echipament din afacere pentru 8.000 lei. Unchiul său contestă tranzacția, susținând că Robert este încă minor.',
    'Este valabilă vânzarea echipamentului efectuată de Robert?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 3: Capacitatea de exercițiu anticipată - autorizare judecătorească';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '38', 'Art. 38'), (case_id, '40', 'Art. 40'),
        (case_id, '41', 'Art. 41'), (case_id, '107', 'Art. 107');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea situației juridice a lui Robert (minor cu capacitate deplină recunoscută anticipat conform art. 40)'),
        (case_id, 2, 'Analiza condițiilor pentru recunoașterea anticipată (vârsta de 16 ani împlinită și motive temeinice - moștenirea afacerii)'),
        (case_id, 3, 'Verificarea procedurii (decizie a instanței de tutelă cu ascultarea părintelui/tutorelui)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (validitatea actului - Robert are capacitate deplină prin recunoaștere anticipată)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce condiții prevede art. 40 pentru recunoașterea anticipată a capacității depline?'),
        (case_id, 2, 'Robert mai are nevoie de încuviințarea tutorelui după recunoașterea capacității depline?'),
        (case_id, 3, 'Care este rolul instanței de tutelă în recunoașterea anticipată a capacității?'),
        (case_id, 4, 'Vârsta cronologică de 16 ani este suficientă sau trebuie și motive temeinice?');
END $$;

-- Caz 4: Contractul de muncă și veniturile minorului
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 4: Contractul de muncă și veniturile minorului',
    'Mediu',
    4,
    'Validitatea contractului de muncă încheiat de minor cu încuviințare și dreptul acestuia de a dispune de propriile venituri.',
    'Ștefan, în vârstă de 15 ani, a încheiat un contract de muncă part-time cu un supermarket pentru a lucra în weekenduri, cu încuviințarea ambilor părinți și cu respectarea legislației muncii. După 3 luni, Ștefan și-a cumpărat singur un computer pentru 4.500 lei din salariul său. Tatăl lui Ștefan cere anularea cumpărării, considerând că Ștefan trebuia să îi ceară acordul pentru o achiziție atât de mare. Magazinul de electronice susține că vânzarea este valabilă.',
    'Este valabilă cumpărarea computerului efectuată de Ștefan?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 4: Contractul de muncă și veniturile minorului';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea situației juridice a lui Ștefan (minor cu capacitate restrânsă având contract de muncă cu încuviințare - art. 42 alin. 1)'),
        (case_id, 2, 'Analiza drepturilor conferite de art. 42 alin. 2 (dreptul de a dispune singur de veniturile din muncă)'),
        (case_id, 3, 'Verificarea sursei banilor (venituri din contractul de muncă autorizat)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (validitatea actului - Ștefan poate dispune singur de veniturile din muncă)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce prevede art. 42 alin. 1 despre contractele de muncă ale minorilor?'),
        (case_id, 2, 'Poate minorul să dispună singur de veniturile obținute din contractul de muncă conform art. 42 alin. 2?'),
        (case_id, 3, 'Tatăl mai poate contesta actele făcute de Ștefan cu veniturile din muncă?'),
        (case_id, 4, 'Care este diferența între veniturile din muncă și alte surse de venit?');
END $$;

-- Caz 5: Profesia artistică și independența minorului
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 5: Profesia artistică și independența minorului',
    'Mediu',
    4,
    'Drepturile minorului artist de a încheia acte juridice și de a dispune de veniturile din activitatea artistică.',
    'Ana, în vârstă de 16 ani, este o cântăreață cunoscută care a încheiat un contract de impresariat artistic cu o agenție, cu încuviințarea părinților săi. Din veniturile obținute din concerte, Ana și-a închiriat singură un apartament pentru 6 luni, plătind 1.200 lei pe lună, fără a-i anunța pe părinți. De asemenea, și-a cumpărat singură echipament de sunet pentru 7.000 lei. Mama Anei cere anularea ambelor contracte. Agenția imobiliară și magazinul susțin că actele sunt valabile.',
    'Sunt valabile contractul de închiriere și cumpărarea echipamentului efectuate de Ana?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 5: Profesia artistică și independența minorului';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea situației juridice a Anei (minoră cu capacitate restrânsă având contract artistic cu încuviințare - art. 42 alin. 1)'),
        (case_id, 2, 'Analiza extinderii drepturilor conform art. 42 alin. 2 (exercitarea singură a drepturilor din activitatea artistică și dispoziție asupra veniturilor)'),
        (case_id, 3, 'Verificarea legăturii actelor cu activitatea artistică (apartamentul pentru repetiții și echipamentul pentru concerte)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (validitatea actelor legate de profesia artistică - Ana poate dispune singur de venituri)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Art. 42 se aplică și îndeletnicirilor artistice ale minorului?'),
        (case_id, 2, 'Ana poate încheia singură acte legate de profesia sa artistică?'),
        (case_id, 3, 'Importă dacă actele sunt legate sau nu de activitatea artistică a Anei?'),
        (case_id, 4, 'Părinții mai pot interveni în actele legate de profesia artistică a minorului?');
END $$;

-- Caz 6: Actul de conservare făcut de minor sub 14 ani
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 6: Actul de conservare făcut de minor sub 14 ani',
    'Mediu',
    4,
    'Validitatea actelor de conservare încheiate de minorul lipsit de capacitate de exercițiu.',
    'Mihai, în vârstă de 13 ani, aflând că apartamentul moștenit de la bunica sa riscă să fie ocupat abuziv, a depus singur o cerere la poliție și a luat măsuri pentru schimbarea încuietorilor, cheltuind 800 lei din banii lăsați de bunica. Mama lui Mihai era în străinătate și nu putea fi contactată. La întoarcere, mama consideră că Mihai nu putea face aceste acte singur și cere restituirea sumei de la firma de lacătușerie. Firma invocă caracterul urgent și necesar al intervenției.',
    'Este valabil actul de conservare efectuat de Mihai?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 6: Actul de conservare făcut de minor sub 14 ani';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '43', 'Art. 43'),
        (case_id, '44', 'Art. 44');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a lui Mihai (13 ani - lipsit de capacitate de exercițiu conform art. 43 alin. 1 lit. a)'),
        (case_id, 2, 'Analiza excepției de la regula reprezentării conform art. 43 alin. 3 (actele de conservare pot fi făcute singur)'),
        (case_id, 3, 'Verificarea naturii actului (măsuri pentru protejarea bunului - act de conservare)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (validitatea actului - chiar minorii sub 14 ani pot face acte de conservare)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce prevede art. 43 alin. 3 despre actele pe care le poate face singur minorul sub 14 ani?'),
        (case_id, 2, 'Schimbarea încuietorilor pentru protejarea bunului este act de conservare sau de dispoziție?'),
        (case_id, 3, 'Lipsa capacității de exercițiu înseamnă că minorul nu poate face niciun act juridic?'),
        (case_id, 4, 'Care este diferența între actele de conservare și actele de dispoziție?');
END $$;

-- Caz 7: Acceptarea liberalității fără sarcini
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 7: Acceptarea liberalității fără sarcini',
    'Mediu',
    4,
    'Validitatea acceptării unei donații fără sarcini de către un minor cu capacitate restrânsă.',
    'Ioana, în vârstă de 15 ani, a primit o donație de la mătușa sa constând într-un teren în valoare de 30.000 lei, fără nicio sarcină sau condiție. Ioana a acceptat singură donația în fața notarului, fără a cere încuviințarea părinților. Tatăl Ioanei cere anularea acceptării, susținând că o donație atât de mare nu putea fi acceptată fără acordul său. Mătușa Ioanei susține că acceptarea este valabilă conform legii.',
    'Este valabilă acceptarea donației efectuată de Ioana?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 7: Acceptarea liberalității fără sarcini';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '44', 'Art. 44');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a Ioanei (15 ani - capacitate de exercițiu restrânsă conform art. 41 alin. 1)'),
        (case_id, 2, 'Analiza excepției de la necesitatea încuviințării conform art. 41 alin. 3 (acceptare liberalități fără sarcini)'),
        (case_id, 3, 'Verificarea naturii donației (liberalitate fără condiții sau sarcini)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (validitatea acceptării - minorul poate accepta singur liberalități fără sarcini indiferent de valoare)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce prevede art. 41 alin. 3 despre acceptarea liberalităților de către minor?'),
        (case_id, 2, 'Valoarea mare a donației (30.000 lei) schimbă regula despre acceptarea liberalităților fără sarcini?'),
        (case_id, 3, 'Care este diferența între o liberalitate cu sarcini și una fără sarcini?'),
        (case_id, 4, 'Tatăl poate contesta acceptarea chiar dacă legea permite minorului să o facă singur?');
END $$;

-- Caz 8: Actul de administrare care nu prejudiciază
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 8: Actul de administrare care nu prejudiciază',
    'Mediu',
    4,
    'Validitatea actului de administrare încheiat de minor cu capacitate restrânsă care nu îl prejudiciază.',
    'Alexandru, în vârstă de 16 ani, proprietar al unui apartament primit moștenire, a încheiat singur un contract de administrare cu o firmă de management imobiliar pentru întreținerea și găsirea de chiriași, contra unui comision de 10% din chiria lunară. Contractul este pe termen de 1 an. Mama lui Alexandru cere anularea contractului, susținând că Alexandru nu putea încheia singur un astfel de contract. Firma de management susține că este un act de administrare avantajos pentru Alexandru.',
    'Este valabil contractul de administrare încheiat de Alexandru?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 8: Actul de administrare care nu prejudiciază';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '44', 'Art. 44');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a lui Alexandru (16 ani - capacitate de exercițiu restrânsă conform art. 41 alin. 1)'),
        (case_id, 2, 'Analiza excepției conform art. 41 alin. 3 (actele de administrare care nu prejudiciază minorul pot fi făcute singur)'),
        (case_id, 3, 'Verificarea naturii actului și a efectelor (contract de administrare profesională care îl avantajează pe minor)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (validitatea actului - este act de administrare care nu prejudiciază minorul)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce înseamnă act de administrare conform art. 41 alin. 3?'),
        (case_id, 2, 'Cum se stabilește dacă un act de administrare prejudiciază sau nu minorul?'),
        (case_id, 3, 'Contractul de administrare pe 1 an este act de administrare sau de dispoziție?'),
        (case_id, 4, 'Faptul că nu a cerut încuviințarea părinților duce la anulare dacă actul nu îl prejudiciază?');
END $$;

-- Caz 9: Manoperele dolosive ale minorului
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 9: Manoperele dolosive ale minorului',
    'Mediu',
    4,
    'Consecințele manoperelor dolosive folosite de minor pentru a ascunde lipsa capacității de exercițiu.',
    'Elena, în vârstă de 17 ani, dorind să cumpere o motocicletă, i-a prezentat vânzătorului un buletin fals pe care scria că are 19 ani și a semnat o declarație că este majoră. A cumpărat motocicleta pentru 12.000 lei. După 3 săptămâni, mama Elenei a aflat și cere anularea vânzării. Vânzătorul, descoperind frauda, cere menținerea contractului și plata despăgubirilor pentru manoperele dolosive. Elena recunoaște că a folosit un act fals.',
    'Care este soarta contractului de vânzare încheiat de Elena prin manopere dolosive?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 9: Manoperele dolosive ale minorului';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '44', 'Art. 44'),
        (case_id, '45', 'Art. 45');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a Elenei (17 ani - capacitate de exercițiu restrânsă conform art. 41 alin. 1)'),
        (case_id, 2, 'Analiza situației frauduloase conform art. 45 (utilizarea de manopere dolosive pentru ascunderea incapacității)'),
        (case_id, 3, 'Verificarea efectelor manoperelor dolosive (instanța poate menține contractul ca sancțiune civilă)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (anulabilitatea rămâne dar instanța poate menține contractul la cererea părții induse în eroare)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce prevede art. 45 despre declarația simplă a minorului că este capabil?'),
        (case_id, 2, 'Ce sunt manoperele dolosive și cum diferă de declarația simplă?'),
        (case_id, 3, 'Poate instanța să mențină contractul chiar dacă minorul nu avea capacitate?'),
        (case_id, 4, 'Frauda minorului înlătură protecția legală privind capacitatea de exercițiu?');
END $$;

-- Caz 10: Confirmarea actului după dobândirea majoratului
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 10: Confirmarea actului după dobândirea majoratului',
    'Mediu',
    4,
    'Posibilitatea confirmării actului anulabil încheiat în timpul minorității după dobândirea capacității depline.',
    'Andrei, la vârsta de 17 ani, și-a vândut o tabletă grafică profesională pentru 5.000 lei colegului său Denis, fără încuviințarea părinților. Tatăl lui Andrei a cerut anularea în instanță. Între timp, Andrei a împlinit 18 ani și, la prima ședință de judecată, a declarat în fața instanței că își confirmă vânzarea și nu dorește anularea, fiind mulțumit de tranzacție. Tatăl insistă asupra anulării, susținând că actul a fost făcut în timpul minorității.',
    'Poate fi anulat contractul de vânzare încheiat de Andrei în timpul minorității?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 10: Confirmarea actului după dobândirea majoratului';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '44', 'Art. 44'),
        (case_id, '48', 'Art. 48');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea situației inițiale (act încheiat în minoritate fără încuviințare - anulabil conform art. 44)'),
        (case_id, 2, 'Analiza momentului confirmării (după dobândirea majoratului - art. 48 permite confirmarea)'),
        (case_id, 3, 'Verificarea efectelor confirmării (confirmarea validează actul retroactiv și înlătură anulabilitatea)'),
        (case_id, 4, 'Stabilirea consecințelor juridice (actul devine valid prin confirmare - acțiunea în anulare nu mai poate fi admisă)');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce prevede art. 48 despre confirmarea actelor după dobândirea majoratului?'),
        (case_id, 2, 'Confirmarea făcută de Andrei după majorat înlătură anulabilitatea actului?'),
        (case_id, 3, 'Tatăl mai poate cere anularea după ce Andrei a confirmat actul?'),
        (case_id, 4, 'Care este diferența între anularea actului și confirmarea acestuia?');
END $$;

-- ============================================================================
-- CAZURI DIFICILE (Hard Cases) - Week 5
-- ============================================================================

-- Caz 1: Conflictul între capacitate anticipată și căsătorie anulată
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 1: Conflictul între capacitate anticipată și căsătorie anulată',
    'Dificil',
    5,
    'Interacțiunea dintre dobândirea capacității prin căsătorie anulată și recunoașterea anticipată a capacității depline pentru același minor.',
    'Raluca s-a căsătorit la 16 ani și 2 luni cu Sorin (22 ani), dobândind capacitate deplină. În timpul căsătoriei, a vândut un teren moștenit pentru 80.000 lei. După 8 luni, căsătoria a fost anulată pentru viciu de consimțământ (violență), dar Raluca a fost declarată de bună-credință. În același timp, instanța de tutelă i-a recunoscut între timp capacitate deplină anticipată pentru motive temeinice (gestionarea afacerii de familie). Părinții cer anularea vânzării terenului, susținând că la momentul actului Raluca avea doar capacitate prin căsătorie, care acum e anulată. Raluca invocă că are capacitate anticipată recunoscută. Cumpărătorul, Victor, a aflat după 2 luni de anularea căsătoriei și cere clarificări.',
    'Care este capacitatea de exercițiu a Ralucăi la momentul vânzării și este valabilă tranzacția?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 1: Conflictul între capacitate anticipată și căsătorie anulată';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '38', 'Art. 38'), (case_id, '39', 'Art. 39'),
        (case_id, '40', 'Art. 40'), (case_id, '41', 'Art. 41'),
        (case_id, '44', 'Art. 44'), (case_id, '45', 'Art. 45'),
        (case_id, '48', 'Art. 48');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea multiplelor surse de capacitate (căsătorie + recunoaștere anticipată) și momentele dobândirii fiecăreia'),
        (case_id, 2, 'Analiza efectelor anulării căsătoriei conform art. 39 alin. 2 (păstrarea capacității pentru bună-credință)'),
        (case_id, 3, 'Verificarea validității recunoașterii anticipate și efectelor retroactive sau prospective ale acesteia'),
        (case_id, 4, 'Stabilirea consecințelor juridice prin aplicarea principiului că actul valid la momentul încheierii rămâne valid');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Cum interacționează art. 39 alin. 2 cu art. 40 când ambele se aplică aceleiași persoane?'),
        (case_id, 2, 'Raluca păstrează capacitatea după anularea căsătoriei datorită bunei-credințe?'),
        (case_id, 3, 'Recunoașterea anticipată a capacității produce efecte retroactive asupra actelor anterioare?'),
        (case_id, 4, 'Care este situația cumpărătorului care a contractat cu o persoană aparent capabilă?');
END $$;

-- Caz 2: Manopere dolosive și confirmarea parțială
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 2: Manopere dolosive și confirmarea parțială după majorat',
    'Dificil',
    5,
    'Confirmarea selectivă a unor acte anulabile și refuzul confirmării altora după dobândirea majoratului în context de manopere dolosive anterioare.',
    'Cosmin, la 17 ani, a folosit un buletin fals pentru a încheia trei contracte: (1) cumpărare laptop 6.000 lei, (2) închiriere apartament 2 ani - 24.000 lei total, (3) împrumut 15.000 lei. După ce a împlinit 18 ani, Cosmin confirmă expres contractul de cumpărare și contractul de închiriere, dar refuză să confirme împrumutul, solicitând anularea acestuia. Creditorul invocă manoperele dolosive și cere menținerea tuturor contractelor. Tatăl lui Cosmin ceruse anterior anularea tuturor actelor. Vânzătorul și proprietarul acceptă confirmarea. Între timp, Cosmin a plătit parțial din împrumut (5.000 lei) după majorat.',
    'Poate Cosmin să confirme selectiv unele acte și să solicite anularea altora? Care este efectul manoperelor dolosive?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 2: Manopere dolosive și confirmarea parțială după majorat';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '44', 'Art. 44'),
        (case_id, '45', 'Art. 45'), (case_id, '46', 'Art. 46'),
        (case_id, '47', 'Art. 47'), (case_id, '48', 'Art. 48');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea naturii anulabile a actelor și a condițiilor de confirmare conform art. 48'),
        (case_id, 2, 'Analiza efectului manoperelor dolosive conform art. 45 și puterea discreționară a instanței'),
        (case_id, 3, 'Verificarea posibilității confirmării selective și a efectelor plății parțiale după majorat (confirmare tacită?)'),
        (case_id, 4, 'Stabilirea consecințelor juridice pentru fiecare contract în parte și raportul cu manoperele dolosive');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Poate o persoană să confirme doar unele acte anulabile făcute în minoritate, refuzând altele?'),
        (case_id, 2, 'Manoperele dolosive înlătură dreptul de a cere anularea sau doar permit instanței să mențină contractul?'),
        (case_id, 3, 'Plata parțială după majorat constituie confirmare tacită a împrumutului conform art. 48?'),
        (case_id, 4, 'Instanța are putere discreționară în aplicarea sancțiunii civile pentru manopere dolosive?');
END $$;

-- Caz 3: Actul de administrare cu efecte prejudiciabile ulterioare
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 3: Actul de administrare cu efecte prejudiciabile ulterioare',
    'Dificil',
    5,
    'Calificarea unui act ca fiind de administrare neprejudiciabil la momentul încheierii dar cu efecte prejudiciabile manifestate ulterior.',
    'Tudor (15 ani) a încheiat un contract de administrare cu o firmă de property management pentru apartamentul său moștenit, stabilind un comision de 8% din chiria lunară, contract valabil 3 ani. La momentul semnării, chiria era 2.000 lei/lună, deci comisionul 160 lei/lună. După 1 an, din cauza managementului slab, chiria a scăzut la 1.200 lei/lună, iar firma refuză să rezilieze contractul. Mama Tudorului descoperă situația și cere anularea contractului, invocând că acum Tudor este prejudiciat de contract. Firma susține că la momentul încheierii actul era neprejudiciabil conform art. 41 alin. 3. Tudor a împlinit între timp 16 ani. Un alt apartament similar administrat direct de proprietar are chirie 2.500 lei/lună.',
    'Este valabil contractul de administrare încheiat de Tudor și poate fi anulat pentru prejudiciu ulterior?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 3: Actul de administrare cu efecte prejudiciabile ulterioare';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '44', 'Art. 44'),
        (case_id, '46', 'Art. 46'), (case_id, '47', 'Art. 47');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea naturii actului la momentul încheierii (act de administrare conform art. 41 alin. 3)'),
        (case_id, 2, 'Analiza momentului relevant pentru aprecierea caracterului prejudiciabil (la încheierea actului sau ulterior?)'),
        (case_id, 3, 'Verificarea existenței prejudiciului inițial versus prejudiciul supervenit din executare defectuoasă'),
        (case_id, 4, 'Stabilirea consecințelor juridice și a diferenței între anulabilitatea pentru incapacitate și răspunderea contractuală');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Momentul relevant pentru aprecierea caracterului neprejudiciabil este încheierea actului sau executarea sa?'),
        (case_id, 2, 'Un act neprejudiciabil la origine devine anulabil dacă ulterior produce prejudicii?'),
        (case_id, 3, 'Tudor poate invoca răspunderea contractuală a firmei fără a cere anularea?'),
        (case_id, 4, 'Împlinirea vârstei de 16 ani schimbă situația juridică a contractului încheiat la 15 ani?');
END $$;

-- Caz 4: Conflictul între veniturile din muncă și patrimoniul familial
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 4: Conflictul între veniturile din muncă și patrimoniul familial',
    'Dificil',
    5,
    'Distincția între dreptul minorului de a dispune de veniturile din muncă și protecția patrimoniului familial în context de investiții și garanții.',
    'Patricia (16 ani) lucrează legal ca programator freelancer câștigând 8.000 lei/lună. Cu veniturile sale, a: (1) cumpărat acțiuni la o companie startup pentru 25.000 lei, (2) constituit garanție personală (fidejusiune) pentru un împrumut de 50.000 lei luat de un prieten, (3) investit 30.000 lei într-un apartament în coproprietate cu părinții (contribuție 20%). Părinții au încuviințat contractul de muncă dar nu știau de aceste operațiuni. După 6 luni, startup-ul a dat faliment (pierdere totală), prietenul nu plătește împrumutul (banca o acționează pe Patricia), iar apartamentul s-a depreciat cu 15%. Părinții cer anularea tuturor actelor, invocând art. 41. Patricia invocă art. 42 alin. 2 - dreptul de a dispune de propriile venituri.',
    'Poate Patricia să dispună liber de veniturile din muncă pentru orice fel de acte juridice sau există limitări?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 4: Conflictul între veniturile din muncă și patrimoniul familial';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42'),
        (case_id, '44', 'Art. 44'), (case_id, '46', 'Art. 46'),
        (case_id, '315', 'Art. 315-321');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea drepturilor conferite de art. 42 alin. 2 (dispoziție asupra veniturilor din muncă)'),
        (case_id, 2, 'Analiza distincției între acte de dispoziție simple și acte speciale (garanții personale, investiții imobiliare)'),
        (case_id, 3, 'Verificarea limitelor dreptului de dispoziție și aplicabilității art. 41 alin. 2 pentru acte care depășesc administrarea veniturilor'),
        (case_id, 4, 'Stabilirea validității fiecărui act și a răspunderii patrimoniale a Patriciei și părinților');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Art. 42 alin. 2 permite minorului să dispună NELIMITAT de veniturile din muncă sau există limitări?'),
        (case_id, 2, 'Constituirea de garanții personale poate fi făcută de minor chiar cu venituri din muncă proprie?'),
        (case_id, 3, 'Investiția în imobil în coproprietate cu părinții este act simplu de dispoziție sau necesită încuviințare suplimentară?'),
        (case_id, 4, 'Care este patrimoniul care răspunde pentru datoriile asumate de minor din veniturile proprii?');
END $$;

-- Caz 5: Reprezentarea minorului și conflictul de interese
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 5: Reprezentarea minorului și conflictul de interese între părinți',
    'Dificil',
    5,
    'Încheierea unui act juridic de către un părinte în numele minorului când există conflict de interese între părinți și necesitatea numirii unui curator special.',
    'David (12 ani) a moștenit de la bunicul său un apartament în valoare de 120.000 lei. Tatăl lui David, Gheorghe, aflându-se în dificultăți financiare, a vândut apartamentul fiului său către fratele său, Pavel (unchiul lui David), pentru 90.000 lei, justificând că are nevoie urgentă de bani pentru tratamentul medical al soției sale. Vânzarea s-a făcut fără autorizarea instanței de tutelă. Mama lui David, Elena (divorțată de Gheorghe), cere anularea vânzării, invocând că exista conflict de interese - Pavel este fratele lui Gheorghe și prețul este sub valoarea de piață. Gheorghe susține că a acționat în interesul lui David (banii au fost folosiți pentru familie). Pavel invocă buna-credință. Între timp, Pavel a renovat apartamentul investind 30.000 lei.',
    'Este valabilă vânzarea apartamentului lui David și care sunt consecințele anulării?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 5: Reprezentarea minorului și conflictul de interese între părinți';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '43', 'Art. 43'),
        (case_id, '44', 'Art. 44'), (case_id, '46', 'Art. 46'),
        (case_id, '107', 'Art. 107'), (case_id, '43 NCC', 'Art. 43 NCC');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea naturii actului (reprezentare legală conform art. 43 - David lipsit de capacitate de exercițiu)'),
        (case_id, 2, 'Analiza existenței conflictului de interese și necesității curator special sau autorizare instanță tutelă'),
        (case_id, 3, 'Verificarea consecințelor lipsei autorizării conform art. 44 și 46 (anulabilitate și inițiativa procurorului)'),
        (case_id, 4, 'Stabilirea efectelor anulării conform art. 47 și situația îmbunătățirilor aduse de dobânditor de bună-credință');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Cine poate reprezenta minorul când părintele are interes contrar minorului?'),
        (case_id, 2, 'Este necesar curator special sau este suficientă autorizarea instanței de tutelă pentru astfel de acte?'),
        (case_id, 3, 'Prețul sub valoarea de piață este suficient pentru a dovedi conflictul de interese?'),
        (case_id, 4, 'Care sunt obligațiile de restituire ale fiecărei părți în caz de anulare conform art. 47?');
END $$;

-- Caz 6: Actul conservator complex în urgență
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 6: Actul conservator al minorului în absența reprezentantului și caracterul urgent',
    'Dificil',
    5,
    'Validitatea actelor conservatorii complexe făcute de minor sub 14 ani în situație de urgență și limitele acestei excepții.',
    'Ana (13 ani) se afla singură acasă când o țeavă a spart în apartamentul moștenit de la bunica sa, riscând inundarea apartamentului propriu și a celor 3 vecini de dedesubt. În lipsa părinților (plecați în străinătate, nerejoșnși), Ana a: (1) chemat instalatorul de urgență - cost 1.500 lei, (2) semnat contract cu firmă de remedieri - 8.000 lei, (3) încheiat contract de asigurare pentru daune viitoare - 3.000 lei pe an, (4) acceptat oferta unui vecin de a cumpăra apartamentul afectat pentru 75.000 lei (sub valoarea de piață 100.000 lei) pentru a plăti reparațiile. La întoarcere, părinții confirmă primele 3 acte dar cer anularea vânzării. Cumpărătorul, Ionel, invocă că Ana a fost de acord și că și vânzarea e act conservator (salvarea capitalului prin transformare în bani).',
    'Care dintre actele încheiate de Ana sunt valabile ca acte conservatorii și care depășesc această calificare?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 6: Actul conservator al minorului în absența reprezentantului și caracterul urgent';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '43', 'Art. 43'), (case_id, '44', 'Art. 44'),
        (case_id, '107', 'Art. 107');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea capacității de exercițiu a Anei (13 ani - lipsită de capacitate conform art. 43 alin. 1 lit. a)'),
        (case_id, 2, 'Analiza excepției de la reprezentare pentru actele conservatorii conform art. 43 alin. 3'),
        (case_id, 3, 'Verificarea naturii fiecărui act: conservator pur (1-2) versus contracte complexe (3-4) care depășesc conservarea'),
        (case_id, 4, 'Stabilirea limitelor noțiunii de act conservator și validității fiecărui act în parte');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce sunt actele de conservare conform art. 43 alin. 3 și care sunt limitele acestei noțiuni?'),
        (case_id, 2, 'Contractul de asigurare poate fi considerat act conservator sau depășește această calificare?'),
        (case_id, 3, 'Vânzarea unui bun imobil poate fi vreodată act conservator sau este întotdeauna act de dispoziție?'),
        (case_id, 4, 'Urgența situației extininde aria actelor conservatorii pe care le poate face minorul?');
END $$;

-- Caz 7: Liberalitatea cu sarcini disimulate
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 7: Liberalitatea cu sarcini disimulate și viciul de consimțământ',
    'Dificil',
    5,
    'Acceptarea unei liberalități aparent fără sarcini de către minor dar cu obligații disimulate sau condiții ulterioare.',
    'Andrei (15 ani) a primit de la unchiul său, Marcel, o donație constând într-un teren agricol în valoare de 45.000 lei, aparent fără nicio sarcină. Andrei a acceptat singur donația în fața notarului, fără încuviințarea părinților, invocând art. 41 alin. 3. După 2 luni, Marcel pretinde că exista un acord verbal: Andrei trebuia să plătească 500 lei/lună timp de 5 ani către o fundație indicată de Marcel (total 30.000 lei), altfel pământul se întoarce la donator. Marcel prezintă înregistrări audio parțiale. Părinții Andreiului cer anularea acceptării pentru două motive: (1) existența sarcinilor disimulate - deci nu e aplicabil art. 41 alin. 3, (2) dol - Andrei a fost indus în eroare de Marcel că nu sunt sarcini.',
    'Este valabilă acceptarea donației de către Andrei și cum se califică sarcinile ulterioare?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 7: Liberalitatea cu sarcini disimulate și viciul de consimțământ';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '44', 'Art. 44'),
        (case_id, '1169', 'Art. 1169-1177'), (case_id, '1011', 'Art. 1011-1015');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea naturii juridice a donației și a existenței sau inexistenței sarcinilor (clauză verbală vs. act autentic)'),
        (case_id, 2, 'Analiza aplicabilității art. 41 alin. 3 (acceptare liberalități fără sarcini) și probei sarcinilor'),
        (case_id, 3, 'Verificarea existenței dolului ca viciu de consimțământ și cumulul de cauze de anulabilitate'),
        (case_id, 4, 'Stabilirea consecințelor juridice: anulabilitate pentru incapacitate versus anulabilitate pentru dol');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Pot exista sarcini verbale într-o donație făcută prin act autentic și cum se probează?'),
        (case_id, 2, 'O sarcină adăugată verbal după actul autentic face ca donația să fie cu sarcini?'),
        (case_id, 3, 'Andrei poate invoca singur dolul în apărare conform art. 44 alin. 2 chiar fiind minor?'),
        (case_id, 4, 'Cum se cumuleacă anulabilitatea pentru incapacitate cu anulabilitatea pentru dol?');
END $$;

-- Caz 8: Emanciparea prin căsătorie și contractele anterioare
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 8: Emanciparea prin căsătorie și contractele anterioare căsătoriei',
    'Dificil',
    5,
    'Soarta actelor juridice încheiate înainte de căsătorie de către minor care ulterior dobândește capacitate deplină prin căsătorie.',
    'Simona a încheiat la 17 ani și 10 luni un contract de vânzare-cumpărare (bijuterii 12.000 lei) și un contract de împrumut (20.000 lei pe 3 ani) fără încuviințarea părinților. După 2 luni, Simona s-a căsătorit la 18 ani cu Radu, dobândind capacitate deplină. După căsătorie, Simona a plătit 4 rate din împrumut (total 3.000 lei) și a confirmat în scris contractul de vânzare. Părinții Simonei au introdus acțiuni de anulare pentru ambele contracte înainte de căsătoria Simonei. La prima ședință de judecată (după căsătorie), Simona declară că își confirmă ambele contracte. Creditul și vânzătorul cer respingerea acțiunilor. Părinții susțin că au calitate procesuală activă ca reprezentanți legali la momentul introducerii acțiunii.',
    'Pot fi anulate contractele încheiate înainte de căsătorie având în vedere confirmarea ulterioară? Părinții mai au calitate după căsătoria Simonei?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 8: Emanciparea prin căsătorie și contractele anterioare căsătoriei';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '38', 'Art. 38'), (case_id, '39', 'Art. 39'),
        (case_id, '41', 'Art. 41'), (case_id, '44', 'Art. 44'),
        (case_id, '46', 'Art. 46'), (case_id, '48', 'Art. 48');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea momentelor relevante: încheierea actelor (minoritate) vs. introducerea acțiunii vs. căsătorie vs. confirmare'),
        (case_id, 2, 'Analiza calității procesuale active a părinților după încetarea autorității părintești prin căsătoria Simonei'),
        (case_id, 3, 'Verificarea efectelor confirmării post-căsătorie asupra actelor anterioare anulabile conform art. 48'),
        (case_id, 4, 'Stabilirea consecințelor juridice: încetarea acțiunii pentru pierderea calității sau respingere pentru confirmare');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Părinții își pierd calitatea de reprezentanți legali prin căsătoria copilului lor minor?'),
        (case_id, 2, 'Confirmarea actului anulabil după dobândirea capacității depline înlătură retroactiv anulabilitatea?'),
        (case_id, 3, 'Acțiunea în anulare introdusă de părinți poate continua după pierderea calității lor de reprezentanți?'),
        (case_id, 4, 'Plata ratelor din împrumut după căsătorie constituie confirmare tacită conform art. 48?');
END $$;

-- Caz 9: Frauda la lege prin utilizarea excepțiilor
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 9: Frauda la lege prin utilizarea excepțiilor de la incapacitate',
    'Dificil',
    5,
    'Utilizarea abuzivă a excepțiilor legale pentru a ocoli protecția minorului prin structurarea artificială a actelor juridice.',
    'Cristian (16 ani) dorește să vândă un apartament moștenit în valoare de 150.000 lei către dezvoltatorul imobiliar Victor. Știind că trebuie încuviințarea părinților și autorizarea instanței, ei structurează operațiunea astfel: (1) Cristian acceptă o donație de 150.000 lei de la Victor (act aparent fără sarcini pe care îl poate face singur conform art. 41 alin. 3), (2) imediat după, Cristian îi donează apartamentul lui Victor (pretinzând că e liberalitate fără sarcini reciprocă), (3) îi oferă 5.000 lei lui Cristian ca ''cadou'' pentru un contract de prestări servicii IT fictiv (Cristian nu are contract de muncă legal) pentru a justifica că sunt ''venituri proprii'' conform art. 42. Părinții descoperă schema după 1 lună și cer anularea tuturor actelor pentru fraudă la lege.',
    'Este valabilă această structură de acte având în vedere intenția de a ocoli normele privind incapacitatea?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 9: Frauda la lege prin utilizarea excepțiilor de la incapacitate';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '42', 'Art. 42'),
        (case_id, '43', 'Art. 43'), (case_id, '44', 'Art. 44'),
        (case_id, '15', 'Art. 15');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea intențiilor părților și scopului economic real al operațiunilor (vânzare deghizată în donații reciproce)'),
        (case_id, 2, 'Analiza aplicabilității art. 15 privind frauda la lege prin eludarea normelor privind incapacitatea'),
        (case_id, 3, 'Verificarea naturii reale a actelor (simulație) și distincției între aparență și realitate juridică'),
        (case_id, 4, 'Stabilirea consecințelor juridice: anulabilitate pentru incapacitate sau nulitate absolută pentru fraudă la lege');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Ce este frauda la lege conform art. 15 și se aplică în materia capacității de exercițiu?'),
        (case_id, 2, 'Donațiile reciproce simultane pot masca o vânzare-cumpărare pentru a ocoli normele privind incapacitatea?'),
        (case_id, 3, 'Simulația (actul aparent vs. actul real) poate fi invocată de minor sau reprezentanții săi?'),
        (case_id, 4, 'Care sunt consecințele juridice mai grave: anulabilitatea sau nulitatea absolută?');
END $$;

-- Caz 10: Cumul de vicii
INSERT INTO cases (title, level, week_number, legal_problem, case_description, question)
VALUES (
    'Caz 10: Cumul de vicii: incapacitate + leziune + dol + violență',
    'Dificil',
    5,
    'Anulabilitatea unui act juridic pentru multiple cauze concomitente și prioritatea între acestea.',
    'Maria (17 ani) a vândut o casă moștenită în valoare reală de 200.000 lei către Sergiu pentru doar 80.000 lei (leziune peste 50%). Tranzacția s-a realizat astfel: Sergiu a amenințat-o pe Maria că va dezvălui imagini compromitatoare cu ea (violență/șantaj), apoi i-a spus că prețul de piață e doar 90.000 lei și că îi face un favor plătind 80.000 lei (dol), profitând de neexperiența ei (leziune). Maria a semnat fără încuviințarea părinților. După 2 luni, părinții descoperă situația. Între timp, Sergiu a vândut casa către Ionuț (terț de bună-credință) pentru 190.000 lei. Părinții introduc acțiune invocând simultan: (1) anulabilitate pentru incapacitate (art. 44), (2) anulabilitate pentru leziune, (3) anulabilitate pentru dol, (4) anulabilitate pentru violență. Sergiu invocă prescripția sau decăderea unor acțiuni și protecția terțului dobânditor.',
    'Care este temeiul prioritar de anulare și care sunt efectele asupra terțului dobânditor de bună-credință?'
);

DO $$
DECLARE case_id UUID;
BEGIN
    SELECT id INTO case_id FROM cases WHERE title = 'Caz 10: Cumul de vicii: incapacitate + leziune + dol + violență';

    INSERT INTO case_articles (case_id, article_number, article_reference) VALUES
        (case_id, '41', 'Art. 41'), (case_id, '44', 'Art. 44'),
        (case_id, '45', 'Art. 45'), (case_id, '46', 'Art. 46'),
        (case_id, '1201', 'Art. 1201-1220');

    INSERT INTO case_analysis_steps (case_id, step_number, step_description) VALUES
        (case_id, 1, 'Identificarea tuturor cauzelor de anulabilitate și condițiilor specifice fiecăreia (termene, probe)'),
        (case_id, 2, 'Analiza posibilității cumulului de motive și eventual a priorității unora față de altele (regimul special al incapacității)'),
        (case_id, 3, 'Verificarea efectelor anulării în lanțul de transmisiuni și protecției terțului dobânditor de bună-credință'),
        (case_id, 4, 'Stabilirea consecințelor juridice optime pentru Maria și limitările revendicării bunului');

    INSERT INTO case_hints (case_id, hint_number, hint_text) VALUES
        (case_id, 1, 'Când există multiple cauze de anulabilitate, există o ordine de prioritate sau pot fi invocate cumulativ?'),
        (case_id, 2, 'Termenele de prescripție/decădere diferă pentru anulabilitatea bazată pe incapacitate versus vicii de consimțământ?'),
        (case_id, 3, 'Protecția terțului dobânditor de bună-credință se aplică și în caz de anulare pentru incapacitate?'),
        (case_id, 4, 'Care sunt diferențele între restituirea în natură și restituirea prin echivalent conform art. 47?');
END $$;
