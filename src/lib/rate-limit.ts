/**
 * In-memory rate limiter. Suitable for single-instance deployments.
 * For multi-instance (scaled) deployments, replace with a Redis-backed solution.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Returns true if the request should be blocked.
 * @param key      Identifier (e.g. IP address)
 * @param limit    Max requests per window
 * @param windowMs Window size in milliseconds
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (bucket.count >= limit) {
    return true;
  }

  bucket.count += 1;
  return false;
}
