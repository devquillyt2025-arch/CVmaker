import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, contactItems, range, bullets, degreeLine, has, tint,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel,
} from './shared';

// Template 13 — ELEGANT SERIF: centered italic name, small-caps ornamental sections.
const serif = 'Georgia, "Playfair Display", "Times New Roman", serif';

function Ornament({ title, accent }: { title: string; accent: string }) {
  const line: CSSProperties = { flex: 1, height: 1, background: tint(accent, 0.72) };
  return (
    <div className="resume-heading" style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 11px' }}>
      <span style={line} />
      <span style={{ fontVariant: 'small-caps', fontSize: 15, letterSpacing: 2, color: accent, fontWeight: 700 }}>{title}</span>
      <span style={line} />
    </div>
  );
}

export default function ElegantSerifTemplate({ data, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#7f1d1d';

  return (
    <div style={{ fontFamily: serif, color: '#2b2b2b', padding: '50px 64px', fontSize: 12.5, lineHeight: 1.6 }}>
      <div style={{ textAlign: 'left' }}>
        <h1 style={{ fontSize: 36, fontStyle: 'italic', letterSpacing: 2, color: ACCENT, margin: 0, fontWeight: 500 }}>
          {fullName(contact)}
        </h1>
        {contact.jobTitle && <div style={{ fontSize: 13, fontStyle: 'italic', color: '#555', marginTop: 4 }}>{contact.jobTitle}</div>}
        <div style={{ fontSize: 11.5, color: '#777', marginTop: 8 }}>{contactItems(contact).join('  —  ')}</div>
      </div>

      {data.summary && (
        <>
          <Ornament title="Profile" accent={ACCENT} />
          <p style={{ margin: 0, textAlign: 'left', fontStyle: 'italic', color: '#444' }}>{data.summary}</p>
        </>
      )}

      {has(data.experience) && (
        <>
          <Ornament title="Experience" accent={ACCENT} />
          {data.experience.map((e) => (
            <div key={e.id} className="resume-entry" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700 }}>{e.company}</span>
                <span style={{ fontSize: 11.5, fontStyle: 'italic', color: '#777' }}>{range(e.startDate, e.endDate, e.currentlyWorking)}</span>
              </div>
              <div style={{ fontStyle: 'italic', color: '#555' }}>{[e.position, e.location].filter(Boolean).join(', ')}</div>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {has(data.education) && (
        <>
          <Ornament title="Education" accent={ACCENT} />
          {data.education.map((e) => (
            <div key={e.id} className="resume-entry" style={{ marginBottom: 7, textAlign: 'left' }}>
              <div style={{ fontWeight: 700 }}>{degreeLine(e)}</div>
              <div style={{ fontStyle: 'italic', color: '#555' }}>{[e.institution, e.location].filter(Boolean).join(', ')} · {range(e.startDate, e.endDate, e.currentlyStudying)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.certifications) && (
        <>
          <Ornament title="Certifications" accent={ACCENT} />
          {data.certifications.map((c) => (
            <div key={c.id} className="resume-entry" style={{ marginBottom: 7, textAlign: 'left' }}>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontStyle: 'italic', color: '#555' }}>{certMeta(c)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.projects) && (
        <>
          <Ornament title="Projects" accent={ACCENT} />
          {data.projects.map((p) => (
            <div key={p.id} className="resume-entry" style={{ marginBottom: 9 }}>
              <div style={{ fontWeight: 700 }}>{p.name}{p.url ? <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#777' }}> — {p.url}</span> : null}</div>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {has(data.publications) && (
        <>
          <Ornament title="Publications" accent={ACCENT} />
          {data.publications.map((p) => (
            <div key={p.id} className="resume-entry" style={{ marginBottom: 7, textAlign: 'left' }}>
              <div style={{ fontWeight: 700 }}>{p.title}</div>
              <div style={{ fontStyle: 'italic', color: '#555' }}>{pubMeta(p)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.courses) && (
        <>
          <Ornament title="Courses" accent={ACCENT} />
          {data.courses.map((c) => (
            <div key={c.id} className="resume-entry" style={{ marginBottom: 7, textAlign: 'left' }}>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontStyle: 'italic', color: '#555' }}>{courseMeta(c)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.volunteer) && (
        <>
          <Ornament title="Volunteer Experience" accent={ACCENT} />
          {data.volunteer.map((v) => (
            <div key={v.id} className="resume-entry" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700 }}>{v.organization}</span>
                <span style={{ fontSize: 11.5, fontStyle: 'italic', color: '#777' }}>{range(v.startDate, v.endDate, v.currentlyVolunteering)}</span>
              </div>
              <div style={{ fontStyle: 'italic', color: '#555' }}>{v.role}</div>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {has(data.awards) && (
        <>
          <Ornament title="Awards & Honors" accent={ACCENT} />
          {data.awards.map((a) => (
            <div key={a.id} className="resume-entry" style={{ marginBottom: 7, textAlign: 'left' }}>
              <div style={{ fontWeight: 700 }}>{a.name}</div>
              <div style={{ fontStyle: 'italic', color: '#555' }}>{awardMeta(a)}</div>
              {a.description && <p style={{ margin: '2px 0 0' }}>{a.description}</p>}
            </div>
          ))}
        </>
      )}

      {has(data.languages) && (
        <>
          <Ornament title="Languages" accent={ACCENT} />
          <p style={{ margin: 0, textAlign: 'left', fontStyle: 'italic' }}>{data.languages.map(languageLabel).join(',  ')}</p>
        </>
      )}

      {has(data.skills) && (
        <>
          <Ornament title="Skills" accent={ACCENT} />
          <p style={{ margin: 0, textAlign: 'left', fontStyle: 'italic' }}>{data.skills.map((s) => s.name).join(',  ')}</p>
        </>
      )}
    </div>
  );
}
