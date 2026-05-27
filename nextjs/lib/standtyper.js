// Alle standtyper fra Engestofte Gods' ansøgningsskema
// Pris er i DKK ekskl. moms
export const STANDTYPER = [
  {
    id: 'A',
    navn: 'Udendørsstand',
    lokation: 'Udendørs',
    storrelse: '3×4 m',
    elektricitet: false,
    sider: null,
    pris: 985,
    beskrivelse: 'Udendørsstand uden elektricitet. Løbende m² +300 kr. Elektricitet kan tilkøbes via Lise.',
  },
  {
    id: 'B',
    navn: 'Langside',
    lokation: 'Kostalden',
    storrelse: '3×3 m',
    elektricitet: true,
    sider: '1 side mod publikum',
    pris: 1685,
    beskrivelse: 'Indendørs langside i Kostalden med 220V elektricitet.',
  },
  {
    id: 'C',
    navn: 'Centerstand',
    lokation: 'Kostalden',
    storrelse: '3×3 m',
    elektricitet: true,
    sider: '2 sider mod publikum',
    pris: 1895,
    beskrivelse: 'Indendørs centerstand i Kostalden med 220V elektricitet og to sider mod publikum.',
  },
  {
    id: 'D',
    navn: 'Hestestalden',
    lokation: 'Hestestalden',
    storrelse: '3,3×3,3 m',
    elektricitet: true,
    sider: null,
    pris: 1635,
    beskrivelse: 'Indendørs stand i Hestestalden med 220V elektricitet.',
  },
  {
    id: 'E',
    navn: 'Langside',
    lokation: 'Laden',
    storrelse: '3×2,5 m',
    elektricitet: true,
    sider: '1 side mod publikum',
    pris: 1695,
    beskrivelse: 'Indendørs langside i Laden med 220V elektricitet.',
  },
  {
    id: 'F',
    navn: 'Centerstand',
    lokation: 'Laden',
    storrelse: '3×2,5 m',
    elektricitet: true,
    sider: '1 side mod publikum',
    pris: 1775,
    beskrivelse: 'Indendørs centerstand i Laden med 220V elektricitet.',
  },
  {
    id: 'G',
    navn: 'Hjørnestand',
    lokation: 'Laden',
    storrelse: '3×2,5 m',
    elektricitet: true,
    sider: '2 sider mod publikum',
    pris: 1995,
    beskrivelse: 'Indendørs hjørnestand i Laden med 220V elektricitet og to sider mod publikum.',
  },
  {
    id: 'H',
    navn: 'Langside',
    lokation: 'Jagtstuen',
    storrelse: '3×1,8 m',
    elektricitet: true,
    sider: null,
    pris: 1325,
    beskrivelse: 'Indendørs langside i Jagtstuen med 220V elektricitet.',
  },
];

// Priser på tillægsudstyr (ekskl. moms)
export const TILLÆG = {
  bord: { pris: 155, storrelse: '76×183 cm' },
  stol: { pris: 45 },
};

// Beregn samlet pris ekskl. moms
export function beregnPris({ stand_type, antal_borde = 0, antal_stole = 0 }) {
  const stand = STANDTYPER.find((s) => s.id === stand_type);
  if (!stand) return { standleje: 0, borde: 0, stole: 0, total: 0 };

  const standleje = stand.pris;
  const borde = antal_borde * TILLÆG.bord.pris;
  const stole = antal_stole * TILLÆG.stol.pris;

  return {
    standleje,
    borde,
    stole,
    total: standleje + borde + stole,
  };
}

// Formater et tal som dansk valuta uden decimaler
export function formatKr(beloeb) {
  return new Intl.NumberFormat('da-DK').format(beloeb) + ' kr';
}
