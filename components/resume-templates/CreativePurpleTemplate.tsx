import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, contactItems, range, bullets, degreeLine, has, tint,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel,
} from './shared';

// Template 4 — CREATIVE PURPLE: full-bleed color header + light-tint/white two-column body.
const sans = '"Segoe UI", system-ui, -apple-system, sans-serif';

export default function CreativePurpleTemplate({ data, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#7c3aed';
  const LIGHT = tint(ACCENT, 0.93);
  const colLabel: CSSProperties = {
    fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: ACCENT, margin: '0 0 9px',
  };

  return (
    <div style={{ fontFamily: sans, color: '#1f2937', minHeight: 'var(--sheet-h)' }}>
      {/* Header */}
      <div style={{ background: ACCENT, color: '#fff', padding: '30px 40px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>{fullName(contact)}</h1>
        {contact.jobTitle && <div style={{ fontSize: 14, color: tint(ACCENT, 0.85), marginTop: 3 }}>{contact.jobTitle}</div>}
        <div style={{ fontSize: 11.5, color: tint(ACCENT, 0.9), marginTop: 10 }}>{contactItems(contact).join('   •   ')}</div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Left 38% */}
        <div style={{ width: '38%', background: LIGHT, padding: '26px 24px' }}>
          {data.summary && (
            <div style={{ marginBottom: 20 }}>
              <div className="resume-heading" style={colLabel}>About</div>
              <p style={{ margin: 0, fontSize: 12, color: '#4b5563', lineHeight: 1.55 }}>{data.summary}</p>
            </div>
          )}
          {has(data.skills) && (
            <div style={{ marginBottom: 20 }}>
              <div className="resume-heading" style={colLabel}>Skills</div>
              {data.skills.map((s, i) => {
                const pct = 95 - i * 6;
                return (
                  <div key={s.id} className="resume-entry" style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11.5, marginBottom: 3 }}>{s.name}</div>
                    <div style={{ height: 6, background: tint(ACCENT, 0.8), borderRadius: 3 }}>
                      <div style={{ width: `${Math.max(45, pct)}%`, height: '100%', background: ACCENT, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {has(data.education) && (
            <div style={{ marginBottom: 20 }}>
              <div className="resume-heading" style={colLabel}>Education</div>
              {data.education.map((e) => (
                <div key={e.id} className="resume-entry" style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{degreeLine(e)}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{e.institution}</div>
                  <div style={{ fontSize: 10.5, color: '#9ca3af' }}>{range(e.startDate, e.endDate, e.currentlyStudying)}</div>
                </div>
              ))}
            </div>
          )}
          {has(data.certifications) && (
            <div style={{ marginBottom: 20 }}>
              <div className="resume-heading" style={colLabel}>Certifications</div>
              {data.certifications.map((c) => (
                <div key={c.id} className="resume-entry" style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 10.5, color: '#9ca3af' }}>{certMeta(c)}</div>
                </div>
              ))}
            </div>
          )}
          {has(data.languages) && (
            <div>
              <div className="resume-heading" style={colLabel}>Languages</div>
              {data.languages.map((l) => (
                <div key={l.id} style={{ fontSize: 11.5, marginBottom: 4, color: '#4b5563' }}>{languageLabel(l)}</div>
              ))}
            </div>
          )}
        </div>

        {/* Right 62% */}
        <div style={{ width: '62%', padding: '26px 28px', fontSize: 12.5, lineHeight: 1.5 }}>
          {has(data.experience) && (
            <>
              <div className="resume-heading" style={colLabel}>Experience</div>
              {data.experience.map((e) => (
                <div key={e.id} className="resume-entry" style={{ marginBottom: 13 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{e.position}</div>
                  <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{e.company}
                    <span style={{ color: '#9ca3af', fontWeight: 400 }}>{e.location ? `  ·  ${e.location}` : ''}  ·  {range(e.startDate, e.endDate, e.currentlyWorking)}</span>
                  </div>
                  <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#374151' }}>
                    {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          )}
          {has(data.projects) && (
            <>
              <div className="resume-heading" style={{ ...colLabel, marginTop: 6 }}>Projects</div>
              {data.projects.map((p) => (
                <div key={p.id} className="resume-entry" style={{ marginBottom: 11 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.name} <span style={{ fontSize: 10.5, color: ACCENT, fontWeight: 400 }}>{p.url}</span></div>
                  <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#374151' }}>
                    {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          )}
          {has(data.publications) && (
            <>
              <div className="resume-heading" style={{ ...colLabel, marginTop: 6 }}>Publications</div>
              {data.publications.map((p) => (
                <div key={p.id} className="resume-entry" style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.title}</div>
                  <div style={{ fontSize: 10.5, color: '#9ca3af' }}>{pubMeta(p)}</div>
                </div>
              ))}
            </>
          )}
          {has(data.volunteer) && (
            <>
              <div className="resume-heading" style={{ ...colLabel, marginTop: 6 }}>Volunteer Experience</div>
              {data.volunteer.map((v) => (
                <div key={v.id} className="resume-entry" style={{ marginBottom: 11 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{v.role}</div>
                  <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{v.organization}
                    <span style={{ color: '#9ca3af', fontWeight: 400 }}>  ·  {range(v.startDate, v.endDate, v.currentlyVolunteering)}</span>
                  </div>
                  <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#374151' }}>
                    {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          )}
          {has(data.courses) && (
            <>
              <div className="resume-heading" style={{ ...colLabel, marginTop: 6 }}>Courses &amp; Training</div>
              {data.courses.map((c) => (
                <div key={c.id} className="resume-entry" style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 10.5, color: '#9ca3af' }}>{courseMeta(c)}</div>
                </div>
              ))}
            </>
          )}
          {has(data.awards) && (
            <>
              <div className="resume-heading" style={{ ...colLabel, marginTop: 6 }}>Awards &amp; Honors</div>
              {data.awards.map((a) => (
                <div key={a.id} className="resume-entry" style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{a.name}</div>
                  <div style={{ fontSize: 10.5, color: '#9ca3af' }}>{awardMeta(a)}</div>
                  {a.description && <p style={{ margin: '2px 0 0', color: '#374151' }}>{a.description}</p>}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
