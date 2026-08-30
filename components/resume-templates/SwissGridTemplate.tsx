import type { CSSProperties } from 'react';
import {
  TemplateProps, contactItems, range, bullets, degreeLine, has,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel,
} from './shared';

// Template 5 — SWISS GRID: stacked giant name, 3-col grid, date-column experience, crimson accents.
const sans = '"Helvetica Neue", Helvetica, Arial, sans-serif';

export default function SwissGridTemplate({ data, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#e11d48';
  const head: CSSProperties = {
    fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#111',
    borderBottom: `1.5px solid ${ACCENT}`, paddingBottom: 3, marginBottom: 9,
  };
  const hasMore = has(data.certifications) || has(data.languages) || has(data.courses);

  return (
    <div style={{ fontFamily: sans, color: '#111', padding: '40px 46px', fontSize: 12, lineHeight: 1.5 }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1.5px solid #111', paddingBottom: 14 }}>
        <h1 style={{ fontSize: 50, fontWeight: 900, lineHeight: 0.92, margin: 0, letterSpacing: -1 }}>
          {contact.firstName || 'Your'}<br />{contact.lastName || 'Name'}
        </h1>
        <div style={{ textAlign: 'right', fontSize: 11, color: '#444', maxWidth: 230 }}>
          {contact.jobTitle && <div style={{ fontWeight: 700, color: ACCENT, marginBottom: 4 }}>{contact.jobTitle}</div>}
          {contactItems(contact).map((c, i) => <div key={i}>{c}</div>)}
        </div>
      </div>

      {data.summary && <p style={{ margin: '14px 0 18px', maxWidth: '78%' }}>{data.summary}</p>}

      {/* 3-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22, marginBottom: hasMore ? 16 : 20 }}>
        {has(data.skills) && (
          <div>
            <div className="resume-heading" style={head}>Skills</div>
            {data.skills.map((s) => <div key={s.id} style={{ marginBottom: 3 }}>{s.name}</div>)}
          </div>
        )}
        {has(data.education) && (
          <div>
            <div className="resume-heading" style={head}>Education</div>
            {data.education.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>{degreeLine(e)}</div>
                <div style={{ color: '#555' }}>{e.institution}</div>
                <div style={{ color: '#888', fontSize: 11 }}>{range(e.startDate, e.endDate, e.currentlyStudying)}</div>
              </div>
            ))}
          </div>
        )}
        {has(data.projects) && (
          <div>
            <div className="resume-heading" style={head}>Projects</div>
            {data.projects.map((p) => (
              <div key={p.id} className="resume-entry" style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                {p.url && <div style={{ color: '#888', fontSize: 11 }}>{p.url}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {hasMore && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 22, marginBottom: 20 }}>
          {has(data.certifications) && (
            <div>
              <div className="resume-heading" style={head}>Certifications</div>
              {data.certifications.map((c) => (
                <div key={c.id} className="resume-entry" style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ color: '#888', fontSize: 11 }}>{certMeta(c)}</div>
                </div>
              ))}
            </div>
          )}
          {has(data.languages) && (
            <div>
              <div className="resume-heading" style={head}>Languages</div>
              {data.languages.map((l) => <div key={l.id} style={{ marginBottom: 3 }}>{languageLabel(l)}</div>)}
            </div>
          )}
          {has(data.courses) && (
            <div>
              <div className="resume-heading" style={head}>Courses</div>
              {data.courses.map((c) => (
                <div key={c.id} className="resume-entry" style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ color: '#888', fontSize: 11 }}>{courseMeta(c)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Date-aligned experience */}
      {has(data.experience) && (
        <>
          <div className="resume-heading" style={head}>Experience</div>
          {data.experience.map((e) => (
            <div key={e.id} className="resume-entry" style={{ display: 'flex', gap: 18, marginBottom: 13 }}>
              <div style={{ width: 120, flexShrink: 0, textAlign: 'right', fontSize: 11, color: '#888', paddingTop: 1 }}>
                {range(e.startDate, e.endDate, e.currentlyWorking)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{e.position}</div>
                <div style={{ color: ACCENT, fontWeight: 700, fontSize: 12 }}>{[e.company, e.location].filter(Boolean).join(', ')}</div>
                <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
                  {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </>
      )}

      {has(data.volunteer) && (
        <>
          <div className="resume-heading" style={{ ...head, marginTop: has(data.experience) ? 7 : 0 }}>Volunteer Experience</div>
          {data.volunteer.map((v) => (
            <div key={v.id} className="resume-entry" style={{ display: 'flex', gap: 18, marginBottom: 13 }}>
              <div style={{ width: 120, flexShrink: 0, textAlign: 'right', fontSize: 11, color: '#888', paddingTop: 1 }}>
                {range(v.startDate, v.endDate, v.currentlyVolunteering)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{v.role}</div>
                <div style={{ color: ACCENT, fontWeight: 700, fontSize: 12 }}>{v.organization}</div>
                <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
                  {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </>
      )}

      {(has(data.publications) || has(data.awards)) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 7 }}>
          {has(data.publications) && (
            <div>
              <div className="resume-heading" style={head}>Publications</div>
              {data.publications.map((p) => (
                <div key={p.id} className="resume-entry" style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>{p.title}</div>
                  <div style={{ color: '#888', fontSize: 11 }}>{pubMeta(p)}</div>
                </div>
              ))}
            </div>
          )}
          {has(data.awards) && (
            <div>
              <div className="resume-heading" style={head}>Awards</div>
              {data.awards.map((a) => (
                <div key={a.id} className="resume-entry" style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>{a.name}</div>
                  <div style={{ color: '#888', fontSize: 11 }}>{awardMeta(a)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
