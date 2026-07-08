export const SITE = {
  name: 'Kardos Bálint',
  tagline: 'Főzz finomabbat és egészségesebbet — olcsóbban és gyorsabban',
  description:
    'Az Okoskonyha zárt közösséggel megtanulsz olcsóbban, gyorsabban, finomabbat és egészségesebbet főzni — heti max. 2 főzéssel, káoszmentesen. Kardos Bálint séf és életmód-tanácsadó közössége.',
  url: 'https://akardosbalint.hu',
  circleUrl: 'https://okoskonyha.akardosbalint.hu',
  // Az Okoskonyha alaptagság közvetlen előfizetési (checkout) linkje a Circle.so-n —
  // minden "Csatlakozom" jellegű CTA ide vezet, a circleUrl a közösség általános
  // (nem konkrét vásárlási szándékú) megemlítéseihez való.
  checkoutUrl: 'https://okoskonyha.akardosbalint.hu/checkout/okoskonyha-alaptagsag',
  email: 'hello@akardosbalint.hu',
  instagram: 'https://instagram.com/akardosbalint',
  facebook: 'https://facebook.com/akardosbalint',
  // A kapcsolatfelvételi űrlap mailto: linket nyit meg (lásd ContactForm.astro), nincs szüksége endpointra.
  // A hírlevél-feliratkozás egy Vercel szerverless API route-on (src/pages/api/newsletter.ts) keresztül
  // köti be a MailerLite-ot — a API-kulcs csak szerveroldali környezeti változóként (MAILERLITE_API_KEY)
  // él, sosem kerül a böngészőbe.
  newsletterEndpoint: '/api/newsletter',
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
