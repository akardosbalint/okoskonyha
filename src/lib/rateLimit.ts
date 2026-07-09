// Egyszerű, memóriában tárolt, IP-alapú rate limit szerverless API route-okhoz.
// Korlát: a Vercel szerverless függvények nem garantálnak egyetlen, tartósan élő
// instance-ot — hideg indítcase vagy több párhuzamos instance esetén a számláló
// nullázódhat / instance-onként külön számolódik. Alacsony forgalomnál ez így is
// érdemi védelmet ad spam-bot ellen; komolyabb, garantált korláthoz megosztott
// tárolás (pl. Vercel KV) kellene.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return { limited: true, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { limited: false, retryAfterSeconds: 0 };
}
