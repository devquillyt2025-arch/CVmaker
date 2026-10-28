import type { TemplateId } from './types';

export interface TemplateMeta {
  id: TemplateId;
  label: string;
  /** true = clean layout that parses reliably in ATS scanners. */
  ats: boolean;
  /** One-line description shown in the template gallery. */
  blurb: string;
}

/**
 * Single source of truth for the template list — used by the builder toolbar
 * picker and the /templates gallery so they never drift apart.
 */
export const TEMPLATE_META: TemplateMeta[] = [
  { id: 'startup-bold',    label: 'Startup Bold',    ats: false, blurb: 'Oversized orange name, two-column body. YC-startup energy.' },
  { id: 'signature-header', label: 'Signature Header', ats: true, blurb: 'Centered name, icon contact row, dates right-aligned for fast skimming, solid foot bar. Corporate clean.' },
  { id: 'academic-cv',     label: 'Academic CV',     ats: true,  blurb: 'Long-form CV with publications and hanging indents. Research roles.' },
  { id: 'elegant-serif',   label: 'Elegant Serif',   ats: true,  blurb: 'Italic serif name with ornamental dividers. Academic, legal, finance.' },
  { id: 'creative-purple', label: 'Creative Purple', ats: false, blurb: 'Full-bleed color header with a tinted skills column. Design & product roles.' },
  { id: 'executive-bold',  label: 'Executive Bold',  ats: false, blurb: 'Massive name, two-column grid, timeline dots. High-impact for senior roles.' },
  { id: 'sidebar-dark',    label: 'Sidebar Dark',    ats: false, blurb: 'Navy sidebar with avatar, white content. Popular in tech.' },
];
