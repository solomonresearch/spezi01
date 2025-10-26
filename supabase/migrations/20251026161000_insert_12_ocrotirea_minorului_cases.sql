-- Migration: Insert 12 verified legal cases - Ocrotirea minorului
-- Date: 2025-10-26
-- Description: Insert or update 12 professionally verified cases focusing on protection of minors
-- These cases cover advanced topics in "Capacitatea de exercițiu - Ocrotirea minorului"

-- Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert cases using UPSERT (INSERT ... ON CONFLICT ... DO UPDATE)
-- This allows the migration to be run multiple times safely

INSERT INTO cases (
    id,
    title,
    case_code,
    verified,
    level,
    week_number,
    subcategory,
    legal_problem,
    case_description,
    question,
    created_at,
    updated_at
) VALUES
    -- Caz 20: Acceptarea unei donații de către un copil (CIV1AQO)
    (
        gen_random_uuid(),
        'Acceptarea unei donații de către un copil',
        'CIV1AQO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
        'Validitatea acceptării unei donații de către un minor fără capacitate de exercițiu în absența reprezentării legale.',
        'Bogdan, în vârstă de 11 ani, se află singur într-un parc de distracții când pierde portofelul cu bani. Un turist străin, văzându-l supărat, îi oferă să îi cumpere un joc video în valoare de 250 lei și să i-l dăruiască. Bogdan acceptă cadoul pe loc, fără să contacteze părinții. Când părinții află despre situație, se întreabă dacă acceptarea donației de către Bogdan este valabilă din punct de vedere juridic.',
        'Poate Bogdan să accepte singur donația oferită de turistul străin?',
        '2025-10-26 14:30:00.000000+00',
        NOW()
    ),
    -- Caz 21: Vânzarea bunurilor minorului de către tutore (CIV1ARO)
    (
        gen_random_uuid(),
        'Vânzarea bunurilor minorului de către tutore',
        'CIV1ARO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
        'Validitatea actului de dispoziție încheiat de tutore fără autorizarea instanței de tutelă.',
        'Carmen, minoră de 14 ani, a moștenit de la bunicii săi un apartament și un autoturism. Tutorele ei, unchiul Mihai, decide să vândă autoturismul pentru 45.000 lei pentru a putea face reparații capitale la apartament, care necesită investiții urgente. Mihai nu solicită autorizarea instanței de tutelă, considerând că este un act de bună administrare. Procurorul, sesizat de consiliul de familie, contestă validitatea vânzării.',
        'Este valabilă vânzarea autoturismului efectuată de tutore fără autorizarea instanței de tutelă?',
        '2025-10-26 14:35:00.000000+00',
        NOW()
    ),
    -- Caz 22: Minorul care ascunde vârsta reală (CIV1ASO)
    (
        gen_random_uuid(),
        'Minorul care ascunde vârsta reală',
        'CIV1ASO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
        'Validitatea contractului încheiat de un minor care a ascuns vârsta sa reală prin manopere dolosive.',
        'Tudor, în vârstă de 17 ani, dorește să cumpere un scuter. Acesta își modifică actul de identitate pentru a arăta că este major și încheie un contract de vânzare-cumpărare autentificat notarial pentru suma de 15.000 lei. După trei săptămâni, mama lui Tudor descoperă tranzacția și solicită anularea contractului pentru lipsa capacității de exercițiu. Vânzătorul se opune, arătând că a fost înșelat de Tudor prin manoperele dolosive ale acestuia.',
        'Poate fi anulat contractul având în vedere că minorul a folosit manopere dolosive pentru a-și ascunde vârsta?',
        '2025-10-26 14:40:00.000000+00',
        NOW()
    ),
    -- Caz 23: Contracte multiple încheiate în absența părinților (CIV1ATO)
    (
        gen_random_uuid(),
        'Contracte multiple încheiate în absența părinților',
        'CIV1ATO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
        'Validitatea mai multor contracte încheiate de un minor cu capacitate de exercițiu restrânsă aflat în grija bunicilor.',
        'Ștefan, în vârstă de 16 ani, este lăsat în grija bunicilor pe durata unui sejur de lucru al părinților în străinătate, de 3 luni. În această perioadă, Ștefan: (1) se înscrie la un curs de șofat pentru 2.500 lei, (2) contractează repararea tabletei sale pentru 600 lei, (3) vinde câțiva pui de câine din crescătoria familiei pentru 3.000 lei, și (4) schimbă vechea sa consolă de jocuri cu un laptop de la un prieten. Părinții descoperă toate aceste tranzacții la întoarcere.',
        'Care dintre aceste contracte sunt valabile și cum trebuiau să procedeze bunicii și Ștefan?',
        '2025-10-26 14:45:00.000000+00',
        NOW()
    ),
    -- Caz 24: Contractul educațional cu acordul unui singur părinte (CIV1AUO)
    (
        gen_random_uuid(),
        'Contractul educațional cu acordul unui singur părinte',
        'CIV1AUO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
        'Validitatea contractului de prestări servicii educaționale încheiat cu consimțământul unui singur părinte.',
        'Andreea, în vârstă de 17 ani, dorește să participe la un program intensiv de pregătire pentru admiterea la facultate, în valoare de 6.000 lei. Mama ei semnează o declarație de consimțământ și Andreea plătește prima rată de 2.000 lei cu cardul mamei. Tatăl Andreei, aflând despre situație, refuză categoric continuarea cursurilor și plata restului sumei, susținând că nu și-a dat acordul și că suma este exagerată. Școala solicită plata integrală a sumei contractate.',
        'Este valabil contractul având în vedere că doar mama și-a dat consimțământul?',
        '2025-10-26 14:50:00.000000+00',
        NOW()
    ),
    -- Caz 25: Vânzarea tabloului și neplata evaluatorului (CIV1AVO)
    (
        gen_random_uuid(),
        'Vânzarea tabloului și neplata evaluatorului',
        'CIV1AVO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
        'Validitatea contractelor de prestări servicii și vânzare încheiate de un minor cu capacitate de exercițiu restrânsă, urmate de solicitarea de anulare.',
        'Patricia, în vârstă de 16 ani, moștenește un tablou de la un unchi și decide să îl vândă pentru a strânge bani pentru o tabără de vară (costul: 4.000 lei). Ea angajează un expert evaluator care stabilește valoarea tabloului la 6.500 lei, cu comision de 500 lei, plătibil după vânzare. Patricia vinde tabloul pentru 6.500 lei, își plătește tabăra, dar refuză să plătească evaluatorul și solicită anularea ambelor contracte pentru lipsa încuviințării părinților.',
        'Ce sancțiune juridică este aplicabilă în acest caz și care este soarta celor două contracte?',
        '2025-10-26 14:55:00.000000+00',
        NOW()
    ),
    -- Caz 26: Comodatul bicicletei (CIV1AWO)
    (
        gen_random_uuid(),
        'Comodatul bicicletei',
        'CIV1AWO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
        'Validitatea contractului de comodat încheiat de un minor cu capacitate de exercițiu restrânsă fără încuviințarea ocrotitorului.',
        'Gabriel, în vârstă de 16 ani, împrumută bicicleta sa montană, în valoare de 4.500 lei, unui coleg pentru o perioadă de 4 luni, fără nicio contraprestaț ie. Tatăl lui Gabriel, ocrotitorul legal, descoperă situația după două luni și solicită constatarea nulității contractului și restituirea imediată a bicicletei, invocând că este vorba de un act cu titlu gratuit pe care minorul nu îl putea încheia singur.',
        'Este nul contractul de comodat încheiat de Gabriel fără încuviințarea ocrotitorului?',
        '2025-10-26 15:00:00.000000+00',
        NOW()
    ),
    -- Caz 27: Vânzarea terenului de către tutore împotriva avizului consiliului (CIV1AXO)
    (
        gen_random_uuid(),
        'Vânzarea terenului de către tutore împotriva avizului consiliului',
        'CIV1AXO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
        'Validitatea actului de dispoziție încheiat de tutore cu autorizarea instanței dar împotriva avizului consiliului de familie.',
        'Nicolae, în vârstă de 13 ani, deține un teren agricol moștenit. Tutorele său, Dan, obține autorizarea instanței de tutelă pentru vânzarea terenului în vederea investirii banilor într-un apartament pentru minor. Consiliul de familie emite un aviz negativ, considerând prețul prea mic. Tutorele procedează totuși la vânzare. Separat, Nicolae, cu încuviințarea tutorelui, semnează un contract de colaborare cu o academie de fotbal, primind 2.500 lei avans, din care tutorele cumpără o bicicletă pentru Nicolae.',
        'Sunt valabile actele încheiate de tutore și de minor?',
        '2025-10-26 15:05:00.000000+00',
        NOW()
    ),
    -- Caz 28: Emanciparea în timpul procesului (CIV1AYO)
    (
        gen_random_uuid(),
        'Emanciparea în timpul procesului',
        'CIV1AYO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
        'Efectele emancipării asupra validității actelor încheiate anterior de minor fără încuviințarea ocrotitorului.',
        'Radu, în vârstă de 17 ani, intră în conflict cu tatăl său și încheie un contract de prestări servicii IT în valoare de 8.000 lei fără încuviințarea acestuia. Tatăl, în calitate de ocrotitor legal, solicită anularea contractului pentru lipsa capacității. Pe durata procesului, Radu se căsătorește și dobândește capacitate deplină de exercițiu prin emancipare. Radu dorește acum să mențină valabilitatea contractului și invocă confirmarea tacită a acestuia prin emancipare.',
        'Poate Radu să confirme contractul după emancipare și care este efectul emancipării asupra cererii de anulare?',
        '2025-10-26 15:10:00.000000+00',
        NOW()
    ),
    -- Caz 29: Actele multiple ale tutorelui cu doi minori (CIV1AZO)
    (
        gen_random_uuid(),
        'Actele multiple ale tutorelui cu doi minori',
        'CIV1AZO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
        'Validitatea diferitelor acte juridice încheiate de tutore pentru doi minori cu capacități de exercițiu diferite.',
        'Tutorele Paul este numit pentru doi frați orfani: Ana (9 ani) și Cosmin (15 ani). La o săptămână după numire, Paul vinde echipamentul de ski al Anei (300 euro) pentru că i-a devenit mic. După aprobarea inventarului, Paul folosește banii câștigați de Cosmin dintr-un concurs de dans (2.000 lei) pentru a-și cumpăra un telefon personal. Ana plătește singură un colet de la curier (150 lei) din alocația sa. Cosmin semnează un contract de instructor de dans pentru copii, primind 1.800 lei avans, din care Paul cumpără haine pentru ambii minori.',
        'Care dintre aceste acte sunt valabile și care trebuie anulate?',
        '2025-10-26 15:15:00.000000+00',
        NOW()
    ),
    -- Caz 30: Actul de conservare încheiat de minor (CIV1BAO)
    (
        gen_random_uuid(),
        'Actul de conservare încheiat de minor',
        'CIV1BAO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
        'Validitatea actului de conservare încheiat de un minor cu capacitate de exercițiu restrânsă fără formalități suplimentare.',
        'Claudia, în vârstă de 15 ani, deține un apartament moștenit care necesită reparații urgente la acoperișul avariat de o furtună. Pentru a preveni deteriorări mai grave, Claudia încheie singură un contract de reparații de urgență în valoare de 3.500 lei, fără a consulta părinții care se aflau în concediu. Părinții, la întoarcere, contestă contractul pentru lipsa încuviințării lor, deși recunosc necesitatea lucrărilor.',
        'Este valabil contractul încheiat de Claudia având în vedere natura urgentă a lucrărilor?',
        '2025-10-26 15:20:00.000000+00',
        NOW()
    ),
    -- Caz 31: Delegarea autorității părintești bunicilor (CIV1BBO)
    (
        gen_random_uuid(),
        'Delegarea autorității părintești bunicilor',
        'CIV1BBO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu - Ocrotirea minorului)',
        'Validitatea actelor juridice încheiate în contextul delegării autorității părintești către bunici.',
        'Iulia, în vârstă de 16 ani, este lăsată în grija bunicului cărui i s-a delegat autoritatea părintească pe perioada în care ambii părinți lucrează în străinătate (12 luni). În această perioadă, Iulia dorește să: (1) se înscrie la un curs de design grafic (3.200 lei), (2) să repare laptopul (900 lei), (3) să vândă niște bijuterii handmade pe care le-a creat (valoare totală 2.800 lei), și (4) să schimbe tableta veche cu una nouă de la un prieten.',
        'Care este rolul bunicului în încuviințarea acestor acte și care acte poate încheia Iulia singură?',
        '2025-10-26 15:25:00.000000+00',
        NOW()
    )
ON CONFLICT (case_code)
DO UPDATE SET
    title = EXCLUDED.title,
    verified = EXCLUDED.verified,
    level = EXCLUDED.level,
    week_number = EXCLUDED.week_number,
    subcategory = EXCLUDED.subcategory,
    legal_problem = EXCLUDED.legal_problem,
    case_description = EXCLUDED.case_description,
    question = EXCLUDED.question,
    updated_at = NOW();

-- Verify the inserted/updated cases
SELECT
    case_code,
    title,
    verified,
    level,
    week_number,
    subcategory
FROM cases
WHERE case_code IN (
    'CIV1AQO', 'CIV1ARO', 'CIV1ASO', 'CIV1ATO',
    'CIV1AUO', 'CIV1AVO', 'CIV1AWO', 'CIV1AXO',
    'CIV1AYO', 'CIV1AZO', 'CIV1BAO', 'CIV1BBO'
)
ORDER BY case_code;
