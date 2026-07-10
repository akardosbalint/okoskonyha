// Egyszerű "csak X naponta egyszer" gate localStorage-ban, ugyanabban a stílusban, mint a
// src/lib/cookieConsent.ts. Egyetlen időbélyeget tárolunk kulcsonként — ha a bélyeg fiatalabb,
// mint a cooldown, a popup meg sem próbál feliratkozni semmilyen trigger-eseményre (lásd
// controller.ts), így a már elutasított látogatóknak nulla futásidejű költsége van.

const STORAGE_PREFIX = 'okoskonyha-exit-intent';

export function hasBeenShownRecently(key: string, cooldownDays: number): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    if (!raw) return false;
    const shownAt = Number(raw);
    if (!Number.isFinite(shownAt)) return false;
    return Date.now() - shownAt < cooldownDays * 24 * 60 * 60 * 1000;
  } catch {
    // localStorage elérhetetlen (privát böngészés, kvóta) — inkább mutassuk meg újra,
    // mint hogy soha ne jelenjen meg egyetlen látogatónak sem.
    return false;
  }
}

export function markShown(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}:${key}`, String(Date.now()));
  } catch {
    // Ugyanaz mint fent — ha nem tudjuk elmenteni, legfeljebb újra megjelenik. Nem kritikus.
  }
}

// Aki már feliratkozott, azt ne kérdezzük meg újra a cooldown lejárta után sem — ez a jelzés
// nem évül el, szemben a fenti "megjelent már" bélyeggel.
export function hasConverted(key: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(`${STORAGE_PREFIX}:${key}:converted`) === '1';
  } catch {
    return false;
  }
}

export function markConverted(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}:${key}:converted`, '1');
  } catch {
    // no-op — l. fent
  }
}
