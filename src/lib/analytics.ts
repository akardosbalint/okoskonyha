// Vékony wrapper a kimenő (WordPress → Circle.so aldomain) kattintások méréséhez.
// A Google Tag Manager (lásd Layout.astro) figyeli a dataLayert, ide küldjük az eseményt.
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function trackOutboundClick(destination: string, label: string) {
  if (typeof window === 'undefined') return;

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: 'outbound_click', destination, label });
  }
}
