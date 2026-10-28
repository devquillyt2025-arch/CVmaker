import { NextResponse } from 'next/server';

/** A resume is a few KB; anything far bigger is not a resume. */
const MAX_BYTES = 512 * 1024;
const MAX_TITLE = 120;

export const notConfigured = () =>
  NextResponse.json({ error: 'Cloud save is not configured' }, { status: 503 });

/** Logs a database failure and returns a 502 with a user-facing message. */
export const cloudError = (message: string, err: unknown) => {
  console.error(`${message}:`, err);
  return NextResponse.json({ error: message }, { status: 502 });
};

/** Reads a size-capped JSON body: the parsed object, or the error response to return. */
export async function readBody(req: Request): Promise<Record<string, unknown> | NextResponse> {
  const raw = await req.text();
  if (raw.length > MAX_BYTES) {
    return NextResponse.json({ error: 'Resume is too large to save' }, { status: 413 });
  }
  try {
    const body = JSON.parse(raw);
    if (body && typeof body === 'object' && !Array.isArray(body)) return body;
  } catch { /* fall through */ }
  return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
}

/** The body's `content` serialised for a jsonb column, or null if it isn't resume content. */
export function contentJson(body: Record<string, unknown>): string | null {
  const content = body.content as { data?: unknown } | undefined;
  if (!content || typeof content !== 'object' || !content.data || typeof content.data !== 'object') return null;
  return JSON.stringify(content);
}

/** A trimmed title, `null` to clear it, or `undefined` when the body doesn't set one. */
export function titleOf(body: Record<string, unknown>): string | null | undefined {
  if (!('title' in body)) return undefined;
  if (body.title === null) return null;
  if (typeof body.title !== 'string') return undefined;
  return body.title.trim().slice(0, MAX_TITLE) || null;
}

export interface ResumeRow {
  id: string;
  title: string | null;
  content: unknown;
  created_at: string;
  updated_at: string;
}

export const toResume = (row: ResumeRow) => ({
  id: row.id,
  title: row.title,
  content: row.content,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
