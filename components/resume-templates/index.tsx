import type { CSSProperties, FC } from 'react';
import type { FontPair, PageSize, ResumeData, Spacing, TemplateId } from '@/lib/types';
import { PAGE_SIZES, DEFAULT_PAGE_SIZE, FONT_CSS_MAP, type TemplateProps } from './shared';

import SidebarDarkTemplate from './SidebarDarkTemplate';
import ExecutiveBoldTemplate from './ExecutiveBoldTemplate';
import CreativePurpleTemplate from './CreativePurpleTemplate';
import ElegantSerifTemplate from './ElegantSerifTemplate';
import StartupBoldTemplate from './StartupBoldTemplate';
import AcademicCvTemplate from './AcademicCvTemplate';
import SignatureHeaderTemplate from './SignatureHeaderTemplate';

export const HTML_TEMPLATES: Record<TemplateId, FC<TemplateProps>> = {
  'sidebar-dark': SidebarDarkTemplate,
  'executive-bold': ExecutiveBoldTemplate,
  'creative-purple': CreativePurpleTemplate,
  'elegant-serif': ElegantSerifTemplate,
  'startup-bold': StartupBoldTemplate,
  'academic-cv': AcademicCvTemplate,
  'signature-header': SignatureHeaderTemplate,
};

/** True when any of the given fields has non-whitespace text. */
const filled = (...fields: (string | undefined)[]) => fields.some((f) => f?.trim());

/**
 * Prepares data for rendering: drops entries the user added but hasn't filled
 * in yet (otherwise a lone "Certifications" heading prints over nothing) and
 * blanks out sections toggled off, so templates simply skip them.
 */
function prepare(data: ResumeData, hidden: string[]): ResumeData {
  const h = (k: string) => hidden.includes(k);
  return {
    ...data,
    summary: h('summary') ? '' : data.summary,
    skills: h('skills') ? [] : data.skills.filter((s) => filled(s.name)),
    experience: h('experience') ? [] : data.experience.filter((e) => filled(e.position, e.company, e.description)),
    education: h('education') ? [] : data.education.filter((e) => filled(e.institution, e.degree, e.field)),
    projects: h('projects') ? [] : data.projects.filter((p) => filled(p.name, p.description)),
    certifications: h('certifications') ? [] : (data.certifications ?? []).filter((c) => filled(c.name)),
    languages: h('languages') ? [] : (data.languages ?? []).filter((l) => filled(l.name)),
    publications: h('publications') ? [] : (data.publications ?? []).filter((p) => filled(p.title)),
    courses: h('courses') ? [] : (data.courses ?? []).filter((c) => filled(c.name)),
    awards: h('awards') ? [] : (data.awards ?? []).filter((a) => filled(a.name)),
    volunteer: h('volunteer') ? [] : (data.volunteer ?? []).filter((v) => filled(v.role, v.organization)),
    customSections: (data.customSections ?? [])
      .filter((s) => !h(s.id))
      .map((s) => ({ ...s, items: (s.items ?? []).filter((i) => filled(i.name, i.description)) })),
  };
}

interface ResumeDocProps {
  data: ResumeData;
  templateId: TemplateId;
  sectionOrder?: string[];
  hiddenSections?: string[];
  spacing?: Spacing;
  fontPair?: FontPair;
  pageSize?: PageSize;
  accentColor?: string;
}

/**
 * Renders the selected HTML template inside a fixed A4 sheet. The sheet is the
 * single unit that callers scale (gallery thumbnails) or zoom (builder preview).
 *
 * `data-spacing` / `data-font` drive the override rules in globals.css. Every
 * template hard-codes its own root `line-height`, padding and `font-family` as
 * inline styles, so those rules have to win against inline styles — inheritance
 * from this element alone would not reach them.
 */
export default function ResumeDoc({
  data,
  templateId,
  sectionOrder,
  hiddenSections = [],
  spacing = 'balanced',
  fontPair,
  pageSize = DEFAULT_PAGE_SIZE,
  accentColor,
}: ResumeDocProps) {
  const Template = HTML_TEMPLATES[templateId] ?? SignatureHeaderTemplate;
  const filtered = prepare(data, hiddenSections);
  const page = PAGE_SIZES[pageSize] ?? PAGE_SIZES[DEFAULT_PAGE_SIZE];

  // `data-font` is omitted entirely when no font is chosen, so the `[data-font]`
  // rule stays inert and templates keep their own typography. `--sheet-h` is how
  // full-bleed templates fill the page without importing a fixed height.
  const style = {
    width: page.w,
    minHeight: page.h,
    '--sheet-h': `${page.h}px`,
    background: '#ffffff',
    overflow: 'hidden',
    position: 'relative',
    ...(fontPair && { '--resume-font': FONT_CSS_MAP[fontPair] }),
  } as CSSProperties;

  return (
    <div className="resume-sheet" data-spacing={spacing} data-font={fontPair} style={style}>
      <Template data={filtered} sectionOrder={sectionOrder} accentColor={accentColor} />
    </div>
  );
}
