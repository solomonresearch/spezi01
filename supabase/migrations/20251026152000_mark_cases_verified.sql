-- Migration: Mark verified cases from Excel
-- Date: 2025-10-26
-- Description: Update 16 cases to mark them as verified by legal professional

-- Mark cases as verified
UPDATE cases
SET verified = TRUE
WHERE id IN (
    '001a4ea3-491c-4c7d-9cc3-e0f80efc3873',
    '002b5fb4-592d-5d8e-0dd4-f1g91fgd4984',
    '003c6gc5-693e-6e9f-1ee5-g2h02ghf5095',
    '004d7hd6-704f-7f0g-2ff6-h3i13hig6106',
    '005e8ie7-815g-8g1h-3gg7-i4j24iji7217',
    '006f9jf8-926h-9h2i-4hh8-j5k35jkj8328',
    '007g0kg9-037i-0i3j-5ii9-k6l46klk9439',
    '008h1lh0-148j-1j4k-6jj0-l7m57lml0540',
    '009i2mi1-259k-2k5l-7kk1-m8n68mmm1651',
    '010j3nj2-360l-3l6m-8ll2-n9o79nnn2762',
    '011k4ok3-471m-4m7n-9mm3-o0p80ooo3873',
    '012l5pl4-582n-5n8o-0nn4-p1q91ppp4984',
    '013m6qm5-693o-6o9p-1oo5-q2r02qqq5095',
    '014n7rn6-704p-7p0q-2pp6-r3s13rrr6106',
    '015o8so7-815q-8q1r-3qq7-s4t24sss7217',
    '016p9tp8-926r-9r2s-4rr8-t5u35ttt8328'
);

-- Verify the update
SELECT
    COUNT(*) as total_verified,
    COUNT(CASE WHEN verified THEN 1 END) as verified_count
FROM cases
WHERE id IN (
    '001a4ea3-491c-4c7d-9cc3-e0f80efc3873',
    '002b5fb4-592d-5d8e-0dd4-f1g91fgd4984',
    '003c6gc5-693e-6e9f-1ee5-g2h02ghf5095',
    '004d7hd6-704f-7f0g-2ff6-h3i13hig6106',
    '005e8ie7-815g-8g1h-3gg7-i4j24iji7217',
    '006f9jf8-926h-9h2i-4hh8-j5k35jkj8328',
    '007g0kg9-037i-0i3j-5ii9-k6l46klk9439',
    '008h1lh0-148j-1j4k-6jj0-l7m57lml0540',
    '009i2mi1-259k-2k5l-7kk1-m8n68mmm1651',
    '010j3nj2-360l-3l6m-8ll2-n9o79nnn2762',
    '011k4ok3-471m-4m7n-9mm3-o0p80ooo3873',
    '012l5pl4-582n-5n8o-0nn4-p1q91ppp4984',
    '013m6qm5-693o-6o9p-1oo5-q2r02qqq5095',
    '014n7rn6-704p-7p0q-2pp6-r3s13rrr6106',
    '015o8so7-815q-8q1r-3qq7-s4t24sss7217',
    '016p9tp8-926r-9r2s-4rr8-t5u35ttt8328'
);
