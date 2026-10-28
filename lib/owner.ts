import { cookies } from 'next/headers';

/**
 * There are no accounts. Each browser gets a random owner id in an httpOnly
 * cookie, and every resume row is scoped to it — so a browser can only ever
 * read or write its own resumes.
 */
const COOKIE = 'fx_owner';
const TWO_YEARS = 60 * 60 * 24 * 365 * 2;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value);
}

/** The current browser's owner id, or null if it has never saved. */
export function getOwnerId(): string | null {
  const value = cookies().get(COOKIE)?.value;
  return isUuid(value) ? value : null;
}

/** The current browser's owner id, issuing one on first save. */
export function getOrCreateOwnerId(): string {
  const existing = getOwnerId();
  if (existing) return existing;
  const id = crypto.randomUUID();
  cookies().set(COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TWO_YEARS,
  });
  return id;
}
