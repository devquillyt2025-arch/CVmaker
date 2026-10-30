import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, contactEntries, range, bullets, degreeLine, has, tint, cleanUrl, toHref,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel, inOrder, customSections, TRACKING,
} from './shared';
import { ContactRow, FitText, Link } from './parts';

// Template 4 — CREATIVE PURPLE: full-bleed color header + light-tint/white two-column body.
const sans = '"Segoe UI", system-ui, -apple-system, sans-serif';
// Secondary text (dates, issuers). #6b7280 keeps ~4.8:1 on white and stays legible
// once printed — the lighter grey this replaced washed out on paper.
const MUTED = '#6b7280';

/** Role on the left, dates pinned right — the two things a recruiter scans for first. */
function TitleRow({ title, dates }: { title?: string; dates?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
      <span style={{ fontSize: 13.5, fontWeight: 700, minWidth: 0 }}>{title}</span>
      {dates && <span style={{ fontSize: 11, color: MUTED, whiteSpace: 'nowrap', flexShrink: 0 }}>{dates}</span>}
    </div>
  );
}

export default function CreativePurpleTemplate({ data, sectionOrder, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#7c3aed';
  const LIGHT = tint(ACCENT, 0.93);
  const colLabel: CSSProperties = {
    fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: TRACKING, color: ACCENT, margin: '0 0 9px',
  };

  return (
    <div data-bleed style={{ fontFamily: sans, color: '#1f2937', minHeight: 'var(--sheet-h)', display: 'flex', flexDirection: 'column' }}>
      {/* Print only: carries the tinted left column to the foot of every printed page. */}
      <div className="resume-print-bg" aria-hidden style={{ left: 0, width: '38%', background: LIGHT }} />
      {/* Header */}
      <div style={{ background: ACCENT, color: '#fff', padding: '30px 40px' }}>
        <FitText as="h1" size={32} wrap style={{ fontWeight: 800, margin: 0 }}>{fullName(contact)}</FitText>
        {contact.jobTitle && <div style={{ fontSize: 14, color: tint(ACCENT, 0.85), marginTop: 3 }}>{contact.jobTitle}</div>}
        <ContactRow
          items={contactEntries(contact)}
          sep={<span style={{ margin: '0 3px' }}>•</span>}
          style={{ fontSize: 11.5, color: tint(ACCENT, 0.9), marginTop: 10 }}
        />
      </div>

      {/* flex: 1 so the tinted left column runs to the foot of the page. */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left 38% */}
        <div style={{ width: '38%', background: LIGHT, padding: '26px 24px' }}>
          {inOrder(sectionOrder, {
            summary: data.summary && (
              <div>
                <div className="resume-heading" style={colLabel}>Summary</div>
                <p style={{ margin: 0, fontSize: 12, color: '#4b5563', lineHeight: 1.55 }}>{data.summary}</p>
              </div>
            ),
            skills: has(data.skills) && (
              <div>
                <div className="resume-heading" style={colLabel}>Skills</div>
                {/* Plain chips: the bars this replaced shrank by list position, implying
                    proficiency levels the user never entered. */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {data.skills.map((s) => (
                    <span key={s.id} style={{
                      fontSize: 11.5, background: '#fff', border: `1px solid ${tint(ACCENT, 0.7)}`,
                      borderRadius: 4, padding: '2px 8px', color: '#1f2937',
                    }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ),
            education: has(data.education) && (
              <div>
                <div className="resume-heading" style={colLabel}>Education</div>
                {data.education.map((e) => (
                  <div key={e.id} className="resume-entry" style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{degreeLine(e) || e.institution}</div>
                    {degreeLine(e) && e.institution && <div style={{ fontSize: 11.5, color: '#374151' }}>{e.institution}</div>}
                    <div style={{ fontSize: 11, color: MUTED }}>{range(e.startDate, e.endDate, e.currentlyStudying)}</div>
                  </div>
                ))}
              </div>
            ),
            certifications: has(data.certifications) && (
              <div>
                <div className="resume-heading" style={colLabel}>Certifications</div>
                {data.certifications.map((c) => (
                  <div key={c.id} className="resume-entry" style={{ marginBottom: 9 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{certMeta(c)}</div>
                  </div>
                ))}
              </div>
            ),
            languages: has(data.languages) && (
              <div>
                <div className="resume-heading" style={colLabel}>Languages</div>
                {data.languages.map((l) => (
                  <div key={l.id} style={{ fontSize: 11.5, marginBottom: 4, color: '#4b5563' }}>{languageLabel(l)}</div>
                ))}
              </div>
            ),
          }, <div style={{ height: 20 }} />)}
        </div>

        {/* Right 62% */}
        <div style={{ width: '62%', padding: '26px 28px', fontSize: 12.5, lineHeight: 1.5 }}>
          {inOrder(sectionOrder, {
            experience: has(data.experience) && (
              <>
                <div className="resume-heading" style={colLabel}>Experience</div>
                {data.experience.map((e) => (
                  <div key={e.id} className="resume-entry" style={{ marginBottom: 13 }}>
                    <TitleRow title={e.position || e.company} dates={range(e.startDate, e.endDate, e.currentlyWorking)} />
                    <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{e.position && e.company}
                      {e.location && <span style={{ color: MUTED, fontWeight: 400 }}>{e.position && e.company ? '  ·  ' : ''}{e.location}</span>}
                    </div>
                    <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#374151' }}>
                      {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </>
            ),
            projects: has(data.projects) && (
              <>
                <div className="resume-heading" style={colLabel}>Projects</div>
                {data.projects.map((p) => (
                  <div key={p.id} className="resume-entry" style={{ marginBottom: 11 }}>
                    <TitleRow title={p.name} dates={range(p.startDate, p.endDate)} />
                    {p.url && <div style={{ fontSize: 11, color: ACCENT, overflowWrap: 'anywhere' }}><Link href={toHref(p.url)}>{cleanUrl(p.url)}</Link></div>}
                    <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#374151' }}>
                      {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </>
            ),
            publications: has(data.publications) && (
              <>
                <div className="resume-heading" style={colLabel}>Publications</div>
                {data.publications.map((p) => (
                  <div key={p.id} className="resume-entry" style={{ marginBottom: 9 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{pubMeta(p)}</div>
                  </div>
                ))}
              </>
            ),
            volunteer: has(data.volunteer) && (
              <>
                <div className="resume-heading" style={colLabel}>Volunteer Experience</div>
                {data.volunteer.map((v) => (
                  <div key={v.id} className="resume-entry" style={{ marginBottom: 11 }}>
                    <TitleRow title={v.role || v.organization} dates={range(v.startDate, v.endDate, v.currentlyVolunteering)} />
                    {v.role && v.organization && <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{v.organization}</div>}
                    <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#374151' }}>
                      {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </>
            ),
            courses: has(data.courses) && (
              <>
                <div className="resume-heading" style={colLabel}>Courses &amp; Training</div>
                {data.courses.map((c) => (
                  <div key={c.id} className="resume-entry" style={{ marginBottom: 9 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{courseMeta(c)}</div>
                  </div>
                ))}
              </>
            ),
            awards: has(data.awards) && (
              <>
                <div className="resume-heading" style={colLabel}>Awards &amp; Honors</div>
                {data.awards.map((a) => (
                  <div key={a.id} className="resume-entry" style={{ marginBottom: 9 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>{awardMeta(a)}</div>
                    {a.description && <p style={{ margin: '2px 0 0', color: '#374151' }}>{a.description}</p>}
                  </div>
                ))}
              </>
            ),
            ...customSections(data, (sec) => (
              <>
                <div className="resume-heading" style={colLabel}>{sec.title}</div>
                {sec.items.map((it) => (
                  <div key={it.id} className="resume-entry" style={{ marginBottom: 9 }}>
                    {it.name && <div style={{ fontSize: 12.5, fontWeight: 700 }}>{it.name}</div>}
                    {it.description && <p style={{ margin: '2px 0 0', color: '#374151' }}>{it.description}</p>}
                  </div>
                ))}
              </>
            )),
          }, <div style={{ height: 6 }} />)}
        </div>
      </div>
    </div>
  );
}
