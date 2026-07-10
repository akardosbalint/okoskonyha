# Infrastruktúra és harmadik féltől való függőségek

Ez a dokumentum azt írja le, mely külső szolgáltatásokra épül az oldal, mit csinálnak, és mi
történik, ha valamelyik leáll vagy megszünteti a szolgáltatást. Nem kód, hanem üzemeltetési
tudás — akkor érdemes átfutni rajta, ha bármelyik szolgáltatónál probléma van, vagy ha
váltást fontolgatsz.

## 1. Circle.so — tagság-kezelés és fizetés

**Mit csinál:** a teljes Okoskonyha-tagság (előfizetés, fizetés, zárt közösségi tartalom) itt
fut, nem a saját weboldalon. Minden „Csatlakozom” gomb a `SITE.checkoutUrl`-on
(`okoskonyha.akardosbalint.hu/checkout/okoskonyha-alaptagsag`) keresztül ide vezet.

**Ha leáll vagy elérhetetlen:**
- Az összes vásárlási útvonal (checkout gombok, árazás) megszakad — ez a legnagyobb egypontú
  bevételi kockázat az oldalon.
- A meglévő tagok sem érik el a zárt tartalmat, amíg a szolgáltatás vissza nem áll.
- A weboldal saját maga (statikus oldalak, blog) tovább működik — ez a rész Vercelen fut,
  független a Circle.so állapotától.

**Ha váltást fontolgatsz:** a `SITE.checkoutUrl` és `SITE.circleUrl` a `src/lib/site.ts`
fájlban egy helyen van — egy migráció esetén ott kell módosítani, minden CTA-gomb és a
strukturált adat (JSON-LD `Offer`) automatikusan követi.

## 2. MailerLite — hírlevél-feliratkozás

**Mit csinál:** a hírlevél-feliratkozási űrlap a `/api/newsletter` Vercel szerverless
függvényen (`src/pages/api/newsletter.ts`) keresztül köti be a MailerLite API-t. Az API-kulcs
(`MAILERLITE_API_KEY`) kizárólag szerveroldali környezeti változó, sosem kerül a böngészőbe.

Minden feliratkozás (hírlevél CTA-k, exit popup) a `MAILERLITE_LEAD_GROUP_ID` környezeti
változóban megadott "Okoskonyha Lead" MailerLite csoporthoz adja hozzá a feliratkozót — ez a
csoportba kerülés indítja el a MailerLite-ban erre a triggerre beállított automatizált 5 napos
levélsorozatot. Ha ez a környezeti változó nincs beállítva, a feliratkozó group nélkül kerül be
(az automatizáció nem indul el érte).

**Ha leáll vagy elérhetetlen:** a hírlevél-feliratkozás nem működik, de ez nem blokkolja a
fő bevételi útvonalat (Okoskonyha tagság) — csak a lead-gyűjtés egyik csatornája esik ki
ideiglenesen. Az űrlap grafikusan látszik, a beküldés hibaüzenetet ad.

## 3. Vercel — hosting és szerverless függvények

**Mit csinál:** a teljes statikus oldal (minden build-időben előre renderelt oldal) itt fut,
plusz a `/api/newsletter` szerverless függvény. A `vercel.json` tartalmazza a biztonsági
fejléceket (CSP, HSTS stb.) és az átirányításokat.

**Ha leáll:** a teljes weboldal elérhetetlen — ez a legmagasabb blast-radius függőség, de
egyben a legmegbízhatóbb is (nagy, SLA-val rendelkező platform), és a build maga bármikor
átvihető más statikus hostingra (Netlify, Cloudflare Pages stb.) az Astro-adapter cseréjével.

## 4. Google Tag Manager / Google Analytics 4

**Mit csinál:** a GTM-konténer (`GTM-W738PN86`) tartalmazza a GA4-konfigurációs taget
(`G-GGLX09K1VG`). Csak akkor töltődik be, ha a látogató elfogadta az analitikai sütiket
(lásd `src/lib/cookieConsent.ts`).

**Ha leáll:** a mérés (konverziók, forgalom) kiesik, de a weboldal funkcionálisan tovább
működik — nincs vásárlási/UX hatás, csak adatvesztés a mérési időszakra.

## Összefoglaló kockázati sorrend

1. **Circle.so** — legnagyobb bevételi kockázat (egyetlen fizetési csatorna).
2. **Vercel** — legnagyobb blast radius, de legmegbízhatóbb platform, és cserélhető.
3. **MailerLite** — alacsony kockázat, másodlagos lead-csatorna.
4. **GTM/GA4** — nincs funkcionális kockázat, csak mérési kiesés.

Egyik függőség sincs jelenleg redundánsan kiváltva (nincs másodlagos fizetési út, nincs
másodlagos hosting) — ez tudatos, korai szakaszban ésszerű döntés (gyors piacra lépés,
alacsony üzemeltetési komplexitás egyszemélyes vállalkozásként), de érdemes tudni, hogy ez
a jelenlegi architektúra kompromisszuma, nem véletlen hiányosság.
