import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let client: NeonQueryFunction<false, false> | null = null;

/** True when a database is configured; without one the app stays local-only. */
export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Neon's HTTP driver: each query is one fetch, which suits serverless routes.
 * Created on first use so `next build` works without DATABASE_URL.
 */
export function db(): NeonQueryFunction<false, false> {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    client = neon(url);
  }
  return client;
}

/** Error codes that mean the connection never opened, so the query was never sent. */
const CONNECT_CODES = new Set(['UND_ERR_CONNECT_TIMEOUT', 'ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN', 'ETIMEDOUT']);

function neverSent(err: unknown): boolean {
  for (let e = err as { code?: string; cause?: unknown; sourceError?: unknown } | undefined, depth = 0; e && depth < 5; depth++) {
    if (e.code && CONNECT_CODES.has(e.code)) return true;
    e = (e.sourceError ?? e.cause) as typeof e;
  }
  return false;
}

/**
 * Runs a query, retrying only when Neon couldn't be reached at all. Those
 * attempts never reached the database, so even an INSERT can't double up.
 * Other failures (including ones mid-request) are thrown straight away.
 */
export async function withConnectRetry<T>(run: () => Promise<T>, attempts = 3): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await run();
    } catch (err) {
      if (attempt >= attempts || !neverSent(err)) throw err;
      await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
    }
  }
}
