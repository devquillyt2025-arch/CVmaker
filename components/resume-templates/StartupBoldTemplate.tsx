import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, contactEntries, range, bullets, degreeLine, has, tint, cleanUrl, toHref,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel, inOrder, customSections, TRACKING,
} from './shared';
import { ContactRow, FitText, Link } from './parts';

// Template 14 — STARTUP BOLD: huge name, thick rule, 40/60 two-column.
const sans = '"Helvetica Neue", Arial, sans-serif';
const titleRow: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 };
const dates: CSSProperties = { fontSize: 11, color: '#666', whiteSpace: 'nowrap', flexShrink: 0 };

export default function StartupBoldTemplate({ data, sectionOrder, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#f97316';
  const CHIP_BG = tint(ACCENT, 0.94);
  const label: CSSProperties = { fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: TRACKING, color: ACCENT, margin: '0 0 9px' };

  return (
    <div style={{ fontFamily: sans, color: '#111', padding: '40px 46px', fontSize: 12.5, lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ borderBottom: `4px solid ${ACCENT}`, paddingBottom: 12, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
          <FitText as="h1" size={40} wrap style={{ fontWeight: 900, color: ACCENT, margin: 0, lineHeight: 1, minWidth: 0 }}>{fullName(contact)}</FitText>
          {contact.jobTitle && <span style={{ fontSize: 13, color: '#666', fontWeight: 600 }}>{contact.jobTitle}</span>}
        </div>
        <ContactRow items={contactEntries(contact)} sep={<span style={{ margin: '0 3px' }}>·</span>} style={{ fontSize: 11, color: '#666', marginTop: 8 }} />
      </div>

      {data.summary && <p style={{ margin: '0 0 18px', color: '#333' }}>{data.summary}</p>}

      <div style={{ display: 'flex', gap: 30 }}>
        {/* Left 40% */}
        <div style={{ width: '40%' }}>
          {inOrder(sectionOrder, {
            skills: has(data.skills) && (
              <div>
                <div className="resume-heading" style={label}>Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {data.skills.map((s) => (
                    <span key={s.id} style={{ fontSize: 11, background: CHIP_BG, color: ACCENT, borderRadius: 4, padding: '3px 9px' }}>{s.name}</span>
                  ))}
                </div>
              </div>
            ),
            education: has(data.education) && (
              <div>
                <div className="resume-heading" style={label}>Education</div>
                {data.education.map((e) => (
                  <div key={e.id} className="resume-entry" style={{ marginBottom: 9 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{degreeLine(e) || e.institution}</div>
                    {degreeLine(e) && e.institution && <div style={{ fontSize: 11, color: '#666' }}>{e.institution}</div>}
                    <div style={{ fontSize: 10.5, color: '#666' }}>{range(e.startDate, e.endDate, e.currentlyStudying)}</div>
                  </div>
                ))}
              </div>
            ),
            certifications: has(data.certifications) && (
              <div>
                <div className="resume-heading" style={label}>Certifications</div>
                {data.certifications.map((c) => (
                  <div key={c.id} className="resume-entry" style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 10.5, color: '#666' }}>{certMeta(c)}</div>
                  </div>
                ))}
              </div>
            ),
            languages: has(data.languages) && (
              <div>
                <div className="resume-heading" style={label}>Languages</div>
                {data.languages.map((l) => <div key={l.id} style={{ fontSize: 11.5, marginBottom: 3, color: '#444' }}>{languageLabel(l)}</div>)}
              </div>
            ),
            projects: has(data.projects) && (
              <div>
                <div className="resume-heading" style={label}>Projects</div>
                {data.projects.map((p) => (
                  <div key={p.id} className="resume-entry" style={{ marginBottom: 9 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</div>
                    {p.url && <div style={{ fontSize: 10.5, color: ACCENT, overflowWrap: 'anywhere' }}><Link href={toHref(p.url)}>{cleanUrl(p.url)}</Link></div>}
                    <ul style={{ margin: '3px 0 0', paddingLeft: 15, color: '#444' }}>
                      {bullets(p.description).map((b, i) => <li key={i} style={{ fontSize: 11, marginBottom: 2 }}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            ),
          }, <div style={{ height: 20 }} />)}
        </div>

        {/* Right 60% */}
        <div style={{ width: '60%' }}>
          {inOrder(sectionOrder, {
            experience: has(data.experience) && (
              <>
                <div className="resume-heading" style={label}>Experience</div>
                {data.experience.map((e) => (
                  <div key={e.id} className="resume-entry" style={{ marginBottom: 14 }}>
                    <div style={titleRow}>
                      <span style={{ fontSize: 13.5, fontWeight: 800 }}>{e.position || e.company}</span>
                      <span style={dates}>{range(e.startDate, e.endDate, e.currentlyWorking)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{[e.position && e.company, e.location].filter(Boolean).join(' · ')}</div>
                    <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#333' }}>
                      {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </>
            ),
            volunteer: has(data.volunteer) && (
              <div>
                <div className="resume-heading" style={label}>Volunteer Experience</div>
                {data.volunteer.map((v) => (
                  <div key={v.id} className="resume-entry" style={{ marginBottom: 14 }}>
                    <div style={titleRow}>
                      <span style={{ fontSize: 13.5, fontWeight: 800 }}>{v.role || v.organization}</span>
                      <span style={dates}>{range(v.startDate, v.endDate, v.currentlyVolunteering)}</span>
                    </div>
                    {v.role && v.organization && <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{v.organization}</div>}
                    <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#333' }}>
                      {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            ),
            publications: has(data.publications) && (
              <div>
                <div className="resume-heading" style={label}>Publications</div>
                {data.publications.map((p) => (
                  <div key={p.id} className="resume-entry" style={{ marginBottom: 9 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.title}</div>
                    <div style={{ fontSize: 10.5, color: '#666' }}>{pubMeta(p)}</div>
                  </div>
                ))}
              </div>
            ),
            courses: has(data.courses) && (
              <div>
                <div className="resume-heading" style={label}>Courses &amp; Training</div>
                {data.courses.map((c) => (
                  <div key={c.id} className="resume-entry" style={{ marginBottom: 9 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 10.5, color: '#666' }}>{courseMeta(c)}</div>
                  </div>
                ))}
              </div>
            ),
            awards: has(data.awards) && (
              <div>
                <div className="resume-heading" style={label}>Awards &amp; Honors</div>
                {data.awards.map((a) => (
                  <div key={a.id} className="resume-entry" style={{ marginBottom: 9 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>{a.name}</div>
                    <div style={{ fontSize: 10.5, color: '#666' }}>{awardMeta(a)}</div>
                    {a.description && <p style={{ margin: '2px 0 0', color: '#333' }}>{a.description}</p>}
                  </div>
                ))}
              </div>
            ),
            ...customSections(data, (sec) => (
              <div>
                <div className="resume-heading" style={label}>{sec.title}</div>
                {sec.items.map((it) => (
                  <div key={it.id} className="resume-entry" style={{ marginBottom: 9 }}>
                    {it.name && <div style={{ fontSize: 12.5, fontWeight: 700 }}>{it.name}</div>}
                    {it.description && <p style={{ margin: '2px 0 0', color: '#333' }}>{it.description}</p>}
                  </div>
                ))}
              </div>
            )),
          }, <div style={{ height: 6 }} />)}
        </div>
      </div>
    </div>
  );
}
