import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, initials, range, bullets, degreeLine, has, cleanUrl,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel,
} from './shared';

// Template 6 — INFOGRAPHIC: avatar header, dot proficiency meters, two-column.
const sans = '"Segoe UI", system-ui, -apple-system, sans-serif';

function Dots({ filled, accent }: { filled: number; accent: string }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i < filled ? accent : '#cbd5e1' }} />
      ))}
    </span>
  );
}

export default function InfographicTemplate({ data, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#0ea5e9';
  const label: CSSProperties = { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: ACCENT, margin: '0 0 9px' };

  return (
    <div style={{ fontFamily: sans, color: '#1f2937', minHeight: 'var(--sheet-h)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '28px 36px 22px', borderBottom: `3px solid ${ACCENT}` }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: ACCENT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, flexShrink: 0 }}>
          {initials(contact)}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{fullName(contact)}</h1>
          {contact.jobTitle && <div style={{ fontSize: 13, color: ACCENT, fontWeight: 600 }}>{contact.jobTitle}</div>}
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
            {[contact.email, contact.phone, [contact.city, contact.country].filter(Boolean).join(', '), cleanUrl(contact.linkedin), cleanUrl(contact.github)].filter(Boolean).join('   ·   ')}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Left */}
        <div style={{ width: '35%', background: '#f8fafc', padding: '24px 22px' }}>
          {has(data.skills) && (
            <div style={{ marginBottom: 20 }}>
              <div className="resume-heading" style={label}>Skills</div>
              {data.skills.map((s, i) => (
                <div key={s.id} className="resume-entry" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                  <span style={{ fontSize: 11.5 }}>{s.name}</span>
                  <Dots filled={Math.max(3, 5 - (i % 3))} accent={ACCENT} />
                </div>
              ))}
            </div>
          )}
          {has(data.education) && (
            <div style={{ marginBottom: has(data.certifications) || has(data.languages) ? 20 : 0 }}>
              <div className="resume-heading" style={label}>Education</div>
              {data.education.map((e) => (
                <div key={e.id} className="resume-entry" style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{degreeLine(e)}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{e.institution}</div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8' }}>{range(e.startDate, e.endDate, e.currentlyStudying)}</div>
                </div>
              ))}
            </div>
          )}
          {has(data.certifications) && (
            <div style={{ marginBottom: has(data.languages) ? 20 : 0 }}>
              <div className="resume-heading" style={label}>Certifications</div>
              {data.certifications.map((c) => (
                <div key={c.id} className="resume-entry" style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8' }}>{certMeta(c)}</div>
                </div>
              ))}
            </div>
          )}
          {has(data.languages) && (
            <div>
              <div className="resume-heading" style={label}>Languages</div>
              {data.languages.map((l) => (
                <div key={l.id} style={{ fontSize: 11.5, marginBottom: 4, color: '#475569' }}>{languageLabel(l)}</div>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ width: '65%', padding: '24px 26px', fontSize: 12.5, lineHeight: 1.5 }}>
          {data.summary && (
            <div style={{ marginBottom: 16 }}>
              <div className="resume-heading" style={label}>Profile</div>
              <p style={{ margin: 0, color: '#475569' }}>{data.summary}</p>
            </div>
          )}
          {has(data.experience) && (
            <>
              <div className="resume-heading" style={label}>Experience</div>
              {data.experience.map((e) => (
                <div key={e.id} className="resume-entry" style={{ marginBottom: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{e.position}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{range(e.startDate, e.endDate, e.currentlyWorking)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{[e.company, e.location].filter(Boolean).join(' · ')}</div>
                  <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#475569' }}>
                    {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          )}
          {has(data.projects) && (
            <>
              <div className="resume-heading" style={{ ...label, marginTop: 4 }}>Projects</div>
              {data.projects.map((p) => (
                <div key={p.id} className="resume-entry" style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.name}</div>
                  {p.url && <div style={{ fontSize: 11, color: ACCENT }}>{p.url}</div>}
                  <ul style={{ margin: '3px 0 0', paddingLeft: 17, color: '#475569' }}>
                    {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          )}
          {has(data.courses) && (
            <>
              <div className="resume-heading" style={{ ...label, marginTop: 4 }}>Courses &amp; Training</div>
              {data.courses.map((c) => (
                <div key={c.id} className="resume-entry" style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{courseMeta(c)}</div>
                </div>
              ))}
            </>
          )}
          {has(data.volunteer) && (
            <>
              <div className="resume-heading" style={{ ...label, marginTop: 4 }}>Volunteer Experience</div>
              {data.volunteer.map((v) => (
                <div key={v.id} className="resume-entry" style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700 }}>{v.role}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{range(v.startDate, v.endDate, v.currentlyVolunteering)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{v.organization}</div>
                  <ul style={{ margin: '3px 0 0', paddingLeft: 17, color: '#475569' }}>
                    {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          )}
          {has(data.publications) && (
            <>
              <div className="resume-heading" style={{ ...label, marginTop: 4 }}>Publications</div>
              {data.publications.map((p) => (
                <div key={p.id} className="resume-entry" style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{pubMeta(p)}</div>
                </div>
              ))}
            </>
          )}
          {has(data.awards) && (
            <>
              <div className="resume-heading" style={{ ...label, marginTop: 4 }}>Awards &amp; Honors</div>
              {data.awards.map((a) => (
                <div key={a.id} className="resume-entry" style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{awardMeta(a)}</div>
                  {a.description && <p style={{ margin: '2px 0 0', color: '#475569' }}>{a.description}</p>}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
