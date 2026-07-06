import type { APIRoute } from 'astro';

// Vercel szerverless függvényként fut (nem prerenderelt) — itt biztonságban marad
// a MAILERLITE_API_KEY, mert csak szerveroldalon fut le, sosem kerül a böngészőbe.
export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
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

  try {
    const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
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
