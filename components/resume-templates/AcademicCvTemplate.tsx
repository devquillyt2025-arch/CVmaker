import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, range, bullets, degreeLine, has, fmtDate, cleanUrl,
  certMeta, languageLabel, inOrder, customSections, contactEntries, scoreText, toHref,
} from './shared';
import { ContactRow, FitText, Link } from './parts';

// Template 15 — ACADEMIC / CV: long-form, full-width ruled sections, hanging-indent entries.
// Deliberately monochrome — CVs in academia, medicine and law read as formal
// black-and-white documents, so this template ignores the accent picker.
const serif = 'Georgia, "Times New Roman", Times, serif';

const hang: CSSProperties = { paddingLeft: '1.5rem', textIndent: '-1.5rem', marginBottom: 7 };
const dateStyle: CSSProperties = { fontStyle: 'italic', color: '#444', fontSize: 11.5, whiteSpace: 'nowrap', flexShrink: 0 };
const titleRow: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 };
const url: CSSProperties = { overflowWrap: 'anywhere' };

export default function AcademicCvTemplate({ data, sectionOrder }: TemplateProps) {
  const { contact } = data;
  const sectionTitle: CSSProperties = {
    fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
    borderBottom: '1px solid #000', paddingBottom: 3, margin: '18px 0 9px',
  };

  return (
    <div style={{ fontFamily: serif, color: '#111', padding: '44px 56px', fontSize: 12, lineHeight: 1.5 }}>
      <FitText as="h1" size={24} wrap style={{ fontWeight: 700, margin: 0 }}>{fullName(contact)}</FitText>
      {contact.jobTitle && <div style={{ fontSize: 13, color: '#333' }}>{contact.jobTitle}</div>}
      {/* One wrapped line rather than a stacked list: the stack spent five lines of
          the page's most valuable space on contact details. */}
      <ContactRow
        items={contactEntries(contact)}
        sep={<span style={{ color: '#999', margin: '0 4px' }}>|</span>}
        style={{ fontSize: 11.5, color: '#333', marginTop: 6 }}
      />

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
                <div style={titleRow}>
                  <span><strong>{degreeLine(e) || e.institution}</strong>{degreeLine(e) && e.institution ? `, ${e.institution}` : ''}</span>
                  <span style={dateStyle}>{range(e.startDate, e.endDate, e.currentlyStudying)}</span>
                </div>
                {(e.location || e.score) && (
                  <div style={{ fontSize: 11.5, color: '#444' }}>{[e.location, scoreText(e.score)].filter(Boolean).join(' · ')}</div>
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
                {p.coAuthors ? `${p.coAuthors}. ` : ''}&ldquo;{p.title}.&rdquo; <em>{p.publisher}</em>{p.date ? `, ${fmtDate(p.date)}` : ''}.
                {p.url && <> <Link href={toHref(p.url)} style={url}>{cleanUrl(p.url)}</Link></>}
              </div>
            ))}
          </>
        ),
        experience: has(data.experience) && (
          <>
            <div className="resume-heading" style={sectionTitle}>Work Experience</div>
            {data.experience.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 10 }}>
                <div style={titleRow}>
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
                <div style={titleRow}>
                  <span><strong>{p.name}</strong></span>
                  <span style={dateStyle}>{range(p.startDate, p.endDate)}</span>
                </div>
                {p.url && <div style={{ fontSize: 11.5, color: '#444', ...url }}><Link href={toHref(p.url)}>{cleanUrl(p.url)}</Link></div>}
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
                <strong>{v.role || v.organization}</strong>
                {[v.role && v.organization, v.location].filter(Boolean).map((s) => `, ${s}`).join('')}
                {range(v.startDate, v.endDate, v.currentlyVolunteering) && `. ${range(v.startDate, v.endDate, v.currentlyVolunteering)}`}
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
