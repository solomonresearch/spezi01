// Romanian Universities Data
// Used for signup form dropdown

export interface University {
  category: 'Public' | 'Private' | 'Other';
  code: string;
  name: string;
}

export const universities: University[] = [
  // Public Universities
  { category: 'Public', code: 'UB', name: 'Universitatea din București' },
  { category: 'Public', code: 'UBB', name: 'Universitatea Babeș-Bolyai (Cluj-Napoca)' },
  { category: 'Public', code: 'UAIC', name: 'Universitatea "Alexandru Ioan Cuza" (Iași)' },
  { category: 'Public', code: 'UVT', name: 'Universitatea de Vest din Timișoara' },
  { category: 'Public', code: 'ULBS', name: 'Universitatea "Lucian Blaga" (Sibiu)' },
  { category: 'Public', code: 'UCV', name: 'Universitatea din Craiova' },
  { category: 'Public', code: 'UTBv', name: 'Universitatea Transilvania (Brașov)' },
  { category: 'Public', code: 'UO', name: 'Universitatea din Oradea' },
  { category: 'Public', code: 'UDJG', name: 'Universitatea "Dunărea de Jos" (Galați)' },
  { category: 'Public', code: 'UAB', name: 'Universitatea "1 Decembrie 1918" (Alba Iulia)' },
  { category: 'Public', code: 'UTgJ', name: 'Universitatea "Constantin Brâncuși" (Târgu Jiu)' },
  { category: 'Public', code: 'UPIT', name: 'Universitatea din Pitești' },
  { category: 'Public', code: 'UOC', name: 'Universitatea "Ovidius" (Constanța)' },
  { category: 'Public', code: 'USV', name: 'Universitatea "Ștefan cel Mare" (Suceava)' },
  { category: 'Public', code: 'UVTg', name: 'Universitatea "Valahia" (Târgoviște)' },
  { category: 'Public', code: 'APAIC', name: 'Academia de Poliție "Alexandru Ioan Cuza" (București)' },

  // Private Universities
  { category: 'Private', code: 'UNT', name: 'Universitatea "Nicolae Titulescu" (București)' },
  { category: 'Private', code: 'UTM', name: 'Universitatea "Titu Maiorescu" (București)' },
  { category: 'Private', code: 'UCDC', name: 'Universitatea Creștină "Dimitrie Cantemir" (București)' },
  { category: 'Private', code: 'URA', name: 'Universitatea Româno-Americană (București)' },
  { category: 'Private', code: 'USH', name: 'Universitatea "Spiru Haret" (București)' },
  { category: 'Private', code: 'UHD', name: 'Universitatea "Hyperion" (București)' },
  { category: 'Private', code: 'UEB', name: 'Universitatea Ecologică din București' },
  { category: 'Private', code: 'UAS', name: 'Universitatea "Andrei Șaguna" (Constanța)' },
  { category: 'Private', code: 'UDG', name: 'Universitatea "Danubius" (Galați)' },
  { category: 'Private', code: 'UAG', name: 'Universitatea "Agora" (Oradea)' },
  { category: 'Private', code: 'UCBv', name: 'Universitatea "Constantin Brâncoveanu" (Pitești/Brăila/Râmnicu Vâlcea)' },
  { category: 'Private', code: 'UCDCTgM', name: 'Universitatea Creștină "Dimitrie Cantemir" (Târgu Mureș)' },
  { category: 'Private', code: 'UVVG', name: 'Universitatea de Vest "Vasile Goldiș" (Arad)' },
  { category: 'Private', code: 'UBV', name: 'Universitatea "Bogdan Vodă" (Cluj-Napoca)' },

  // Other
  { category: 'Other', code: 'Other', name: 'Other (Please Specify)' }
];

// Group universities by category for organized dropdown
export const universitiesByCategory = {
  Public: universities.filter(u => u.category === 'Public'),
  Private: universities.filter(u => u.category === 'Private'),
  Other: universities.filter(u => u.category === 'Other')
};
