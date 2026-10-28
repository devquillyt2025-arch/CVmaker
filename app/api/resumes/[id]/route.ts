import { NextResponse } from 'next/server';
import { db, hasDatabase, withConnectRetry } from '@/lib/db';
import { getOwnerId, isUuid } from '@/lib/owner';
import { notConfigured, cloudError, readBody, titleOf, toResume, type ResumeRow } from '@/lib/resumeApi';

export const dynamic = 'force-dynamic';

type Params = { params: { id: string } };

const notFound = () => NextResponse.json({ error: 'Resume not found' }, { status: 404 });

/** Every query is scoped to the browser's owner id, so other browsers' ids read as 404. */
function scope(id: string) {
  const owner = getOwnerId();
  return owner && isUuid(id) ? owner : null;
}

/** GET — one resume, to open it in the builder. */
export async function GET(_req: Request, { params }: Params) {
  if (!hasDatabase()) return notConfigured();
  const owner = scope(params.id);
  if (!owner) return notFound();

  try {
    const rows = await withConnectRetry(() => db()`
      SELECT id, title, content, created_at, updated_at
      FROM resumes
      WHERE id = ${params.id} AND owner_id = ${owner}`) as ResumeRow[];
    return rows[0] ? NextResponse.json({ resume: toResume(rows[0]) }) : notFound();
  } catch (err) {
    return cloudError('Could not load the resume', err);
  }
}

/** PATCH `{ title }` — renames a resume. Doesn't touch its content or edit time. */
export async function PATCH(req: Request, { params }: Params) {
  if (!hasDatabase()) return notConfigured();
  const owner = scope(params.id);
  if (!owner) return notFound();

  const body = await readBody(req);
  if (body instanceof NextResponse) return body;
  const title = titleOf(body);
  if (title === undefined) return NextResponse.json({ error: 'Missing title' }, { status: 400 });

  try {
    const rows = await withConnectRetry(() => db()`
      UPDATE resumes SET title = ${title}
      WHERE id = ${params.id} AND owner_id = ${owner}
      RETURNING id, title`);
    return rows[0] ? NextResponse.json({ id: rows[0].id, title: rows[0].title }) : notFound();
  } catch (err) {
    return cloudError('Could not rename the resume', err);
  }
}

/** DELETE — removes a resume for good. */
export async function DELETE(_req: Request, { params }: Params) {
  if (!hasDatabase()) return notConfigured();
  const owner = scope(params.id);
  if (!owner) return notFound();

  try {
    const rows = await withConnectRetry(() => db()`
      DELETE FROM resumes
      WHERE id = ${params.id} AND owner_id = ${owner}
      RETURNING id`);
    return rows[0] ? NextResponse.json({ deleted: rows[0].id }) : notFound();
  } catch (err) {
    return cloudError('Could not delete the resume', err);
  }
}
