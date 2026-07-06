// Egyszerű, saját fejlesztésű süti-hozzájárulás kezelő — nincs külső könyvtár.
// A választást localStorage-ban tároljuk, és eseményt küldünk, hogy más szkriptek
// (pl. analitika, Calendly-beágyazás) reagálhassanak rá.

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

export const CONSENT_STORAGE_KEY = 'okoskonyha-cookie-consent';
export const CONSENT_CHANGE_EVENT = 'cookieconsentchange';
export const OPEN_SETTINGS_EVENT = 'cookiesettingsopen';

export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics === 'boolean' && typeof parsed?.marketing === 'boolean') {
      return { necessary: true, analytics: parsed.analytics, marketing: parsed.marketing, decidedAt: parsed.decidedAt };
    }
    return null;
  } catch {
    return null;
  }
}

export function setConsent(partial: { analytics: boolean; marketing: boolean }) {
  if (typeof window === 'undefined') return;
  const state: ConsentState = { necessary: true, ...partial, decidedAt: new Date().toISOString() };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  document.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: state }));
  return state;
}

export function hasConsent(category: 'analytics' | 'marketing'): boolean {
  return getConsent()?.[category] === true;
}
