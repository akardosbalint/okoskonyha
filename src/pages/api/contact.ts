import type { APIRoute } from 'astro';
import { SITE } from '../../lib/site';
import { checkRateLimit } from '../../lib/rateLimit';

// Vercel szerverless függvényként fut (nem prerenderelt) — itt biztonságban marad
// a RESEND_API_KEY, mert csak szerveroldalon fut le, sosem kerül a böngészőbe.
export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = ['Prémium privát chef szolgáltatás', 'Jótékonysági vacsora szervezése', 'Okoskonyha tagság', 'Életmód-tanácsadás', 'Egyéb'];
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 perc

interface ContactBody {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
  company?: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || 'unknown';
  const { limited, retryAfterSeconds } = checkRateLimit(`contact:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
  if (limited) {
    return new Response(JSON.stringify({ error: 'Túl sok próbálkozás, kérlek próbáld újra később.' }), {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSeconds) },
    });
  }

  let body: ContactBody;
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

  const name = body.name?.trim();
  const email = body.email?.trim();
  const topic = body.topic?.trim();
  const message = body.message?.trim();

  if (!name || !email || !topic || !message) {
    return new Response(JSON.stringify({ error: 'Minden mező kitöltése kötelező.' }), { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return new Response(JSON.stringify({ error: 'Érvénytelen e-mail cím.' }), { status: 400 });
  }
  if (!TOPICS.includes(topic)) {
    return new Response(JSON.stringify({ error: 'Érvénytelen téma.' }), { status: 400 });
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'A kapcsolatfelvételi űrlap jelenleg nincs beállítva.' }), { status: 503 });
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Okoskonyha weboldal <kapcsolat@${SITE.mailDomain}>`,
        to: [SITE.email],
        reply_to: email,
        subject: `Kapcsolatfelvétel a weboldalról — ${topic}`,
        html:
          `<p><strong>Név:</strong> ${escapeHtml(name)}</p>` +
          `<p><strong>E-mail cím:</strong> ${escapeHtml(email)}</p>` +
          `<p><strong>Téma:</strong> ${escapeHtml(topic)}</p>` +
          `<p><strong>Üzenet:</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend hiba:', resendRes.status, errText);
      return new Response(JSON.stringify({ error: 'Nem sikerült elküldeni az üzenetet.' }), { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('Resend kérés sikertelen:', err);
    return new Response(JSON.stringify({ error: 'Nem sikerült elküldeni az üzenetet.' }), { status: 502 });
  }
};
