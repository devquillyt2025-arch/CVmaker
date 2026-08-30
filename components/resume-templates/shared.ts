import type {
  FontPair, PageSize, ResumeData,
  ResumeCertification, ResumeCourse, ResumeAward, ResumePublication, ResumeLanguage,
} from '@/lib/types';

export type { FontPair, PageSize, Spacing } from '@/lib/types';

/** Font stacks for the builder's font picker, keyed by `builderDesign.fontPair`. */
export const FONT_CSS_MAP: Record<FontPair, string> = {
  modern: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
  arial: 'Arial, Helvetica, sans-serif',
  helvetica: 'Helvetica, Arial, sans-serif',
  verdana: 'Verdana, Geneva, sans-serif',
  times: '"Times New Roman", Times, serif',
  calibri: 'Calibri, Roboto, sans-serif',
  courier: '"Courier New", Courier, monospace',
  editorial: '"Georgia", "Times New Roman", serif',
  classic: '"Times New Roman", Georgia, serif',
};

export interface TemplateProps {
  data: ResumeData;
  /** User's chosen accent from the builder toolbar. Falls back to the template's own brand color when unset (e.g. gallery thumbnails). */
  accentColor?: string;
}

/**
 * Sheet geometry per paper stock, in CSS px at 96dpi.
 *
 * A4 is 210 x 297mm; US Letter is 8.5 x 11in — so Letter is a little wider and
 * noticeably shorter. `print` is the keyword handed to the `@page size`
 * descriptor, which is what makes the browser's PDF export use the right stock.
 *
 * Templates must not import these directly: the sheet publishes its height as
 * the `--sheet-h` custom property so a full-bleed sidebar can stretch to the
 * page without knowing which stock is selected.
 */
export const PAGE_SIZES: Record<PageSize, { w: number; h: number; label: string; print: string }> = {
  a4: { w: 794, h: 1123, label: 'A4', print: 'A4' },
  letter: { w: 816, h: 1056, label: 'Letter', print: 'letter' },
};

/** Fallback stock for callers with no user selection (gallery thumbnails). */
export const DEFAULT_PAGE_SIZE: PageSize = 'a4';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "2021-06" -> "Jun 2021"; passes through anything already formatted. */
export function fmtDate(d?: string): string {
  if (!d) return '';
  const m = /^(\d{4})-(\d{2})/.exec(d);
  if (m) {
    const mo = MONTHS[+m[2] - 1];
    return mo ? `${mo} ${m[1]}` : m[1];
  }
  return d;
}

/** "2021-06" -> "June 2021" (used by the formal/government template). */
export function fmtDateFull(d?: string): string {
  if (!d) return '';
  const m = /^(\d{4})-(\d{2})/.exec(d);
  if (m) {
    const mo = MONTHS_FULL[+m[2] - 1];
    return mo ? `${mo} ${m[1]}` : m[1];
  }
  return d;
}

export function range(start?: string, end?: string, current?: boolean, full = false): string {
  const f = full ? fmtDateFull : fmtDate;
  const e = current ? 'Present' : f(end);
  return [f(start), e].filter(Boolean).join(' – ');
}

export function bullets(desc?: string): string[] {
  return (desc || '')
    .split('\n')
    .map((s) => s.trim().replace(/^[-•]\s*/, ''))
    .filter(Boolean);
}

export function fullName(c: ResumeData['contact']): string {
  return [c.firstName, c.lastName].filter(Boolean).join(' ') || 'Your Name';
}

export function initials(c: ResumeData['contact']): string {
  return [c.firstName?.[0], c.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '··';
}

/**
 * "https://www.linkedin.com/in/name/" -> "linkedin.com/in/name" — users paste the
 * URL straight from their browser bar; the protocol and trailing slash are dead
 * weight on a resume and are usually what pushes a one-line contact row to wrap.
 */
export function cleanUrl(url?: string): string {
  return (url || '').replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '');
}

export function contactItems(c: ResumeData['contact']): string[] {
  return [
    c.email,
    c.phone,
    [c.city, c.country].filter(Boolean).join(', '),
    cleanUrl(c.linkedin),
    cleanUrl(c.github),
    cleanUrl(c.website),
  ].filter(Boolean) as string[];
}

export function degreeLine(edu: ResumeData['education'][number]): string {
  return [edu.degree, edu.field ? `in ${edu.field}` : ''].filter(Boolean).join(' ');
}

export function has<T>(arr?: T[]): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Mixes a hex accent toward white, computed in JS rather than CSS `color-mix()`
 * so it renders identically in the live preview, the print dialog and any
 * headless PDF pipeline. Two uses: a pale tint for badge/panel backgrounds
 * (`amount` ~0.85-0.92) and a lightened tone for accent text that has to sit on
 * a dark panel and would otherwise be too close to the background (~0.5-0.6).
 */
export function tint(hex: string, amount = 0.55): string {
  const n = hex.replace('#', '');
  const r = parseInt(n.substring(0, 2), 16) || 0;
  const g = parseInt(n.substring(2, 4), 16) || 0;
  const b = parseInt(n.substring(4, 6), 16) || 0;
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/** "Amazon Web Services · Issued Jun 2023" / "· No expiration" — issuer plus whatever dates are set. */
export function certMeta(c: ResumeCertification): string {
  const expiry = c.doesNotExpire ? 'No expiration' : c.expiryDate ? `Expires ${fmtDate(c.expiryDate)}` : '';
  const dates = [c.issueDate && `Issued ${fmtDate(c.issueDate)}`, expiry].filter(Boolean).join(' · ');
  return [c.issuer, dates].filter(Boolean).join(' · ');
}

/** "Coursera · Jun 2023" */
export function courseMeta(c: ResumeCourse): string {
  return [c.platform, c.completionDate && fmtDate(c.completionDate)].filter(Boolean).join(' · ');
}

/** "Acme Corp · Jun 2023" */
export function awardMeta(a: ResumeAward): string {
  return [a.issuer, a.date && fmtDate(a.date)].filter(Boolean).join(' · ');
}

/** "Journal of Things · Jun 2023" */
export function pubMeta(p: ResumePublication): string {
  return [p.publisher, p.date && fmtDate(p.date)].filter(Boolean).join(' · ');
}

/** "English — Native Speaker" */
export function languageLabel(l: ResumeLanguage): string {
  return [l.name, l.proficiency].filter(Boolean).join(' — ');
}
