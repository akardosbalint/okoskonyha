// Exit intent popup — futásidejű vezérlő. Dinamikusan importálva az ExitIntentPopup.astro
// bootstrap szkriptjéből (requestIdleCallback után), hogy a kezdeti oldalbetöltést ne terhelje.
//
// A fájl kis, egy-felelősségű "hook"-szerű gyárfüggvényekre bontva (createFocusTrap,
// createScrollLock, createInertGuard, createDesktopExitIntent, createMobileExitIntent) —
// ez a keretrendszer nélküli megfelelője a React hookoknak: mindegyik saját belső állapotot
// zár le, és egy szűk start/stop vagy activate/deactivate API-t ad kifelé.

import type { ExitIntentGoal } from './config';
import { hasBeenShownRecently, hasConverted, markConverted, markShown } from './storage';

export interface ExitIntentRuntimeConfig {
  storageKey: string;
  cooldownDays: number;
  delay: number;
  mobileEnabled: boolean;
  mobileInactivityMs: number;
  goal: ExitIntentGoal;
  variant: string;
  endpoint: string;
  downloadUrl?: string;
  redirectUrl?: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function track(event: string, detail: Record<string, unknown>): void {
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...detail });
  }
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null,
  );
}

function isCookieBannerOpen(): boolean {
  const ccRoot = document.getElementById('cookie-consent');
  return !!ccRoot && !ccRoot.classList.contains('hidden');
}

function createFocusTrap(dialog: HTMLElement) {
  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable(dialog);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  return {
    activate: () => document.addEventListener('keydown', onKeydown),
    deactivate: () => document.removeEventListener('keydown', onKeydown),
  };
}

function createInertGuard(exclude: HTMLElement) {
  const affected: Element[] = [];
  return {
    apply() {
      Array.from(document.body.children).forEach((el) => {
        if (el === exclude || el instanceof HTMLScriptElement) return;
        el.setAttribute('inert', '');
        affected.push(el);
      });
    },
    release() {
      affected.forEach((el) => el.removeAttribute('inert'));
      affected.length = 0;
    },
  };
}

function createScrollLock() {
  let previousOverflow = '';
  let previousPaddingRight = '';
  return {
    lock() {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      previousOverflow = document.body.style.overflow;
      previousPaddingRight = document.body.style.paddingRight;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    },
    unlock() {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    },
  };
}

// Klasszikus desktop exit-intent: az egér a viewport teteje fölé hagyja el a dokumentumot
// (relatedTarget null => nem egy gyerek elemre lépett, hanem tényleg elhagyta az oldalt),
// jellemzően amikor valaki a tab- vagy címsor felé mozog. `delay` alatt nem fegyverezzük fel,
// hogy ne süljön el azonnal, ha valaki csak épp landolt az oldalon.
function createDesktopExitIntent(delay: number, onTrigger: () => void) {
  let armTimer: number | undefined;

  function onMouseLeave(e: MouseEvent) {
    if (e.clientY > 0 || e.relatedTarget !== null) return;
    cleanup();
    onTrigger();
  }

  function cleanup() {
    window.clearTimeout(armTimer);
    document.removeEventListener('mouseleave', onMouseLeave);
  }

  return {
    start() {
      armTimer = window.setTimeout(() => document.addEventListener('mouseleave', onMouseLeave), delay);
    },
    stop: cleanup,
  };
}

