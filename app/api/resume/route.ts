import { NextResponse } from 'next/server';
import { db, hasDatabase, withConnectRetry } from '@/lib/db';
import { getOwnerId, getOrCreateOwnerId, isUuid } from '@/lib/owner';
import { notConfigured, cloudError, readBody, contentJson } from '@/lib/resumeApi';

export const dynamic = 'force-dynamic';

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
    return cloudError('Could not load from the cloud', err);
  }
}

/**
 * PUT `{ id?, content }` — saves the resume. Updates `id` when this browser
 * owns it; otherwise (first save, or a row that no longer exists) inserts a
 * new one. Returns the id to use for later saves.
 */
export async function PUT(req: Request) {
  if (!hasDatabase()) return notConfigured();

  const body = await readBody(req);
  if (body instanceof NextResponse) return body;
  const json = contentJson(body);
  if (!json) return NextResponse.json({ error: 'Missing resume content' }, { status: 400 });

  const owner = getOrCreateOwnerId();

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
    return cloudError('Could not save to the cloud', err);
  }
}
