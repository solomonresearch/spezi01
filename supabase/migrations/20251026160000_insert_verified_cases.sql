-- Migration: Insert 16 verified legal cases
-- Date: 2025-10-26
-- Description: Insert or update 16 professionally verified cases from legal expert
-- These cases cover "Capacitatea de exercițiu" (Exercise capacity) for minors

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
    -- Caz 4: Vânzarea unui laptop (CIV1AAO)
    (
        gen_random_uuid(),
        'Vânzarea unui laptop',
        'CIV1AAO',
        TRUE,
        'Mediu',
        3,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea unui contract de vânzare-cumpărare încheiat de un minor cu capacitate de exercițiu restrânsă fără încuviințarea părintelui.',
        'Ioana, în vârstă de 17 ani, și-a vândut laptopul pe care îl primise cadou de ziua ei colegului său, Răzvan, pentru suma de 3.500 lei. Ioana avea nevoie urgentă de bani pentru a-și cumpăra un telefon nou. Mama Ioanei, aflând despre vânzare după o săptămână, cere anularea tranzacției și returnarea laptopului. Răzvan refuză, susținând că a cumpărat laptopul în bună-credință și că Ioana nu i-a spus că este minoră.',
        'Este valabilă vânzarea laptopului încheiată între Ioana și Răzvan?',
        '2025-10-25 22:44:02.241125+00',
        NOW()
    ),
    -- Caz 5: Contractul de prestări servicii (CIV1ABO)
    (
        gen_random_uuid(),
        'Contractul de prestări servicii',
        'CIV1ABO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea contractului de prestări servicii încheiat de un minor cu capacitate de exercițiu restrânsă fără consimțământul ambilor părinți.',
        'Andrei, în vârstă de 16 ani, a încheiat un contract cu o firmă de web design pentru realizarea unui site corporate în valoare de 4.200 lei. Tatăl său a semnat o declarație de consimțământ, însă mama nu a fost consultată. După finalizarea lucrării, firma solicită plata integrală. Mama lui Andrei descoperă contractul și refuză plata, invocând că nu și-a dat acordul și că actul este nul pentru lipsa consimțământului ambilor părinți.',
        'Este valabil contractul încheiat de Andrei cu firma de web design?',
        '2025-10-26 12:49:34.968171+00',
        NOW()
    ),
    -- Caz 6: Donația acceptată de minor (CIV1ACO)
    (
        gen_random_uuid(),
        'Donația acceptată de minor',
        'CIV1ACO',
        TRUE,
        'Mediu',
        3,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Acceptarea unei donații de către un minor fără capacitate de exercițiu în absența reprezentării legale.',
        'Maria, în vârstă de 10 ani, primește o propunere de donație din partea vecinului său, domnul Popescu, care dorește să îi dăruiască o bicicletă nouă în valoare de 1.500 lei. Maria acceptă singură donația, fără știrea părinților. Părinții Mariei, aflând despre situație, doresc să clarifice dacă acceptarea donației este valabilă și dacă Maria putea să încheie singură acest act juridic.',
        'Este valabilă acceptarea donației de către Maria?',
        '2025-10-26 12:49:34.968200+00',
        NOW()
    ),
    -- Caz 7: Închirierea unui imobil de către tutore (CIV1ADO)
    (
        gen_random_uuid(),
        'Închirierea unui imobil de către tutore',
        'CIV1ADO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea contractului de închiriere încheiat de tutore fără autorizarea instanței de tutelă.',
        'Ion este tutorele lui Alexandru, un minor de 13 ani care a moștenit un apartament. Ion încheie un contract de închiriere a apartamentului pe o perioadă de 3 ani, cu o chirie lunară de 1.800 lei, fără a obține autorizarea instanței de tutelă. Consiliul de familie se opune închirierii. După 6 luni, procurorul sesizează instanța solicitând anularea contractului pentru lipsa autorizării.',
        'Este valabil contractul de închiriere încheiat de tutore?',
        '2025-10-26 12:49:34.968210+00',
        NOW()
    ),
    -- Caz 8: Cumpărarea unui telefon de către minor (CIV1AEO)
    (
        gen_random_uuid(),
        'Cumpărarea unui telefon de către minor',
        'CIV1AEO',
        TRUE,
        'Mediu',
        3,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea contractului de vânzare-cumpărare încheiat de un minor cu capacitate de exercițiu restrânsă pentru un bun de valoare medie.',
        'Elena, în vârstă de 15 ani, intră într-un magazin și cumpără un telefon mobil în valoare de 2.800 lei, plătind din banii primiți cadou de la bunici. Părinții Elenei descoperă achiziția după două săptămâni și consideră că suma este prea mare pentru vârsta ei. Aceștia solicită anularea contractului și restituirea banilor, invocând lipsa încuviințării lor.',
        'Este valabil contractul de vânzare-cumpărare încheiat de Elena?',
        '2025-10-26 12:49:34.968217+00',
        NOW()
    ),
    -- Caz 9: Vânzarea unui tablou de către minor (CIV1AFO)
    (
        gen_random_uuid(),
        'Vânzarea unui tablou de către minor',
        'CIV1AFO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea vânzării unui bun de valoare încheiate de un minor cu capacitate de exercițiu restrânsă fără încuviințarea părintelui.',
        'Cristian, în vârstă de 16 ani, moștenește un tablou de la bunicul său. Având nevoie de bani pentru un curs de programare, Cristian vinde tabloul unui colecționar pentru 5.000 lei, fără a consulta părinții. Mama lui Cristian, pictoriță, descoperă vânzarea și susține că tabloul avea o valoare sentimentală și artistică mult mai mare. Aceasta solicită anularea vânzării.',
        'Este valabilă vânzarea tabloului încheiată de Cristian?',
        '2025-10-26 12:49:34.968225+00',
        NOW()
    ),
    -- Caz 10: Contractul de reparații auto (CIV1AGO)
    (
        gen_random_uuid(),
        'Contractul de reparații auto',
        'CIV1AGO',
        TRUE,
        'Mediu',
        3,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea contractului de prestări servicii încheiat de un minor cu capacitate de exercițiu restrânsă pentru repararea unui bun personal.',
        'Mihai, în vârstă de 17 ani, proprietarul unei biciclete electrice, încheie un contract de reparații cu un service în valoare de 800 lei. Reparațiile sunt urgente pentru ca Mihai să poată merge la școală. Tatăl lui Mihai refuză să plătească factura, susținând că Mihai nu avea dreptul să încheie singur un astfel de contract fără acordul său prealabil.',
        'Este valabil contractul de reparații încheiat de Mihai?',
        '2025-10-26 12:49:34.968232+00',
        NOW()
    ),
    -- Caz 11: Împrumutul acordat de minor (CIV1AHO)
    (
        gen_random_uuid(),
        'Împrumutul acordat de minor',
        'CIV1AHO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea contractului de împrumut încheiat de un minor cu capacitate de exercițiu restrânsă fără încuviințarea ocrotitorului.',
        'Diana, în vârstă de 16 ani, împrumută unei prietene suma de 1.200 lei din economiile sale, stabilind restituirea într-o lună. Prietena nu returnează suma la termen. Părinții Dianei descoperă împrumutul și susțin că acesta este nul pentru lipsa încuviințării lor. Diana dorește să recupereze banii.',
        'Este valabil contractul de împrumut încheiat de Diana?',
        '2025-10-26 12:49:34.968239+00',
        NOW()
    ),
    -- Caz 12: Schimbul de bunuri între minori (CIV1AIO)
    (
        gen_random_uuid(),
        'Schimbul de bunuri între minori',
        'CIV1AIO',
        TRUE,
        'Mediu',
        3,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea contractului de schimb încheiat între doi minori cu capacitate de exercițiu restrânsă fără încuviințarea părinților.',
        'Vlad, în vârstă de 15 ani, schimbă consola sa de jocuri în valoare de 2.000 lei cu un laptop al colegului său, George, de 16 ani, evaluat la 2.200 lei. Ambii consideră schimbul echitabil. Părinții lui Vlad descoperă schimbul după o lună și solicită anularea acestuia, susținând că fiul lor a fost dezavantajat.',
        'Este valabil contractul de schimb încheiat între Vlad și George?',
        '2025-10-26 12:49:34.968246+00',
        NOW()
    ),
    -- Caz 13: Vânzarea de produse handmade (CIV1AJO)
    (
        gen_random_uuid(),
        'Vânzarea de produse handmade',
        'CIV1AJO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea contractelor de vânzare încheiate de un minor cu capacitate de exercițiu restrânsă în cadrul unei activități comerciale proprii.',
        'Anca, în vârstă de 17 ani, creează bijuterii handmade pe care le vinde pe internet. Într-o lună, realizează vânzări în valoare totală de 3.500 lei. Mama Ancăi descoperă activitatea și se îngrijorează că fiica sa încheie contracte fără supravegherea ei. Anca susține că are dreptul să încheie aceste contracte în legătură cu îndeletnicirile sale artistice.',
        'Sunt valabile contractele de vânzare încheiate de Anca?',
        '2025-10-26 12:49:34.968252+00',
        NOW()
    ),
    -- Caz 14: Contractul de comodat (CIV1AKO)
    (
        gen_random_uuid(),
        'Contractul de comodat',
        'CIV1AKO',
        TRUE,
        'Mediu',
        3,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea contractului de comodat încheiat de un minor cu capacitate de exercițiu restrânsă fără încuviințarea părintelui.',
        'Robert, în vârstă de 16 ani, împrumută unui prieten camera sa foto în valoare de 3.000 lei pentru o perioadă de două luni, fără să ceară nimic în schimb. Tatăl lui Robert descoperă situația și solicită restituirea imediată a camerei, invocând că Robert nu putea încheia singur un astfel de contract cu titlu gratuit.',
        'Este valabil contractul de comodat încheiat de Robert?',
        '2025-10-26 12:49:34.968258+00',
        NOW()
    ),
    -- Caz 15: Achiziția de cursuri online (CIV1ALO)
    (
        gen_random_uuid(),
        'Achiziția de cursuri online',
        'CIV1ALO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea contractului de prestări servicii educaționale încheiat de un minor cu capacitate de exercițiu restrânsă cu acordul parțial al părinților.',
        'Sofia, în vârstă de 17 ani, se înscrie la un curs online de design grafic în valoare de 2.500 lei. Mama ei semnează o declarație de consimțământ, dar tatăl nu este de acord. Sofia plătește prima rată de 1.000 lei din banii primiți de la mama sa. Tatăl descoperă situația și refuză plata restului sumei.',
        'Este valabil contractul încheiat de Sofia?',
        '2025-10-26 12:49:34.968265+00',
        NOW()
    ),
    -- Caz 16: Vânzarea unui instrument muzical (CIV1AMO)
    (
        gen_random_uuid(),
        'Vânzarea unui instrument muzical',
        'CIV1AMO',
        TRUE,
        'Mediu',
        3,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea vânzării unui bun de valoare medie de către un minor cu capacitate de exercițiu restrânsă fără încuviințarea părinților.',
        'Alexandra, în vârstă de 15 ani, vinde chitara sa electrică în valoare de 2.200 lei unui coleg de liceu pentru a-și cumpăra o tabletă. Părinții Alexandrei descoperă vânzarea după două săptămâni și solicită anularea contractului, susținând că fiica lor a acționat fără acordul lor și că instrumentul avea o valoare sentimentală.',
        'Este valabilă vânzarea chitarei încheiate de Alexandra?',
        '2025-10-26 12:49:34.968271+00',
        NOW()
    ),
    -- Caz 17: Acceptarea moștenirii de către minor (CIV1ANO)
    (
        gen_random_uuid(),
        'Acceptarea moștenirii de către minor',
        'CIV1ANO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea acceptării moștenirii de către un minor cu capacitate de exercițiu restrânsă fără reprezentarea legală.',
        'David, în vârstă de 16 ani, acceptă singur moștenirea lăsată de unchiul său, care include un apartament și datorii în valoare de 15.000 lei. Părinții lui David nu au fost consultați și descoperă acceptarea după închiderea termenului de renunțare. Aceștia solicită anularea acceptării.',
        'Este valabilă acceptarea moștenirii de către David?',
        '2025-10-26 12:49:34.968277+00',
        NOW()
    ),
    -- Caz 18: Contractul de antrepriză (CIV1AOO)
    (
        gen_random_uuid(),
        'Contractul de antrepriză',
        'CIV1AOO',
        TRUE,
        'Mediu',
        3,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea contractului de antrepriză încheiat de un minor cu capacitate de exercițiu restrânsă în legătură cu activitățile sale artistice.',
        'Laura, în vârstă de 17 ani, dansatoare talentată, încheie un contract cu o școală de dans pentru a preda ore de dans contemporan copiilor, primind 1.500 lei lunar. Mama Laurei consideră că fata sa a încheiat singură un contract important fără consultarea ei.',
        'Este valabil contractul de antrepriză încheiat de Laura?',
        '2025-10-26 12:49:34.968283+00',
        NOW()
    ),
    -- Caz 19: Cumpărarea de echipament sportiv (CIV1APO)
    (
        gen_random_uuid(),
        'Cumpărarea de echipament sportiv',
        'CIV1APO',
        TRUE,
        'Mediu',
        4,
        'Persoana fizică (Capacitatea de exercițiu)',
        'Validitatea contractului de vânzare-cumpărare încheiat de un minor cu capacitate de exercițiu restrânsă pentru un bun necesar activităților sale.',
        'Matei, în vârstă de 16 ani, fotbalist la o echipă locală, cumpără echipament sportiv profesional în valoare de 1.800 lei, necesar pentru antrenamente. Tatăl lui Matei consideră suma exagerată și solicită anularea contractului.',
        'Este valabil contractul de vânzare-cumpărare încheiat de Matei?',
        '2025-10-26 12:49:34.968292+00',
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
    'CIV1AAO', 'CIV1ABO', 'CIV1ACO', 'CIV1ADO',
    'CIV1AEO', 'CIV1AFO', 'CIV1AGO', 'CIV1AHO',
    'CIV1AIO', 'CIV1AJO', 'CIV1AKO', 'CIV1ALO',
    'CIV1AMO', 'CIV1ANO', 'CIV1AOO', 'CIV1APO'
)
ORDER BY case_code;
