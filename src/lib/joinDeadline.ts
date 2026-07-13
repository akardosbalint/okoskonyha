import { PRICING } from './program';

export const JOIN_DEADLINE_MS = new Date(PRICING.deadlineISO).getTime();

export function msUntilJoinDeadline(): number {
  return JOIN_DEADLINE_MS - Date.now();
}

// A csatlakozás-gombokat (data-hide-after-deadline="true") rejti el, ha a látogató a
// határidő lejárta után nyitja meg az oldalt — a PricingCountdown ugyanezt hívja élőben,
// amikor a látogató szeme láttára fut le a visszaszámlálás.
export function hideExpiredJoinCtas(): void {
  if (msUntilJoinDeadline() > 0) return;
  document.querySelectorAll<HTMLElement>('[data-hide-after-deadline="true"]').forEach((el) => {
    el.style.display = 'none';
  });
}
