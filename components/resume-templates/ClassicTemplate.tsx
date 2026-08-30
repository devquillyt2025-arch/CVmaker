import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, contactItems, range, bullets, degreeLine, has,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel,
} from './shared';

// Template 1 — CLASSIC: single column, centered serif, all-caps ruled sections, no color.
// Deliberately monochrome — the Harvard-style formality is the point, so this
// template ignores the accent picker rather than tinting away its neutrality.
const serif = 'Georgia, "Times New Roman", Times, serif';

export default function ClassicTemplate({ data }: TemplateProps) {
  const { contact } = data;
  const sectionTitle: CSSProperties = {
    fontFamily: serif,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'left',
    fontWeight: 700,
    color: '#111',
    borderTop: '1px solid #111',
    borderBottom: '1px solid #111',
    padding: '4px 0',
    margin: '18px 0 10px',
  };
  const role: CSSProperties = { fontSize: 13, fontWeight: 700, color: '#111' };
  const meta: CSSProperties = { fontSize: 12, color: '#333', fontStyle: 'italic' };

  return (
    <div style={{ fontFamily: serif, color: '#111', padding: '44px 56px', fontSize: 12.5, lineHeight: 1.5 }}>
      <div style={{ textAlign: 'left', marginBottom: 4 }}>
        <h1 style={{ fontFamily: serif, fontSize: 30, fontWeight: 400, letterSpacing: 1, margin: 0 }}>
          {fullName(contact)}
        </h1>
        {contact.jobTitle && <div style={{ fontSize: 13, color: '#333', marginTop: 4 }}>{contact.jobTitle}</div>}
        <div style={{ fontSize: 11.5, color: '#333', marginTop: 6 }}>{contactItems(contact).join('  |  ')}</div>
      </div>

      {data.summary && (
        <>
          <div className="resume-heading" style={sectionTitle}>Summary</div>
          <p style={{ margin: 0, textAlign: 'justify' }}>{data.summary}</p>
        </>
      )}

      {has(data.skills) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Skills</div>
          <p style={{ margin: 0, textAlign: 'left' }}>{data.skills.map((s) => s.name).join(', ')}</p>
        </>
      )}

      {has(data.experience) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Experience</div>
          {data.experience.map((e) => (
            <div key={e.id} className="resume-entry" style={{ marginBottom: 11 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={role}>{e.position}</span>
                <span style={meta}>{range(e.startDate, e.endDate, e.currentlyWorking)}</span>
              </div>
              <div style={meta}>{[e.company, e.location].filter(Boolean).join(', ')}</div>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {has(data.projects) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Projects</div>
          {data.projects.map((p) => (
            <div key={p.id} className="resume-entry" style={{ marginBottom: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={role}>{p.name}</span>
                <span style={meta}>{range(p.startDate, p.endDate)}</span>
              </div>
              {p.url && <div style={{ fontSize: 11.5, color: '#444' }}>{p.url}</div>}
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {has(data.education) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Education</div>
          {data.education.map((e) => (
            <div key={e.id} className="resume-entry" style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={role}>{degreeLine(e)}</span>
                <span style={meta}>{range(e.startDate, e.endDate, e.currentlyStudying)}</span>
              </div>
              <div style={meta}>{[e.institution, e.location, e.score && `GPA ${e.score}`].filter(Boolean).join(', ')}</div>
            </div>
          ))}
        </>
      )}

      {has(data.certifications) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Certifications</div>
          {data.certifications.map((c) => (
            <div key={c.id} className="resume-entry" style={{ marginBottom: 6 }}>
              <span style={role}>{c.name}</span>
              <div style={meta}>{certMeta(c)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.courses) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Courses &amp; Training</div>
          {data.courses.map((c) => (
            <div key={c.id} className="resume-entry" style={{ marginBottom: 6 }}>
              <span style={role}>{c.name}</span>
              <div style={meta}>{courseMeta(c)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.languages) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Languages</div>
          <p style={{ margin: 0 }}>{data.languages.map(languageLabel).join('  |  ')}</p>
        </>
      )}

      {has(data.publications) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Publications</div>
          {data.publications.map((p) => (
            <div key={p.id} className="resume-entry" style={{ marginBottom: 6 }}>
              <span style={role}>{p.title}</span>
              <div style={meta}>{pubMeta(p)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.volunteer) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Volunteer Experience</div>
          {data.volunteer.map((v) => (
            <div key={v.id} className="resume-entry" style={{ marginBottom: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={role}>{v.role}</span>
                <span style={meta}>{range(v.startDate, v.endDate, v.currentlyVolunteering)}</span>
              </div>
              <div style={meta}>{[v.organization, v.location].filter(Boolean).join(', ')}</div>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {has(data.awards) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Awards &amp; Honors</div>
          {data.awards.map((a) => (
            <div key={a.id} className="resume-entry" style={{ marginBottom: 6 }}>
              <span style={role}>{a.name}</span>
              <div style={meta}>{awardMeta(a)}</div>
              {a.description && <p style={{ margin: '2px 0 0' }}>{a.description}</p>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
