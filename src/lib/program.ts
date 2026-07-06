// Az Okoskonyhája tagság és Kardos Bálint hitelességi adatai.
// A tagság egyetlen termék: havidíjas fizetős közösség a Circle.so-n.
// Az árazás/tartalom-lista pontos adatait Bálint tölti ki indulás előtt.

export const USP = 'Főzz finomabbat és egészségesebbet — olcsóbban és gyorsabban';

export const BIO_STATS = [
  { value: '2020', label: 'óta szervezek vacsorapartikat és gasztroeseményeket' },
  { value: '60+', label: 'esemény, 4 országban' },
  { value: '1000+', label: 'vendég az asztaloknál' },
  { value: '5+ év', label: 'szakácstapasztalat + táplálkozási tanácsadói végzettség' },
];

export const BIO_FACTS = [
  '12 fős, 5 fogásos lakásvacsoráktól a 30 fős, 7 fogásos jótékonysági gálákig',
  'Főztem 80–100 fős esküvőkön',
  '9 hónapig dolgoztam egy budai család privát séfjeként',
  'Vezettem egy növényi alapú konyhát fesztiválokon',
];

export const METHOD_PILLARS = [
  {
    title: 'A főzés 4 eleme',
    subtitle: 'Só, zsír, sav, hő',
    text: 'Ha ezt a négyet érted, bármilyen receptet a magadévá tudsz tenni — nem kell többé vakon követned senki utasítását.',
  },
  {
    title: 'A tányér-elv',
    subtitle: '45% zöldség/gyümölcs, 25% gabona, 25% hüvelyes, 5% olajos mag',
    text: 'Egy egyszerű arányrendszer, amivel minden tányérod tápanyagban teljes és jóllakató lesz — receptek nélkül is.',
  },
  {
    title: 'Batch cooking',
    subtitle: 'Heti 2 főzés, egész heti jó kaja',
    text: 'Vasárnap 2-3 órát főzöl, és egész héten van kéznél friss, házi kaja — káoszmentesen, kajapánik nélkül.',
  },
  {
    title: 'Okos bevásárlás',
    subtitle: 'Szezonális, helyi alapanyagok olcsóbban',
    text: 'Megtanulod, hol és mikor éri meg vásárolni, hogy jobb alapanyag kerüljön az asztalodra kevesebb pénzért.',
  },
];

// Mit kapsz az Okoskonyhája taggal — az eredeti brief alapján.
export const MEMBERSHIP_BENEFITS = [
  { icon: 'leaf', title: 'Heti receptek és menütervek', text: 'Gyors, olcsó, tápláló növényi fogások — minden héten frissülő anyagokkal.' },
  { icon: 'video', title: 'Havi élő főzős alkalom', text: 'Együtt főzünk videóhívásban, kérdezhetsz, próbálhatsz új technikákat.' },
  { icon: 'chat', title: 'Zárt közösség', text: 'Kérdezz bátran, oszd meg a saját sikereidet és kudarcaidat is — ítélkezés nélkül.' },
  { icon: 'calendar', title: 'Havi kihívások', text: 'Konkrét, apró lépésekre bontott kihívások, amik tényleg végigvihetők.' },
  { icon: 'gift', title: 'Korai hozzáférés', text: 'Elsőként értesülsz a jótékonysági vacsorákról és privát eseményekről.' },
  { icon: 'book', title: 'Receptarchívum', text: 'Minden korábbi recept és élő alkalom felvétele egy helyen, bármikor visszanézhető.' },
] as const;

// TODO: cseréld le a tényleges havi- (és ha van, éves-) díjra indulás előtt.
export const PRICING = {
  programName: 'Okoskonyhája tagság',
  monthly: { price: '[ÁR] Ft', period: '/ hó' },
  annual: { price: '[ÁR] Ft', period: '/ hó, éves számlázással' },
  priceNote: 'A pontos árat és az esetleges éves kedvezményt Bálint tölti ki indulás előtt.',
};
