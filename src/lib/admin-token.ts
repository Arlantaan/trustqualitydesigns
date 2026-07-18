/**
 * Derives a deterministic session token from the admin password using HMAC-SHA256.
 * The cookie never stores the raw password — only this derived token.
 * Works in both Node.js and the Edge Runtime.
 */
export async function deriveAdminToken(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode('tqd-admin-session-v1')
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
