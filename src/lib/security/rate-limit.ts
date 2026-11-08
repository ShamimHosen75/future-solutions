/**
 * Sliding-window rate limiter. Memory-backed per server instance, which is
 * enough to stop bursts; the lead actions also check the database for the
 * same hashed IP so limits hold across serverless instances.
 */
type Bucket = { timestamps: number[] };

const store: Map<string, Bucket> =
  (globalThis as { __fsRateLimit?: Map<string, Bucket> }).__fsRateLimit ??
  ((globalThis as { __fsRateLimit?: Map<string, Bucket> }).__fsRateLimit = new Map());

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);
  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now;
    store.set(key, bucket);
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)) };
  }
  bucket.timestamps.push(now);
  store.set(key, bucket);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (store.size > 5000) {
    for (const [k, b] of store) if (b.timestamps.every((t) => now - t > windowMs)) store.delete(k);
  }
  return { ok: true };
}
