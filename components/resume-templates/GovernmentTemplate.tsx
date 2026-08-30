import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, range, bullets, degreeLine, has, cleanUrl,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel,
} from './shared';

// Template 11 — GOVERNMENT / FEDERAL: USAJobs-style, serif, ruled name block, structured fields.
// Deliberately monochrome — federal/formal applications expect black-and-white,
// so this template ignores the accent picker rather than tinting away that formality.
const serif = '"Times New Roman", Times, serif';

export default function GovernmentTemplate({ data }: TemplateProps) {
  const { contact } = data;
  const sectionTitle: CSSProperties = {
    fontSize: 13, fontWeight: 700, textTransform: 'uppercase', textDecoration: 'underline',
    margin: '16px 0 8px',
  };
  const cell: CSSProperties = { padding: '2px 8px', border: '1px solid #999', fontSize: 11.5 };

  const contactRows: [string, string][] = [
    ['Email', contact.email || ''],
    ['Phone', contact.phone || ''],
    ['Address', [contact.city, contact.country].filter(Boolean).join(', ')],
    ['LinkedIn', cleanUrl(contact.linkedin)],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div style={{ fontFamily: serif, color: '#000', padding: '44px 54px', fontSize: 12.5, lineHeight: 1.45 }}>
      {/* Name block */}
      <div style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '8px 0', textAlign: 'left', marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{fullName(contact)}</div>
        {contact.jobTitle && <div style={{ fontSize: 12 }}>{contact.jobTitle}</div>}
      </div>

      <div style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12, marginBottom: 6 }}>Contact Information</div>
      <table style={{ borderCollapse: 'collapse', marginBottom: 6 }}>
        <tbody>
          {contactRows.map(([k, v]) => (
            <tr key={k}>
              <td style={{ ...cell, fontWeight: 700, width: 110 }}>{k}</td>
              <td style={cell}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.summary && (
        <>
          <div className="resume-heading" style={sectionTitle}>Professional Summary</div>
          <p style={{ margin: 0, textAlign: 'justify' }}>{data.summary}</p>
        </>
      )}

      {has(data.skills) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Skills</div>
          <p style={{ margin: 0 }}>{data.skills.map((s) => s.name).join('; ')}</p>
        </>
      )}

      {has(data.experience) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Work Experience</div>
          {data.experience.map((e) => (
            <div key={e.id} className="resume-entry" style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>{e.position}</div>
              <div>{[e.company, e.location].filter(Boolean).join(', ')}</div>
              <div style={{ fontSize: 11.5 }}>{range(e.startDate, e.endDate, e.currentlyWorking, true)}</div>
              <div style={{ fontSize: 11.5, fontStyle: 'italic' }}>Hours per week: 40 &nbsp;|&nbsp; Supervisor: Available upon request</div>
              <ul style={{ margin: '4px 0 0', paddingLeft: 20 }}>
                {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {has(data.education) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Education</div>
          {data.education.map((e) => (
            <div key={e.id} className="resume-entry" style={{ marginBottom: 7 }}>
              <div style={{ fontWeight: 700 }}>{degreeLine(e)}</div>
              <div>{[e.institution, e.location].filter(Boolean).join(', ')}</div>
              <div style={{ fontSize: 11.5 }}>{range(e.startDate, e.endDate, e.currentlyStudying, true)}{e.score ? ` · GPA: ${e.score}` : ''}</div>
            </div>
          ))}
        </>
      )}

      {has(data.certifications) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Certifications &amp; Licenses</div>
          {data.certifications.map((c) => (
            <div key={c.id} className="resume-entry" style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontSize: 11.5 }}>{certMeta(c)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.courses) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Training &amp; Courses</div>
          {data.courses.map((c) => (
            <div key={c.id} className="resume-entry" style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontSize: 11.5 }}>{courseMeta(c)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.languages) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Languages</div>
          <p style={{ margin: 0 }}>{data.languages.map(languageLabel).join('; ')}</p>
        </>
      )}

      {has(data.projects) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Relevant Projects</div>
          {data.projects.map((p) => (
            <div key={p.id} className="resume-entry" style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>{p.name}{p.url ? ` (${p.url})` : ''}</div>
              <ul style={{ margin: '4px 0 0', paddingLeft: 20 }}>
                {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {has(data.publications) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Publications</div>
          {data.publications.map((p) => (
            <div key={p.id} className="resume-entry" style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 700 }}>{p.title}</div>
              <div style={{ fontSize: 11.5 }}>{pubMeta(p)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.volunteer) && (
        <>
          <div className="resume-heading" style={sectionTitle}>Volunteer Experience</div>
          {data.volunteer.map((v) => (
            <div key={v.id} className="resume-entry" style={{ marginBottom: 9 }}>
              <div style={{ fontWeight: 700 }}>{v.role}</div>
              <div>{[v.organization, v.location].filter(Boolean).join(', ')}</div>
              <div style={{ fontSize: 11.5 }}>{range(v.startDate, v.endDate, v.currentlyVolunteering, true)}</div>
              <ul style={{ margin: '4px 0 0', paddingLeft: 20 }}>
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
            <div key={a.id} className="resume-entry" style={{ marginBottom: 7 }}>
              <div style={{ fontWeight: 700 }}>{a.name}</div>
              <div style={{ fontSize: 11.5 }}>{awardMeta(a)}</div>
              {a.description && <p style={{ margin: '2px 0 0' }}>{a.description}</p>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
