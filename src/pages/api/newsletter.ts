import type { APIRoute } from 'astro';
import { checkRateLimit } from '../../lib/rateLimit';

// Vercel szerverless függvényként fut (nem prerenderelt) — itt biztonságban marad
// a MAILERLITE_API_KEY, mert csak szerveroldalon fut le, sosem kerül a böngészőbe.
export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 perc

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || 'unknown';
  const { limited, retryAfterSeconds } = checkRateLimit(`newsletter:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
  if (limited) {
    return new Response(JSON.stringify({ error: 'Túl sok próbálkozás, kérlek próbáld újra később.' }), {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSeconds) },
    });
  }

  let body: { email?: string; company?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Érvénytelen kérés.' }), { status: 400 });
  }

  // Honeypot: ha a rejtett "company" mező ki van töltve, valószínűleg bot —
  // csendben, hamis sikerrel válaszolunk, hogy ne legyen belőle visszajelzés a botnak.
  if (body.company) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const email = body.email?.trim();
  if (!email || !EMAIL_PATTERN.test(email)) {
    return new Response(JSON.stringify({ error: 'Érvénytelen e-mail cím.' }), { status: 400 });
  }

  const apiKey = import.meta.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'A hírlevél-feliratkozás jelenleg nincs beállítva.' }), { status: 503 });
  }

  // A group ID hozzárendeli a feliratkozót az "Okoskonyha Lead" MailerLite csoporthoz, ami
  // elindítja az arra a csoportbelépésre beállított automatizált levélsorozatot.
  const leadGroupId = import.meta.env.MAILERLITE_LEAD_GROUP_ID;

  try {
    const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(leadGroupId ? { email, groups: [leadGroupId] } : { email }),
    });

    if (!mlRes.ok) {
      const errText = await mlRes.text();
      console.error('MailerLite hiba:', mlRes.status, errText);
      return new Response(JSON.stringify({ error: 'Nem sikerült a feliratkozás.' }), { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('MailerLite kérés sikertelen:', err);
    return new Response(JSON.stringify({ error: 'Nem sikerült a feliratkozás.' }), { status: 502 });
  }
};