// Mobilon nincs "egér elhagyja az oldalt" esemény, ezért három, egymást kiegészítő heurisztikát
// figyelünk egyszerre — amelyik előbb jelez, az nyer:
//  1. Vissza gomb: egy extra history bejegyzést tolunk be, az első visszalépés popstate-et vált ki
//     elnavigálás helyett (a második visszalépés már natívan működik — nem csapdázzuk be a usert).
//  2. Gyors felfele-scroll a tetejére, miután a látogató már jó mélyre lement — tipikus "megyek
//     vissza a címsorhoz/tab-váltóhoz" mozdulat.
//  3. Inaktivitás egy adott mélységű engedés (scroll) után — a látogató valószínűleg letette
//     a telefont vagy elugrott máshova.
function createMobileExitIntent(options: { delay: number; inactivityMs: number }, onTrigger: () => void) {
  let armTimer: number | undefined;
  let inactivityTimer: number | undefined;
  let maxScrollY = 0;
  let lastScrollY = window.scrollY;
  let lastScrollTime = Date.now();

  function fire() {
    cleanup();
    onTrigger();
  }

  function resetInactivity() {
    window.clearTimeout(inactivityTimer);
    inactivityTimer = window.setTimeout(() => {
      if (maxScrollY > 200) fire();
    }, options.inactivityMs);
  }

  function onScroll() {
    const now = Date.now();
    const y = window.scrollY;
    maxScrollY = Math.max(maxScrollY, y);
    const dt = now - lastScrollTime;
    const dy = y - lastScrollY;
    if (dt > 0 && dt < 400 && dy < -120 && y < 80 && maxScrollY > 400) {
      fire();
      return;
    }
    lastScrollY = y;
    lastScrollTime = now;
    resetInactivity();
  }

  function onPopState() {
    fire();
  }

  function onInteraction() {
    resetInactivity();
  }

  function cleanup() {
    window.clearTimeout(armTimer);
    window.clearTimeout(inactivityTimer);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('popstate', onPopState);
    window.removeEventListener('touchstart', onInteraction);
    window.removeEventListener('pointerdown', onInteraction);
  }

  return {
    start() {
      armTimer = window.setTimeout(() => {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('touchstart', onInteraction, { passive: true });
        window.addEventListener('pointerdown', onInteraction, { passive: true });
        resetInactivity();
        history.pushState({ exitIntentGuard: true }, '', location.href);
        window.addEventListener('popstate', onPopState, { once: true });
      }, options.delay);
    },
    stop: cleanup,
  };
}

function showError(container: HTMLElement, text: string) {
  container.className = 'mt-4 rounded-xl bg-clay-50 px-4 py-3 text-sm font-medium text-clay-700';
  container.textContent = text;
}

function showSuccess(container: HTMLElement, config: ExitIntentRuntimeConfig) {
  container.className =
    'mt-4 flex items-start gap-3 rounded-2xl border-2 border-sage-300 bg-sage-50 px-5 py-4 text-forest-700';

  const checkIcon =
    '<svg class="h-6 w-6 shrink-0 text-forest-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  const ctaHref = config.goal === 'leadmagnet' ? config.downloadUrl : config.goal === 'minicourse' ? config.redirectUrl : undefined;
  const ctaLabel = config.goal === 'leadmagnet' ? 'Letöltöm most' : 'Tovább a mini kurzushoz';
  const cta = ctaHref
    ? `<a href="${ctaHref}" class="mt-2 inline-block rounded-full bg-clay-600 px-5 py-2.5 text-sm font-heading font-semibold text-cream transition-colors hover:bg-clay-700">${ctaLabel}</a>`
    : '';

  container.innerHTML = `${checkIcon}<div><p class="font-semibold">Köszönjük! Nézd meg a postaládád.</p>${cta}</div>`;
}

