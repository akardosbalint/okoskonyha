// Exit intent popup — copy variánsok és típusok.
//
// A cél sosem a "ne menj el!" pánik, hanem egy valódi ajánlat az utolsó pillanatban. A tényleges
// lead magnet EGYETLEN dolog: az 5 részes email-sorozat (3 email a módszer alapjairól — só-zsír-
// sav-hő, tányér-elv, batch cooking —, 2 email arról, hogyan lehet csatlakozni az Okoskonyhához).
// A 10 variáció ugyanezt az egy ajánlatot kínálja, csak eltérő pszichológiai szemszögből
// (reciprocity / curiosity / value-first / community / stb., FOMO és fake urgency nélkül) — egyik
// sem ígér ettől eltérő tartalmat, hogy a feliratkozó ténylegesen azt kapja, amit az adott
// variáció alapján várt. Az <ExitIntentPopup variant="..."> prop választ közülük, vagy a
// title/description/cta propokkal bármelyik oldalon felül lehet írni egyedi szöveget.

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
  | 'credibility'
  | 'tonight'
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
      'Nem hírlevélre iratkozol fel. 5 emailben megmutatom, miért nem a recept a megoldás a napi vacsora-döntésre — hanem egy rendszer. Az első tippet, amit ma este már használhatsz, azonnal küldöm.',
    cta: 'Kérem az első tippet',
  },
  credibility: {
    title: '1200+ vendég ismerte már meg ezt élőben',
    description: '5 emailben ugyanazt mutatom meg neked, amit nekik főzés közben szoktam — ingyen, kötelezettség nélkül.',
    cta: 'Kérem én is',
  },
  tonight: {
    title: 'Ami ma este segít a vacsora-döntésben',
    description: 'Az első email ma megérkezik, a többi 4 napon át követi — mire vége, rendszerré áll össze.',
    cta: 'Küldjétek az elsőt',
  },
  reciprocity: {
    title: 'Adok, mielőtt bármit kérnék',
    description: '5 emailben odaadom a rendszer 3 legfontosabb alapelvét — ingyen, mielőtt cserébe bármit kérnék.',
    cta: 'Kérem az első emailt',
  },
  curiosity: {
    title: 'Van egy módszerem a heti vacsora-döntésekre',
    description: '5 rövid emailben megmutatom, hogyan oldom meg heti max. 2×2 óra alatt az egész heti étkezésem — séf-fejjel, nem receptekkel.',
    cta: 'Megmutatod?',
  },
  'value-first': {
    title: 'Mielőtt továbblépnél, kapsz valamit',
    description: '3 email a módszer alapjairól, 2 arról, hogyan csatlakozhatsz — mind ingyen, mind azonnal induló.',
    cta: 'Kérem az anyagot',
  },
  clarity: {
    title: 'Csak egy dolgot kérnék',
    description: 'Add meg az e-mail címed, és elindítom az 5 részes sorozatot. Ennyi — se trükk, se apró betűs rész.',
    cta: 'Küldjétek el',
  },
  trust: {
    title: 'Ígérem, nem spamelek',
    description: '5 email a rendszerről, utána csak alkalmi hírlevél. Bármikor leiratkozhatsz egy kattintással.',
    cta: 'Rendben, kérem',
  },
  community: {
    title: 'Csatlakozz azokhoz, akik már egyszerűbben főznek',
    description: 'Az 5 részes sorozat pont ott kezdődik, ahol te most tartasz — küldöm az első lépést.',
    cta: 'Csatlakozom',
  },
  'respect-time': {
    eyebrow: 'Mielőtt elmész',
    title: 'Tudom, hogy értékes az időd',
    description: 'Ezért csak 5 rövid emailt kérek a figyelmedből — utána eldöntheted, kell-e még.',
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
