import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, range, bullets, degreeLine, has, fmtDate, cleanUrl,
  certMeta, languageLabel, inOrder, customSections,
} from './shared';

// Template 15 — ACADEMIC / CV: long-form, full-width ruled sections, hanging-indent entries.
// Deliberately monochrome — CVs in academia, medicine and law read as formal
// black-and-white documents, so this template ignores the accent picker.
const serif = 'Georgia, "Times New Roman", Times, serif';

const hang: CSSProperties = { paddingLeft: '1.5rem', textIndent: '-1.5rem', marginBottom: 7 };
const dateStyle: CSSProperties = { fontStyle: 'italic', color: '#444', fontSize: 11.5, whiteSpace: 'nowrap' };

export default function AcademicCvTemplate({ data, sectionOrder }: TemplateProps) {
  const { contact } = data;
  const sectionTitle: CSSProperties = {
    fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
    borderBottom: '1px solid #000', paddingBottom: 3, margin: '18px 0 9px',
  };

  return (
    <div style={{ fontFamily: serif, color: '#111', padding: '44px 56px', fontSize: 12, lineHeight: 1.5 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{fullName(contact)}</h1>
      {contact.jobTitle && <div style={{ fontSize: 13, color: '#333' }}>{contact.jobTitle}</div>}
      {/* One wrapped line rather than a stacked list: the stack spent five lines of
          the page's most valuable space on contact details. */}
      <div style={{ fontSize: 11.5, color: '#333', marginTop: 6, display: 'flex', flexWrap: 'wrap', columnGap: 0, rowGap: 2 }}>
        {[contact.email, contact.phone, [contact.city, contact.country].filter(Boolean).join(', '), cleanUrl(contact.linkedin), cleanUrl(contact.github), cleanUrl(contact.website)].filter(Boolean).map((c, i) => (
          <span key={i} style={{ whiteSpace: 'nowrap' }}>
            {i > 0 && <span style={{ color: '#999', margin: '0 8px' }}>|</span>}
            {c}
          </span>
        ))}
      </div>

      {inOrder(sectionOrder, {
        summary: data.summary && (
          <>
            <div className="resume-heading" style={sectionTitle}>Summary</div>
            <p style={{ margin: 0 }}>{data.summary}</p>
          </>
        ),
        education: has(data.education) && (
          <>
            <div className="resume-heading" style={sectionTitle}>Education</div>
            {data.education.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                  <span><strong>{degreeLine(e) || e.institution}</strong>{degreeLine(e) && e.institution ? `, ${e.institution}` : ''}</span>
                  <span style={dateStyle}>{range(e.startDate, e.endDate, e.currentlyStudying)}</span>
                </div>
                {(e.location || e.score) && (
                  <div style={{ fontSize: 11.5, color: '#444' }}>{[e.location, e.score && `GPA ${e.score}`].filter(Boolean).join(' · ')}</div>
                )}
              </div>
            ))}
          </>
        ),
        publications: has(data.publications) && (
          <>
            <div className="resume-heading" style={sectionTitle}>Publications</div>
            {data.publications!.map((p) => (
              <div key={p.id} className="resume-entry" style={hang}>
                {p.coAuthors ? `${p.coAuthors}. ` : ''}&ldquo;{p.title}.&rdquo; <em>{p.publisher}</em>{p.date ? `, ${fmtDate(p.date)}` : ''}.{p.url ? ` ${p.url}` : ''}
              </div>
            ))}
          </>
        ),
        experience: has(data.experience) && (
          <>
            <div className="resume-heading" style={sectionTitle}>Work Experience</div>
            {data.experience.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span><strong>{e.position || e.company}</strong>{e.position && e.company ? `, ${e.company}` : ''}{e.location && <span style={{ color: '#444' }}>{` — ${e.location}`}</span>}</span>
                  <span style={dateStyle}>{range(e.startDate, e.endDate, e.currentlyWorking)}</span>
                </div>
                <ul style={{ margin: '3px 0 0', paddingLeft: 18 }}>
                  {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>
        ),
        projects: has(data.projects) && (
          <>
            <div className="resume-heading" style={sectionTitle}>Research Projects</div>
            {data.projects.map((p) => (
              <div key={p.id} className="resume-entry" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span><strong>{p.name}</strong></span>
                  <span style={dateStyle}>{range(p.startDate, p.endDate)}</span>
                </div>
                {p.url && <div style={{ fontSize: 11.5, color: '#444' }}>{cleanUrl(p.url)}</div>}
                <ul style={{ margin: '3px 0 0', paddingLeft: 18 }}>
                  {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>
        ),
        courses: has(data.courses) && (
          <>
            <div className="resume-heading" style={sectionTitle}>Teaching &amp; Courses</div>
            {data.courses!.map((c) => (
              <div key={c.id} className="resume-entry" style={hang}>
                <strong>{c.name}</strong>{c.platform ? `, ${c.platform}` : ''}{c.completionDate ? `. ${fmtDate(c.completionDate)}` : ''}
              </div>
            ))}
          </>
        ),
        certifications: has(data.certifications) && (
          <>
            <div className="resume-heading" style={sectionTitle}>Certifications</div>
            {data.certifications.map((c) => (
              <div key={c.id} className="resume-entry" style={hang}>
                <strong>{c.name}</strong>. {certMeta(c)}
              </div>
            ))}
          </>
        ),
        awards: has(data.awards) && (
          <>
            <div className="resume-heading" style={sectionTitle}>Awards &amp; Honors</div>
            {data.awards!.map((a) => (
              <div key={a.id} className="resume-entry" style={hang}>
                <strong>{a.name}</strong>{a.issuer ? `, ${a.issuer}` : ''}{a.date ? ` (${fmtDate(a.date)})` : ''}{a.description ? `. ${a.description}` : ''}
              </div>
            ))}
          </>
        ),
        volunteer: has(data.volunteer) && (
          <>
            <div className="resume-heading" style={sectionTitle}>Service &amp; Volunteering</div>
            {data.volunteer.map((v) => (
              <div key={v.id} className="resume-entry" style={hang}>
                <strong>{v.role}</strong>, {v.organization}{v.location ? `, ${v.location}` : ''}. {range(v.startDate, v.endDate, v.currentlyVolunteering)}
              </div>
            ))}
          </>
        ),
        languages: has(data.languages) && (
          <>
            <div className="resume-heading" style={sectionTitle}>Languages</div>
            <p style={{ margin: 0 }}>{data.languages.map(languageLabel).join('; ')}</p>
          </>
        ),
        skills: has(data.skills) && (
          <>
            <div className="resume-heading" style={sectionTitle}>Technical Skills</div>
            <p style={{ margin: 0 }}>{data.skills.map((s) => s.name).join(', ')}</p>
          </>
        ),
        ...customSections(data, (sec) => (
          <>
            <div className="resume-heading" style={sectionTitle}>{sec.title}</div>
            {sec.items.map((it) => (
              <div key={it.id} className="resume-entry" style={hang}>
                {it.name && <strong>{it.name}</strong>}{it.name && it.description ? '. ' : ''}{it.description}
              </div>
            ))}
          </>
        )),
      })}
    </div>
  );
}