export function initExitIntent(root: HTMLElement, config: ExitIntentRuntimeConfig): void {
  if (hasBeenShownRecently(config.storageKey, config.cooldownDays) || hasConverted(config.storageKey)) return;

  const backdropEl = root.querySelector<HTMLElement>('[data-exit-intent-backdrop]');
  const dialogEl = root.querySelector<HTMLElement>('[data-exit-intent-dialog]');
  const closeBtn = root.querySelector<HTMLButtonElement>('[data-exit-intent-close]');
  const formEl = root.querySelector<HTMLFormElement>('[data-exit-intent-form]');
  const messageEl = root.querySelector<HTMLElement>('[data-exit-intent-message]');
  const emailInputEl = root.querySelector<HTMLInputElement>('input[type="email"]');
  if (!backdropEl || !dialogEl || !formEl || !messageEl || !emailInputEl) return;

  // Innentől a fenti öt elem garantáltan nem null — a fenti korai return biztosítja, a lenti
  // *El nevű const-ok pedig a szűkített (nem-null) típust viszik tovább a bezárt (closure)
  // beágyazott függvényekbe is, amiket TS önmagában nem tudna leszűkíteni.
  const backdrop = backdropEl;
  const dialog = dialogEl;
  const form = formEl;
  const message = messageEl;
  const emailInput = emailInputEl;

  const focusTrap = createFocusTrap(dialog);
  const inertGuard = createInertGuard(root);
  const scrollLock = createScrollLock();

  let isOpen = false;
  let lastFocused: HTMLElement | null = null;
  let closeTimer: number | undefined;
  let focusTimer: number | undefined;

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close('escape');
  }

  function onBackdropClick(e: MouseEvent) {
    if (e.target === backdrop) close('backdrop');
  }

  function open(reason: string) {
    if (isOpen) return;

    if (isCookieBannerOpen()) {
      document.addEventListener('cc:visibility', function onVisibility(e) {
        if (!(e as CustomEvent<{ visible: boolean }>).detail.visible) {
          document.removeEventListener('cc:visibility', onVisibility as EventListener);
          open(reason);
        }
      } as EventListener);
      return;
    }

    isOpen = true;
    markShown(config.storageKey);

    lastFocused = document.activeElement as HTMLElement | null;
    root.classList.remove('hidden');
    root.classList.add('flex', 'items-center', 'justify-center');
    root.setAttribute('aria-hidden', 'false');
    scrollLock.lock();
    inertGuard.apply();

    requestAnimationFrame(() => {
      backdrop.classList.remove('opacity-0');
      backdrop.classList.add('opacity-100');
      dialog.classList.remove('opacity-0', 'scale-95');
      dialog.classList.add('opacity-100', 'scale-100');
    });

    focusTrap.activate();
    document.addEventListener('keydown', onKeydown);
    backdrop.addEventListener('click', onBackdropClick);
    focusTimer = window.setTimeout(() => emailInput.focus(), 350);

    track('exit_intent_shown', { variant: config.variant, goal: config.goal, reason });
  }

  function close(reason: string) {
    if (!isOpen) return;
    isOpen = false;

    backdrop.classList.add('opacity-0');
    backdrop.classList.remove('opacity-100');
    dialog.classList.add('opacity-0', 'scale-95');
    dialog.classList.remove('opacity-100', 'scale-100');

    focusTrap.deactivate();
    document.removeEventListener('keydown', onKeydown);
    backdrop.removeEventListener('click', onBackdropClick);
    window.clearTimeout(focusTimer);

    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      root.classList.add('hidden');
      root.classList.remove('flex', 'items-center', 'justify-center');
      root.setAttribute('aria-hidden', 'true');
      scrollLock.unlock();
      inertGuard.release();
      lastFocused?.focus();
    }, 300);

    track('exit_intent_dismissed', { variant: config.variant, reason });
  }

  closeBtn?.addEventListener('click', () => close('close_button'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const honeypot = form.querySelector<HTMLInputElement>('input[name="company"]');
    if (honeypot?.value) return;

    const email = emailInput.value;
    const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!email || !submitButton) return;

    submitButton.disabled = true;
    try {
      const res = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        markConverted(config.storageKey);
        track('exit_intent_convert', { variant: config.variant, goal: config.goal });
        form.classList.add('hidden');
        showSuccess(message, config);
      } else {
        showError(message, 'Hoppá, valami elakadt. Próbáld újra kicsit később.');
      }
    } catch {
      showError(message, 'Hoppá, valami elakadt. Próbáld újra kicsit később.');
    } finally {
      submitButton.disabled = false;
    }
  });

  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (isTouchDevice) {
    if (config.mobileEnabled) {
      createMobileExitIntent({ delay: config.delay, inactivityMs: config.mobileInactivityMs }, () => open('mobile_heuristic')).start();
    }
  } else {
    createDesktopExitIntent(config.delay, () => open('desktop_mouseleave')).start();
  }
}
