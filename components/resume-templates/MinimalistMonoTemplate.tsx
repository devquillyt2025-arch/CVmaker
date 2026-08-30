import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, contactItems, range, bullets, degreeLine, has,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel,
} from './shared';

// Template 7 — MINIMALIST MONO: monospace, ultra-narrow, `// SECTION` titles, terminal feel.
const mono = '"Courier New", "SF Mono", Menlo, Consolas, monospace';

export default function MinimalistMonoTemplate({ data, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#0f766e';
  const title: CSSProperties = { fontSize: 12, fontWeight: 700, color: ACCENT, margin: '20px 0 8px' };
  const rowBetween: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 };
  const muted: CSSProperties = { color: '#666' };

  return (
    <div style={{ fontFamily: mono, color: '#111', fontSize: 12, lineHeight: 1.55, padding: '48px 0' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 18, fontWeight: 400, margin: 0 }}>{fullName(contact)}</h1>
        {contact.jobTitle && <div style={{ ...muted, marginTop: 2 }}>{contact.jobTitle}</div>}
        <div style={{ ...muted, fontSize: 11, marginTop: 6 }}>{contactItems(contact).join('  ·  ')}</div>

        {data.summary && (
          <>
            <div className="resume-heading" style={title}>{'// summary'}</div>
            <p style={{ margin: 0 }}>{data.summary}</p>
          </>
        )}

        {has(data.skills) && (
          <>
            <div className="resume-heading" style={title}>{'// skills'}</div>
            <div>{data.skills.map((s) => s.name).join(', ')}</div>
          </>
        )}

        {has(data.experience) && (
          <>
            <div className="resume-heading" style={title}>{'// experience'}</div>
            {data.experience.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 12 }}>
                <div style={rowBetween}>
                  <span style={{ fontWeight: 700 }}>{e.position} @ {e.company}</span>
                  <span style={muted}>{range(e.startDate, e.endDate, e.currentlyWorking)}</span>
                </div>
                {e.location && <div style={{ ...muted, fontSize: 11 }}>{e.location}</div>}
                <ul style={{ margin: '4px 0 0', paddingLeft: 16, listStyleType: "'- '" }}>
                  {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>
        )}

        {has(data.projects) && (
          <>
            <div className="resume-heading" style={title}>{'// projects'}</div>
            {data.projects.map((p) => (
              <div key={p.id} className="resume-entry" style={{ marginBottom: 10 }}>
                <div style={rowBetween}>
                  <span style={{ fontWeight: 700 }}>{p.name}</span>
                  <span style={muted}>{range(p.startDate, p.endDate)}</span>
                </div>
                {p.url && <div style={{ ...muted, fontSize: 11 }}>{p.url}</div>}
                <ul style={{ margin: '4px 0 0', paddingLeft: 16, listStyleType: "'- '" }}>
                  {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>
        )}

        {has(data.education) && (
          <>
            <div className="resume-heading" style={title}>{'// education'}</div>
            {data.education.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 6 }}>
                <div style={rowBetween}>
                  <span style={{ fontWeight: 700 }}>{degreeLine(e)}</span>
                  <span style={muted}>{range(e.startDate, e.endDate, e.currentlyStudying)}</span>
                </div>
                <div style={muted}>{[e.institution, e.score && `gpa ${e.score}`].filter(Boolean).join(' · ')}</div>
              </div>
            ))}
          </>
        )}

        {has(data.certifications) && (
          <>
            <div className="resume-heading" style={title}>{'// certifications'}</div>
            {data.certifications.map((c) => (
              <div key={c.id} className="resume-entry" style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={{ ...muted, fontSize: 11 }}>{certMeta(c)}</div>
              </div>
            ))}
          </>
        )}

        {has(data.courses) && (
          <>
            <div className="resume-heading" style={title}>{'// courses'}</div>
            {data.courses.map((c) => (
              <div key={c.id} className="resume-entry" style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={{ ...muted, fontSize: 11 }}>{courseMeta(c)}</div>
              </div>
            ))}
          </>
        )}

        {has(data.languages) && (
          <>
            <div className="resume-heading" style={title}>{'// languages'}</div>
            <div>{data.languages.map(languageLabel).join(', ')}</div>
          </>
        )}

        {has(data.publications) && (
          <>
            <div className="resume-heading" style={title}>{'// publications'}</div>
            {data.publications.map((p) => (
              <div key={p.id} className="resume-entry" style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 700 }}>{p.title}</div>
                <div style={{ ...muted, fontSize: 11 }}>{pubMeta(p)}</div>
              </div>
            ))}
          </>
        )}

        {has(data.volunteer) && (
          <>
            <div className="resume-heading" style={title}>{'// volunteer'}</div>
            {data.volunteer.map((v) => (
              <div key={v.id} className="resume-entry" style={{ marginBottom: 10 }}>
                <div style={rowBetween}>
                  <span style={{ fontWeight: 700 }}>{v.role} @ {v.organization}</span>
                  <span style={muted}>{range(v.startDate, v.endDate, v.currentlyVolunteering)}</span>
                </div>
                <ul style={{ margin: '4px 0 0', paddingLeft: 16, listStyleType: "'- '" }}>
                  {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>
        )}

        {has(data.awards) && (
          <>
            <div className="resume-heading" style={title}>{'// awards'}</div>
            {data.awards.map((a) => (
              <div key={a.id} className="resume-entry" style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 700 }}>{a.name}</div>
                <div style={{ ...muted, fontSize: 11 }}>{awardMeta(a)}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
