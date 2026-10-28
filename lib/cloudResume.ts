import { useResumeStore } from '@/lib/store/useResumeStore';
import { DEMO_RESUME_DATA, emptyResumeData } from '@/lib/store/slices/defaultData';
import { DEFAULT_BUILDER_DESIGN, DEFAULT_SECTION_ORDER } from '@/lib/store/slices/globalSlice';
import type { CloudContent, StoreState } from '@/lib/store/slices/types';
import type { ResumeData } from '@/lib/types';

/** A resume as the /api/resumes routes return it. */
export interface CloudResume {
  id: string;
  title: string | null;
  content: CloudContent;
  createdAt: string;
  updatedAt: string;
}

/** The last content the server confirmed, so unchanged state is never re-sent. */
const LAST_SAVED_KEY = 'foliox:lastSaved';

/** What the cloud stores for the builder's current state (zoom is per-device, so it's left out). */
export function cloudContent(
  s: Pick<StoreState, 'data' | 'templateId' | 'sectionOrder' | 'hiddenSections' | 'builderDesign'>,
): CloudContent {
  const { accentColor, fontPair, spacing, pageSize } = s.builderDesign;
  return {
    data: s.data,
    templateId: s.templateId,
    sectionOrder: s.sectionOrder,
    hiddenSections: s.hiddenSections,
    builderDesign: { accentColor, fontPair, spacing, pageSize },
  };
}

function freshContent(data: ResumeData): CloudContent {
  const { accentColor, fontPair, spacing, pageSize } = DEFAULT_BUILDER_DESIGN;
  return {
    data,
    templateId: 'signature-header',
    sectionOrder: DEFAULT_SECTION_ORDER,
    hiddenSections: [],
    builderDesign: { accentColor, fontPair, spacing, pageSize },
  };
}

export const blankContent = () => freshContent(emptyResumeData);
export const exampleContent = () => freshContent(DEMO_RESUME_DATA);

/** JSON with object keys sorted, so the store's key re-ordering doesn't count as a change. */
export function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : 1)))
      : v,
  );
}

/** True for the demo resume every visitor starts with, or a blank one — neither is worth uploading. */
export function isPlaceholderData(data: ResumeData): boolean {
  const json = stableJson(data);
  return json === stableJson(DEMO_RESUME_DATA) || json === stableJson(emptyResumeData);
}

export function readLastSaved(): string | null {
  try { return localStorage.getItem(LAST_SAVED_KEY); } catch { return null; }
}

export function writeLastSaved(json: string) {
  try { localStorage.setItem(LAST_SAVED_KEY, json); } catch { /* storage full or blocked */ }
}

/**
 * Drops this browser's working copy (after its resume is deleted), so the
 * builder doesn't re-upload it as a new resume the next time it opens.
 */
export function forgetLocalResume() {
  useResumeStore.getState().reset();
  try { localStorage.removeItem(LAST_SAVED_KEY); } catch { /* blocked */ }
}

/** The name a resume goes by on the dashboard: its own title, else the person's name. */
export function resumeTitle(r: { title: string | null; content: CloudContent }): string {
  if (r.title) return r.title;
  const c = r.content.data?.contact;
  return [c?.firstName, c?.lastName].filter(Boolean).join(' ') || 'Untitled resume';
}
