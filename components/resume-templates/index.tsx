import type { CSSProperties, FC } from 'react';
import type { FontPair, PageSize, ResumeData, Spacing, TemplateId } from '@/lib/types';
import { PAGE_SIZES, DEFAULT_PAGE_SIZE, FONT_CSS_MAP, type TemplateProps } from './shared';

import ClassicTemplate from './ClassicTemplate';
import SidebarDarkTemplate from './SidebarDarkTemplate';
import ExecutiveBoldTemplate from './ExecutiveBoldTemplate';
import CreativePurpleTemplate from './CreativePurpleTemplate';
import SwissGridTemplate from './SwissGridTemplate';
import InfographicTemplate from './InfographicTemplate';
import MinimalistMonoTemplate from './MinimalistMonoTemplate';
import CardStackTemplate from './CardStackTemplate';
import TimelineLeftTemplate from './TimelineLeftTemplate';
import GovernmentTemplate from './GovernmentTemplate';
import DarkModeTemplate from './DarkModeTemplate';
import ElegantSerifTemplate from './ElegantSerifTemplate';
import StartupBoldTemplate from './StartupBoldTemplate';
import AcademicCvTemplate from './AcademicCvTemplate';
import SignatureHeaderTemplate from './SignatureHeaderTemplate';

export const HTML_TEMPLATES: Record<TemplateId, FC<TemplateProps>> = {
  'classic': ClassicTemplate,
  'sidebar-dark': SidebarDarkTemplate,
  'executive-bold': ExecutiveBoldTemplate,
  'creative-purple': CreativePurpleTemplate,
  'swiss-grid': SwissGridTemplate,
  'infographic': InfographicTemplate,
  'minimalist-mono': MinimalistMonoTemplate,
  'card-stack': CardStackTemplate,
  'timeline-left': TimelineLeftTemplate,
  'government': GovernmentTemplate,
  'dark-mode': DarkModeTemplate,
  'elegant-serif': ElegantSerifTemplate,
  'startup-bold': StartupBoldTemplate,
  'academic-cv': AcademicCvTemplate,
  'signature-header': SignatureHeaderTemplate,
};

/** Blank out sections the user has toggled off so templates simply skip them. */
function applyHidden(data: ResumeData, hidden: string[]): ResumeData {
  if (!hidden.length) return data;
  const h = (k: string) => hidden.includes(k);
  return {
    ...data,
    summary: h('summary') ? '' : data.summary,
    skills: h('skills') ? [] : data.skills,
    experience: h('experience') ? [] : data.experience,
    education: h('education') ? [] : data.education,
    projects: h('projects') ? [] : data.projects,
    certifications: h('certifications') ? [] : data.certifications,
    languages: h('languages') ? [] : data.languages,
    publications: h('publications') ? [] : data.publications,
    courses: h('courses') ? [] : data.courses,
    awards: h('awards') ? [] : data.awards,
    volunteer: h('volunteer') ? [] : data.volunteer,
  };
}

interface ResumeDocProps {
  data: ResumeData;
  templateId: TemplateId;
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
  hiddenSections = [],
  spacing = 'balanced',
  fontPair,
  pageSize = DEFAULT_PAGE_SIZE,
  accentColor,
}: ResumeDocProps) {
  const Template = HTML_TEMPLATES[templateId] ?? ClassicTemplate;
  const filtered = applyHidden(data, hiddenSections);
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
      <Template data={filtered} accentColor={accentColor} />
    </div>
  );
}
