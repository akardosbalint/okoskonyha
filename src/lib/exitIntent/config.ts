// Exit intent popup — copy variánsok és típusok.
//
// A cél sosem a "ne menj el!" pánik, hanem egy valódi ajánlat az utolsó pillanatban:
// egy útmutató, egy recept, egy belépő a közösségbe. Minden variáció reciprocity / curiosity /
// value-first elvre épül, FOMO és fake urgency nélkül — lásd a brief "konverziós pszichológia"
// szakaszát. Az itt szereplő 10 variáció közül a <ExitIntentPopup variant="..."> prop választ,
// vagy a title/description/cta propokkal felül lehet írni egyedi szöveget bármelyik oldalon.

export type ExitIntentGoal = 'newsletter' | 'leadmagnet' | 'minicourse';

export interface ExitIntentCopy {
  /** Rövid, kézzel írt hangulatú felvezető a script betűtípussal (opcionális). */
  eyebrow?: string;
  title: string;
  description: string;
  cta: string;
}

export type ExitIntentVariant =
  | 'five-day-system'
  | 'gratitude'
  | 'weekly-recipe'
  | 'reciprocity'
  | 'curiosity'
  | 'value-first'
  | 'clarity'
  | 'trust'
  | 'community'
  | 'respect-time';

export const EXIT_INTENT_COPY: Record<ExitIntentVariant, ExitIntentCopy> = {
  'five-day-system': {
    title: 'Mielőtt elmész — egy gyors dolog, ami ma este segít',
    description:
      'Nem hírlevélre iratkozol fel. 5 emailben megmutatjuk, miért nem a recept a megoldás a napi vacsora-döntésre — hanem egy rendszer, amivel heti max. 2×2 óra alatt megoldva az egész heti étkezésed. Az első tippet (amit ma este már használhatsz) azonnal küldjük.',
    cta: 'Kérem az első tippet',
  },
  gratitude: {
    title: 'Már ennyi időt rászántál',
    description: 'Hadd adjak érte cserébe valamit — egy rövid, tényleg hasznos anyagot, nem egy újabb kötelező olvasmányt.',
    cta: 'Elfogadom az ajándékot',
  },
  'weekly-recipe': {
    title: 'Ne maradj le a következő receptről',
    description: 'Heti egy valóban hasznos e-mail — új recept, praktikus tipp. Semmi spam, ígérem.',
    cta: 'Feliratkozom',
  },
  reciprocity: {
    title: 'Egy apró ajándék, mielőtt továbblépnél',
    description: 'Egy 5 perces olvasmány, ami hetekre megkönnyíti a heti menütervezést.',
    cta: 'Kérem az anyagot',
  },
  curiosity: {
    title: 'Van egy módszerem, amit ritkán osztok meg',
    description: 'Leírtam, hogyan főzök heti két alkalommal az egész hétre. Megmutatom, hogyan csinálom.',
    cta: 'Megnézem',
  },
  'value-first': {
    title: 'Mielőtt továbblépnél',
    description: 'Küldök egy rövid összefoglalót azokról a konyhai trükkökről, amik nálam a legjobban beváltak.',
    cta: 'Kérem az összefoglalót',
  },
  clarity: {
    title: 'Csak egy dolgot kérnék',
    description: 'Add meg az e-mail címed, és elküldöm az útmutatót. Ennyi — se trükk, se apró betűs rész.',
    cta: 'Küldjétek el',
  },
  trust: {
    title: 'Ígérem, nem spamelek',
    description: 'Egyetlen hasznos e-mail hetente, amit tényleg érdemes elolvasni. Bármikor leiratkozhatsz egy kattintással.',
    cta: 'Rendben, feliratkozom',
  },
  community: {
    title: 'Csatlakozz azokhoz, akik már egyszerűbben főznek',
    description: 'Iratkozz fel, és elküldöm az első lépéseket egy nyugodtabb heti menütervezéshez.',
    cta: 'Csatlakozom',
  },
  'respect-time': {
    eyebrow: 'Mielőtt elmész',
    title: 'Tudom, hogy értékes az időd',
    description: 'Ezért csak egyszer kérdezem meg: kéred a heti tervezős útmutatót, ami neked is bevált időt spórol?',
    cta: 'Igen, kérem',
  },
};

export const DEFAULT_EXIT_INTENT_VARIANT: ExitIntentVariant = 'five-day-system';

// Belső, sitewide gate-kulcs — szándékosan nem variánsonként elkülönített, hogy egy copy-teszt
// (a `variant` prop cseréje) ne nullázza le a már elutasított látogatók cooldown-ját. Ha valakinek
// tényleg elkülönített kohorszra van szüksége A/B teszthez, a `storageKey` prop felülírható.
export const DEFAULT_EXIT_INTENT_STORAGE_KEY = 'popup';

export const EXIT_INTENT_DEFAULTS = {
  delay: 4000,
  cooldownDays: 30,
  mobileEnabled: true,
  mobileInactivityMs: 45_000,
  goal: 'newsletter' as ExitIntentGoal,
};
