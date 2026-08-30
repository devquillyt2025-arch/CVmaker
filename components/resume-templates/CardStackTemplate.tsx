import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, contactItems, range, bullets, degreeLine, has,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel,
} from './shared';

// Template 9 — CARD STACK: single column, each entry a bordered card.
const sans = '"Segoe UI", system-ui, -apple-system, sans-serif';

export default function CardStackTemplate({ data, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#f59e0b';
  const label: CSSProperties = {
    fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: ACCENT,
    borderBottom: `2px solid ${ACCENT}`, display: 'inline-block', paddingBottom: 2, margin: '20px 0 10px',
  };
  const card: CSSProperties = {
    border: '1px solid #ececec', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    padding: '12px 14px', marginBottom: 10, background: '#fff',
  };
  const chip: CSSProperties = { fontSize: 11, border: `1px solid ${ACCENT}`, color: ACCENT, borderRadius: 999, padding: '3px 10px' };

  return (
    <div style={{ fontFamily: sans, color: '#1f2937', padding: '36px 40px', fontSize: 12.5, lineHeight: 1.5 }}>
      <div style={{ borderLeft: `4px solid ${ACCENT}`, paddingLeft: 14, marginBottom: 4 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>{fullName(contact)}</h1>
        {contact.jobTitle && <div style={{ fontSize: 13, color: '#6b7280' }}>{contact.jobTitle}</div>}
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 5 }}>{contactItems(contact).join('  ·  ')}</div>
      </div>

      {data.summary && <p style={{ margin: '12px 0 0', color: '#4b5563' }}>{data.summary}</p>}

      {has(data.skills) && (
        <>
          <div className="resume-heading" style={label}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.skills.map((s) => <span key={s.id} style={chip}>{s.name}</span>)}
          </div>
        </>
      )}

      {has(data.experience) && (
        <>
          <div className="resume-heading" style={label}>Experience</div>
          {data.experience.map((e) => (
            <div key={e.id} className="resume-entry" style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{e.position}</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{range(e.startDate, e.endDate, e.currentlyWorking)}</span>
              </div>
              <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{[e.company, e.location].filter(Boolean).join(' · ')}</div>
              <ul style={{ margin: '5px 0 0', paddingLeft: 17, color: '#4b5563' }}>
                {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {has(data.projects) && (
        <>
          <div className="resume-heading" style={label}>Projects</div>
          {data.projects.map((p) => (
            <div key={p.id} className="resume-entry" style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111827' }}>{p.name}</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{range(p.startDate, p.endDate)}</span>
              </div>
              {p.url && <div style={{ fontSize: 11, color: ACCENT }}>{p.url}</div>}
              <ul style={{ margin: '5px 0 0', paddingLeft: 17, color: '#4b5563' }}>
                {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {has(data.education) && (
        <>
          <div className="resume-heading" style={label}>Education</div>
          {data.education.map((e) => (
            <div key={e.id} className="resume-entry" style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111827' }}>{degreeLine(e)}</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{range(e.startDate, e.endDate, e.currentlyStudying)}</span>
              </div>
              <div style={{ fontSize: 11.5, color: '#6b7280' }}>{[e.institution, e.location, e.score && `GPA ${e.score}`].filter(Boolean).join(' · ')}</div>
            </div>
          ))}
        </>
      )}

      {has(data.certifications) && (
        <>
          <div className="resume-heading" style={label}>Certifications</div>
          {data.certifications.map((c) => (
            <div key={c.id} className="resume-entry" style={card}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111827' }}>{c.name}</span>
              <div style={{ fontSize: 11.5, color: '#6b7280' }}>{certMeta(c)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.courses) && (
        <>
          <div className="resume-heading" style={label}>Courses &amp; Training</div>
          {data.courses.map((c) => (
            <div key={c.id} className="resume-entry" style={card}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111827' }}>{c.name}</span>
              <div style={{ fontSize: 11.5, color: '#6b7280' }}>{courseMeta(c)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.languages) && (
        <>
          <div className="resume-heading" style={label}>Languages</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.languages.map((l) => <span key={l.id} style={chip}>{languageLabel(l)}</span>)}
          </div>
        </>
      )}

      {has(data.publications) && (
        <>
          <div className="resume-heading" style={label}>Publications</div>
          {data.publications.map((p) => (
            <div key={p.id} className="resume-entry" style={card}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111827' }}>{p.title}</span>
              <div style={{ fontSize: 11.5, color: '#6b7280' }}>{pubMeta(p)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.volunteer) && (
        <>
          <div className="resume-heading" style={label}>Volunteer Experience</div>
          {data.volunteer.map((v) => (
            <div key={v.id} className="resume-entry" style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{v.role}</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{range(v.startDate, v.endDate, v.currentlyVolunteering)}</span>
              </div>
              <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{v.organization}</div>
              <ul style={{ margin: '5px 0 0', paddingLeft: 17, color: '#4b5563' }}>
                {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {has(data.awards) && (
        <>
          <div className="resume-heading" style={label}>Awards &amp; Honors</div>
          {data.awards.map((a) => (
            <div key={a.id} className="resume-entry" style={card}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#111827' }}>{a.name}</span>
              <div style={{ fontSize: 11.5, color: '#6b7280' }}>{awardMeta(a)}</div>
              {a.description && <p style={{ margin: '4px 0 0', color: '#4b5563' }}>{a.description}</p>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
