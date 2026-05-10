const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '/');

export function url(path = ''): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('#') || path.startsWith('mailto:')) return path;
  const stripped = path.replace(/^\/+/, '');
  return `${BASE}${stripped}`;
}
