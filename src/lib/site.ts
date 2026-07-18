// Canonical site URL used for metadata, Open Graph tags, and the sitemap.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://trustqualitydesign.com'
).replace(/\/$/, '');

export const SITE_NAME = 'Trust Quality Design';
