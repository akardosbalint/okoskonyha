// Vékony wrapper a kimenő (WordPress → Circle.so aldomain) kattintások méréséhez.
// Ha Google Analytics / Plausible / más eszköz be van kötve a Layout <head>-jébe,
// ez a függvény automatikusan elküldi neki az eseményt.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
    dataLayer?: unknown[];
  }
}

export function trackOutboundClick(destination: string, label: string) {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'outbound_click', {
      event_category: 'okoskonyha_conversion',
      event_label: label,
      destination,
    });
  }
  if (typeof window.plausible === 'function') {
    window.plausible('Outbound Click', { props: { destination, label } });
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: 'outbound_click', destination, label });
  }
}
