import { NextResponse } from 'next/server';
import { db, hasDatabase, withConnectRetry } from '@/lib/db';
import { getOwnerId, getOrCreateOwnerId } from '@/lib/owner';
import { notConfigured, cloudError, readBody, contentJson, titleOf, toResume, type ResumeRow } from '@/lib/resumeApi';

export const dynamic = 'force-dynamic';

/** GET — every resume this browser owns, most recently edited first. */
export async function GET() {
  if (!hasDatabase()) return notConfigured();
  const owner = getOwnerId();
  if (!owner) return NextResponse.json({ resumes: [] });

  try {
    const rows = await withConnectRetry(() => db()`
      SELECT id, title, content, created_at, updated_at
      FROM resumes
      WHERE owner_id = ${owner}
      ORDER BY updated_at DESC`) as ResumeRow[];
    return NextResponse.json({ resumes: rows.map(toResume) });
  } catch (err) {
    return cloudError('Could not load your resumes', err);
  }
}

/** POST `{ content, title? }` — creates a resume (new, or a duplicate). */
export async function POST(req: Request) {
  if (!hasDatabase()) return notConfigured();

  const body = await readBody(req);
  if (body instanceof NextResponse) return body;
  const json = contentJson(body);
  if (!json) return NextResponse.json({ error: 'Missing resume content' }, { status: 400 });
  const title = titleOf(body) ?? null;
  const owner = getOrCreateOwnerId();

  try {
    const rows = await withConnectRetry(() => db()`
      INSERT INTO resumes (owner_id, title, content)
      VALUES (${owner}, ${title}, ${json}::jsonb)
      RETURNING id, title, content, created_at, updated_at`) as ResumeRow[];
    return NextResponse.json({ resume: toResume(rows[0]) }, { status: 201 });
  } catch (err) {
    return cloudError('Could not create the resume', err);
  }
}
