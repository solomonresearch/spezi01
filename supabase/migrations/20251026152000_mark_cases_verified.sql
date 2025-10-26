-- Migration: Mark verified cases from Excel
-- Date: 2025-10-26
-- Description: Update 16 cases to mark them as verified by legal professional
-- Note: Using case_code instead of ID since Excel had invalid UUID values

-- Mark cases as verified by case_code
UPDATE cases
SET verified = TRUE
WHERE case_code IN (
    'CIV1AAO',  -- Caz 4: Vânzarea unui laptop
    'CIV1ABO',  -- Caz 5: Contractul de prestări servicii
    'CIV1ACO',  -- Caz 6: Donația acceptată de minor
    'CIV1ADO',  -- Caz 7: Închirierea unui imobil de către tutore
    'CIV1AEO',  -- Caz 8: Cumpărarea unui telefon de către minor
    'CIV1AFO',  -- Caz 9: Vânzarea unui tablou de către minor
    'CIV1AGO',  -- Caz 10: Contractul de reparații auto
    'CIV1AHO',  -- Caz 11: Împrumutul acordat de minor
    'CIV1AIO',  -- Caz 12: Schimbul de bunuri între minori
    'CIV1AJO',  -- Caz 13: Vânzarea de produse handmade
    'CIV1AKO',  -- Caz 14: Contractul de comodat
    'CIV1ALO',  -- Caz 15: Achiziția de cursuri online
    'CIV1AMO',  -- Caz 16: Vânzarea unui instrument muzical
    'CIV1ANO',  -- Caz 17: Acceptarea moștenirii de către minor
    'CIV1AOO',  -- Caz 18: Contractul de antrepriză
    'CIV1APO'   -- Caz 19: Cumpărarea de echipament sportiv
);

-- Verify the update
SELECT
    case_code,
    title,
    verified
FROM cases
WHERE case_code IN (
    'CIV1AAO', 'CIV1ABO', 'CIV1ACO', 'CIV1ADO',
    'CIV1AEO', 'CIV1AFO', 'CIV1AGO', 'CIV1AHO',
    'CIV1AIO', 'CIV1AJO', 'CIV1AKO', 'CIV1ALO',
    'CIV1AMO', 'CIV1ANO', 'CIV1AOO', 'CIV1APO'
)
ORDER BY case_code;
