import { NextResponse } from 'next/server';
import { db, hasDatabase, withConnectRetry } from '@/lib/db';
import { getOwnerId, getOrCreateOwnerId, isUuid } from '@/lib/owner';

export const dynamic = 'force-dynamic';

/** A resume is a few KB; anything far bigger is not a resume. */
const MAX_BYTES = 512 * 1024;

const notConfigured = () =>
  NextResponse.json({ error: 'Cloud save is not configured' }, { status: 503 });

/** GET — this browser's most recently saved resume, or `{ resume: null }`. */
export async function GET() {
  if (!hasDatabase()) return notConfigured();
  const owner = getOwnerId();
  if (!owner) return NextResponse.json({ resume: null });

  try {
    const rows = await withConnectRetry(() => db()`
      SELECT id, content, updated_at
      FROM resumes
      WHERE owner_id = ${owner}
      ORDER BY updated_at DESC
      LIMIT 1`);
    const row = rows[0];
    return NextResponse.json({
      resume: row ? { id: row.id, content: row.content, updatedAt: row.updated_at } : null,
    });
  } catch (err) {
    console.error('resume load failed:', err);
    return NextResponse.json({ error: 'Could not load from the cloud' }, { status: 502 });
  }
}

/**
 * PUT `{ id?, content }` — saves the resume. Updates `id` when this browser
 * owns it; otherwise (first save, or a row that no longer exists) inserts a
 * new one. Returns the id to use for later saves.
 */
export async function PUT(req: Request) {
  if (!hasDatabase()) return notConfigured();

  const raw = await req.text();
  if (raw.length > MAX_BYTES) {
    return NextResponse.json({ error: 'Resume is too large to save' }, { status: 413 });
  }

  let body: { id?: unknown; content?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const content = body.content as { data?: unknown } | undefined;
  if (!content || typeof content !== 'object' || !content.data || typeof content.data !== 'object') {
    return NextResponse.json({ error: 'Missing resume content' }, { status: 400 });
  }

  const owner = getOrCreateOwnerId();
  const json = JSON.stringify(content);

  try {
    if (isUuid(body.id)) {
      const updated = await withConnectRetry(() => db()`
        UPDATE resumes
        SET content = ${json}::jsonb, updated_at = now()
        WHERE id = ${body.id} AND owner_id = ${owner}
        RETURNING id, updated_at`);
      if (updated[0]) return NextResponse.json({ id: updated[0].id, updatedAt: updated[0].updated_at });
    }

    const inserted = await withConnectRetry(() => db()`
      INSERT INTO resumes (owner_id, content)
      VALUES (${owner}, ${json}::jsonb)
      RETURNING id, updated_at`);
    return NextResponse.json({ id: inserted[0].id, updatedAt: inserted[0].updated_at });
  } catch (err) {
    console.error('resume save failed:', err);
    return NextResponse.json({ error: 'Could not save to the cloud' }, { status: 502 });
  }
}
