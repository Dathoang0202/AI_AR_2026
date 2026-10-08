/** Display drawings based on the supplied workbook; motifs are deliberately schematic. */
export const workbookCatalog = [
  { keyword: 'vien linh', kind: 'vien-linh', color: '#365B66', gender: 'male', category: 'GARMENT' },
  { keyword: 'doi kham', kind: 'doi-kham', color: '#A47A91', gender: 'female', category: 'GARMENT' },
  { keyword: 'co man', kind: 'co-man', color: '#677D68', gender: 'male', category: 'GARMENT' },
  { keyword: 'bo tu', kind: 'bo-tu', color: '#1A365D', gender: 'male', category: 'GARMENT' },
  { keyword: 'con mien', kind: 'con-mien', color: '#292524', gender: 'male', category: 'GARMENT' },
  { keyword: 'hoang bao', kind: 'hoang-bao', color: '#D4AF37', gender: 'male', category: 'GARMENT' },
  { keyword: 'phuong bao', kind: 'phuong-bao', color: '#8D3025', gender: 'female', category: 'GARMENT' },
  { keyword: 'ao yem', kind: 'ao-yem', color: '#B95F66', gender: 'female', category: 'GARMENT' },
  { keyword: 'tran thu', kind: 'tran-thu', color: '#677D68', gender: 'male', category: 'GARMENT' },
  { keyword: 'bien phuc', kind: 'bien-phuc', color: '#403D52', gender: 'male', category: 'GARMENT' },
  { keyword: 'mang bao', kind: 'mang-bao', color: '#1E4D2B', gender: 'male', category: 'GARMENT' },
  { keyword: 'vat ho', kind: 'vat-ho', color: '#895B3F', gender: 'male', category: 'GARMENT' },
  { keyword: 'ngu lam', kind: 'ngu-lam', color: '#8D3025', gender: 'male', category: 'GARMENT' },
  { keyword: 'thu kham', kind: 'thu-kham', color: '#365B66', gender: 'male', category: 'GARMENT' },
  { keyword: 'quai thao', kind: 'quai-thao', color: '#DBC390', gender: 'female', category: 'ACCESSORY', slot: 'headwear', viewBox: '96 24 168 166' },
  { keyword: 'mo qua', kind: 'mo-qua', color: '#292524', gender: 'female', category: 'ACCESSORY', slot: 'headwear', viewBox: '138 28 84 130' },
  { keyword: 'canh chuon', kind: 'canh-chuon', color: '#292524', gender: 'male', category: 'ACCESSORY', slot: 'headwear', viewBox: '64 16 232 100' },
  { keyword: 'guoc moc', kind: 'guoc-moc', color: '#A67A4A', gender: 'female', category: 'ACCESSORY', slot: 'footwear', viewBox: '130 466 100 62' },
  { keyword: 'hai cung dinh', kind: 'hai', color: '#8D3025', gender: 'female', category: 'ACCESSORY', slot: 'footwear', viewBox: '128 462 104 62' },
  { keyword: 'dai ngoc', kind: 'dai-ngoc', color: '#79A58B', gender: 'male', category: 'ACCESSORY', slot: 'belt', viewBox: '129 236 102 58' },
  { keyword: 'kieng', kind: 'kieng', color: '#D6BE85', gender: 'female', category: 'ACCESSORY', slot: 'necklace', viewBox: '141 127 78 73' },
  { keyword: 'tram cai', kind: 'tram', color: '#D6BE85', gender: 'female', category: 'ACCESSORY', slot: 'hairpin', viewBox: '136 32 82 66' },
  { keyword: 'kim khanh', kind: 'kim-khanh', color: '#D6BE85', gender: 'male', category: 'ACCESSORY', slot: 'badge', viewBox: '145 160 70 105' },
] as const;

export function workbookVisual(normalizedName: string) {
  return workbookCatalog.find(entry => normalizedName.includes(entry.keyword));
}
