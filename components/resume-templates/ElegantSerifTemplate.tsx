import type React from 'react';
import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, contactItems, range, bullets, degreeLine, has, tint, cleanUrl,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel, inOrder, customSections,
} from './shared';

// Template 13 — ELEGANT SERIF: centered italic name, small-caps ornamental sections.
const serif = 'Georgia, "Playfair Display", "Times New Roman", serif';
// Italic is kept for short labels (role, dates, meta); long running text stays
// roman, since paragraphs of italic serif are tiring to read.
const DATE: CSSProperties = { fontSize: 11.5, fontStyle: 'italic', color: '#555', whiteSpace: 'nowrap' };

/** Bold title with dates pinned right on the same line. */
function TitleRow({ title, dates }: { title: React.ReactNode; dates?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
      <span style={{ fontWeight: 700 }}>{title}</span>
      {dates && <span style={DATE}>{dates}</span>}
    </div>
  );
}

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

export default function ElegantSerifTemplate({ data, sectionOrder, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#7f1d1d';

  return (
    <div style={{ fontFamily: serif, color: '#2b2b2b', padding: '50px 64px', fontSize: 12.5, lineHeight: 1.6 }}>
      <div style={{ textAlign: 'left' }}>
        <h1 style={{ fontSize: 36, fontStyle: 'italic', letterSpacing: 2, color: ACCENT, margin: 0, fontWeight: 500 }}>
          {fullName(contact)}
        </h1>
        {contact.jobTitle && <div style={{ fontSize: 13, fontStyle: 'italic', color: '#555', marginTop: 4 }}>{contact.jobTitle}</div>}
        <div style={{ fontSize: 11.5, color: '#555', marginTop: 8 }}>{contactItems(contact).join('  —  ')}</div>
      </div>

      {inOrder(sectionOrder, {
        summary: data.summary && (
          <>
            <Ornament title="Profile" accent={ACCENT} />
            <p style={{ margin: 0, textAlign: 'left', color: '#333' }}>{data.summary}</p>
          </>
        ),
        experience: has(data.experience) && (
          <>
            <Ornament title="Experience" accent={ACCENT} />
            {data.experience.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 12 }}>
                <TitleRow title={e.company || e.position} dates={range(e.startDate, e.endDate, e.currentlyWorking)} />
                <div style={{ fontStyle: 'italic', color: '#444' }}>{[e.company && e.position, e.location].filter(Boolean).join(', ')}</div>
                <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                  {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>
        ),
        education: has(data.education) && (
          <>
            <Ornament title="Education" accent={ACCENT} />
            {data.education.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 7, textAlign: 'left' }}>
                <TitleRow title={degreeLine(e) || e.institution} dates={range(e.startDate, e.endDate, e.currentlyStudying)} />
                <div style={{ fontStyle: 'italic', color: '#444' }}>{[degreeLine(e) && e.institution, e.location, e.score && `GPA ${e.score}`].filter(Boolean).join(', ')}</div>
              </div>
            ))}
          </>
        ),
        certifications: has(data.certifications) && (
          <>
            <Ornament title="Certifications" accent={ACCENT} />
            {data.certifications.map((c) => (
              <div key={c.id} className="resume-entry" style={{ marginBottom: 7, textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontStyle: 'italic', color: '#555' }}>{certMeta(c)}</div>
              </div>
            ))}
          </>
        ),
        projects: has(data.projects) && (
          <>
            <Ornament title="Projects" accent={ACCENT} />
            {data.projects.map((p) => (
              <div key={p.id} className="resume-entry" style={{ marginBottom: 9 }}>
                <TitleRow
                  title={<>{p.name}{p.url ? <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#555' }}> — {cleanUrl(p.url)}</span> : null}</>}
                  dates={range(p.startDate, p.endDate)}
                />
                <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                  {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>
        ),
        publications: has(data.publications) && (
          <>
            <Ornament title="Publications" accent={ACCENT} />
            {data.publications.map((p) => (
              <div key={p.id} className="resume-entry" style={{ marginBottom: 7, textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>{p.title}</div>
                <div style={{ fontStyle: 'italic', color: '#555' }}>{pubMeta(p)}</div>
              </div>
            ))}
          </>
        ),
        courses: has(data.courses) && (
          <>
            <Ornament title="Courses" accent={ACCENT} />
            {data.courses.map((c) => (
              <div key={c.id} className="resume-entry" style={{ marginBottom: 7, textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontStyle: 'italic', color: '#555' }}>{courseMeta(c)}</div>
              </div>
            ))}
          </>
        ),
        volunteer: has(data.volunteer) && (
          <>
            <Ornament title="Volunteer Experience" accent={ACCENT} />
            {data.volunteer.map((v) => (
              <div key={v.id} className="resume-entry" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700 }}>{v.organization}</span>
                  <span style={DATE}>{range(v.startDate, v.endDate, v.currentlyVolunteering)}</span>
                </div>
                <div style={{ fontStyle: 'italic', color: '#555' }}>{v.role}</div>
                <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                  {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>
        ),
        awards: has(data.awards) && (
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
        ),
        languages: has(data.languages) && (
          <>
            <Ornament title="Languages" accent={ACCENT} />
            <p style={{ margin: 0, textAlign: 'left' }}>{data.languages.map(languageLabel).join(',  ')}</p>
          </>
        ),
        skills: has(data.skills) && (
          <>
            <Ornament title="Skills" accent={ACCENT} />
            <p style={{ margin: 0, textAlign: 'left' }}>{data.skills.map((s) => s.name).join('  ·  ')}</p>
          </>
        ),
        ...customSections(data, (sec) => (
          <>
            <Ornament title={sec.title} accent={ACCENT} />
            {sec.items.map((it) => (
              <div key={it.id} className="resume-entry" style={{ marginBottom: 7, textAlign: 'left' }}>
                {it.name && <div style={{ fontWeight: 700 }}>{it.name}</div>}
                {it.description && <p style={{ margin: '2px 0 0' }}>{it.description}</p>}
              </div>
            ))}
          </>
        )),
      })}
    </div>
  );
}
