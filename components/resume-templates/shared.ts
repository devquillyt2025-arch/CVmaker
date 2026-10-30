import { Fragment, createElement, type ReactNode } from 'react';
import type {
  FontPair, PageSize, ResumeData, ResumeCustomSection,
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
  /** The builder's section order (section keys and `custom-…` ids). */
  sectionOrder?: string[];
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

/**
 * Upper bound for letter-spacing on resume text. Parsers rebuild words from
 * glyph positions, and pdfminer — behind most Python ATS tooling — starts a new
 * word wherever two letters sit more than 0.1em apart, so tracked-out headings
 * came through as "S K I L L S" and the section was never detected. 0.05em also
 * clears synthesized small caps, whose glyphs are drawn ~30% smaller.
 */
export const TRACKING = '0.05em';

/**
 * Typed glyph bullets are stripped whatever follows them; dashes only when
 * followed by a space, so "-20% churn" keeps its minus sign. The template draws
 * its own list marker, so a pasted "•" would otherwise print twice.
 */
const BULLET_PREFIX = /^(?:[•●▪■◦‣∙·*]\s*|[-–—]\s+)/;

export function bullets(desc?: string): string[] {
  return (desc || '')
    .split('\n')
    .map((s) => s.trim().replace(BULLET_PREFIX, '').trim())
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

/**
 * Link target for a user-typed URL: "linkedin.com/in/x" -> "https://linkedin.com/in/x".
 * Only web URLs are linked — anything with another scheme (`javascript:` and the
 * like) gets no link at all rather than a live one in the preview.
 */
export function toHref(url?: string): string | undefined {
  const u = (url || '').trim();
  if (!u || /\s/.test(u)) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  return /^[a-z][a-z\d+.-]*:/i.test(u) ? undefined : `https://${u}`;
}

export type ContactKey = 'email' | 'phone' | 'location' | 'linkedin' | 'github' | 'website';

export interface ContactEntry {
  key: ContactKey;
  text: string;
  /** Becomes a link annotation in the exported PDF (mailto:, tel:, https:). */
  href?: string;
}

const CONTACT_ORDER: ContactKey[] = ['email', 'phone', 'location', 'linkedin', 'github', 'website'];

/** The filled-in contact details, in `order`, each with its link target. */
export function contactEntries(c: ResumeData['contact'], order: ContactKey[] = CONTACT_ORDER): ContactEntry[] {
  const email = c.email?.trim();
  const phone = c.phone?.trim();
  const all: Record<ContactKey, ContactEntry | null> = {
    email: email ? { key: 'email', text: email, href: /^[^\s@]+@[^\s@]+$/.test(email) ? `mailto:${email}` : undefined } : null,
    phone: phone ? { key: 'phone', text: phone, href: /\d/.test(phone) ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined } : null,
    location: c.city || c.country ? { key: 'location', text: [c.city, c.country].filter(Boolean).join(', ') } : null,
    linkedin: c.linkedin ? { key: 'linkedin', text: cleanUrl(c.linkedin), href: toHref(c.linkedin) } : null,
    github: c.github ? { key: 'github', text: cleanUrl(c.github), href: toHref(c.github) } : null,
    website: c.website ? { key: 'website', text: cleanUrl(c.website), href: toHref(c.website) } : null,
  };
  return order.map((k) => all[k]).filter((e): e is ContactEntry => Boolean(e));
}

export function degreeLine(edu: ResumeData['education'][number]): string {
  return [edu.degree, edu.field ? `in ${edu.field}` : ''].filter(Boolean).join(' ');
}

/**
 * The education "Score / CGPA" field as printed. A bare number gets a "GPA"
 * label; anything already labelled ("8.6 CGPA", "85%", "First Class") prints as
 * typed, where blindly prefixing produced "GPA 8.6 CGPA" and "GPA 85%".
 */
export function scoreText(score?: string): string {
  const s = (score || '').trim();
  if (!s) return '';
  return /[a-z%]/i.test(s) ? s : `GPA ${s}`;
}

export function has<T>(arr?: T[]): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Renders a column's section blocks in the user's builder order. `blocks` is
 * keyed by section id in the template's own default order; falsy blocks (empty
 * sections) are skipped, and ids the user's order doesn't mention keep their
 * template position after the ordered ones. `gap` goes between rendered blocks,
 * so spacing stays right whichever section ends up first or last.
 */
export function inOrder(order: string[] | undefined, blocks: Record<string, ReactNode>, gap?: ReactNode): ReactNode[] {
  const keys = Object.keys(blocks).filter((k) => blocks[k]);
  const rank = (k: string) => {
    const i = order?.indexOf(k) ?? -1;
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  const sorted = keys
    .map((k, i) => ({ k, i }))
    .sort((a, b) => rank(a.k) - rank(b.k) || a.i - b.i)
    .map(({ k }) => k);
  return sorted.flatMap((k, i) => [
    ...(i > 0 && gap ? [createElement(Fragment, { key: `${k}-gap` }, gap)] : []),
    createElement(Fragment, { key: k }, blocks[k]),
  ]);
}

/** One block per custom section, keyed by its id so `inOrder` can place it. */
export function customSections(
  data: ResumeData,
  render: (section: ResumeCustomSection) => ReactNode,
): Record<string, ReactNode> {
  return Object.fromEntries(
    (data.customSections ?? []).filter((s) => has(s.items)).map((s) => [s.id, render(s)]),
  );
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
