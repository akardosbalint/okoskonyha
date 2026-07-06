export const SITE = {
  name: 'Kardos Bálint',
  tagline: 'Főzz finomabbat és egészségesebbet — olcsóbban és gyorsabban',
  description:
    'Az Okoskonyha fizetős közösséggel megtanulsz olcsóbban, gyorsabban, finomabbat és egészségesebbet főzni — heti max. 2 főzéssel, káoszmentesen. Kardos Bálint séf és életmód-tanácsadó közössége.',
  url: 'https://akardosbalint.hu',
  circleUrl: 'https://okoskonyha.akardosbalint.hu',
  email: 'hello@akardosbalint.hu',
  instagram: 'https://instagram.com/akardosbalint',
  facebook: 'https://facebook.com/akardosbalint',
  calendlyUrl: 'https://calendly.com/akardosbalint/konzultacio',
  // TODO: kösd be a választott form-backendet (pl. Formspree, ConvertKit, Resend, Netlify Forms).
  // Amíg üres, a form JS-e egy barátságos hibaüzenetet mutat submit helyett.
  newsletterEndpoint: '',
  contactEndpoint: '',
};

// Az oldal üzemeltetőjének (Adatkezelő) hivatalos adatai — az Adatvédelmi tájékoztatóban
// és az ÁSZF-ben használjuk, hogy egy helyen legyenek karbantarthatók.
export const COMPANY = {
  legalName: 'Kardos Bálint e.v.',
  city: 'Budapest',
  addressLine: 'Bem József utca 6. fsz. 3.',
  postalCode: '1027',
  country: 'Magyarország',
  taxNumber: '91637778-1-41',
  registrationNumber: '61623820',
};

export const NAV = [
  { href: '/', label: 'Főoldal' },
  { href: '/okoskonyha/', label: 'Okoskonyha', highlight: true },
  { href: '/blog/', label: 'Blog' },
  { href: '/szolgaltatasok/', label: 'Szolgáltatások' },
  { href: '/rolam/', label: 'Rólam' },
  { href: '/jotekonysag/', label: 'Jótékonyság' },
  { href: '/kapcsolat/', label: 'Kapcsolat' },
];

export const FOOTER_LINKS = [
  { href: '/adatvedelem/', label: 'Adatvédelmi tájékoztató' },
  { href: '/aszf/', label: 'ÁSZF' },
];

export const BLOG_CATEGORIES: Record<string, { label: string; description: string }> = {
  sztorik: {
    label: 'Sztorik',
    description: 'Igaz történetek vacsorapartikról, idegenekből lett barátokról és félresikerült fogásokról.',
  },
  'fozesi-tippek': {
    label: 'Főzési tippek',
    description: 'Gyors, olcsó és egészséges növényi fogások — gyakorlati tanácsok kezdőknek is.',
  },
  jotekonysag: {
    label: 'Jótékonyság',
    description: 'Jótékonysági vacsorák, partnerszervezetek és a mögöttük álló ügyek.',
  },
};
