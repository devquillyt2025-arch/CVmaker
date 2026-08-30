import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, contactItems, range, bullets, degreeLine, has, tint,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel,
} from './shared';

// Template 10 — TIMELINE LEFT: vertical timeline with dots for experience.
const sans = '"Segoe UI", system-ui, -apple-system, sans-serif';

export default function TimelineLeftTemplate({ data, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#6366f1';
  const CHIP_BG = tint(ACCENT, 0.88);
  const label: CSSProperties = { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: ACCENT, margin: '0 0 9px' };
  const hasMore = has(data.certifications) || has(data.languages);

  return (
    <div style={{ fontFamily: sans, color: '#1f2937', padding: '36px 44px', fontSize: 12.5, lineHeight: 1.5 }}>
      <div style={{ marginBottom: 6 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>{fullName(contact)}</h1>
        {contact.jobTitle && <div style={{ fontSize: 13, color: '#6b7280' }}>{contact.jobTitle}</div>}
        <div style={{ height: 3, width: 64, background: ACCENT, margin: '8px 0' }} />
        <div style={{ fontSize: 11, color: '#9ca3af' }}>{contactItems(contact).join('  ·  ')}</div>
      </div>

      {data.summary && <p style={{ margin: '10px 0 18px', color: '#4b5563' }}>{data.summary}</p>}

      {/* Skills + Education grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, marginBottom: hasMore ? 14 : 20 }}>
        {has(data.skills) && (
          <div>
            <div className="resume-heading" style={label}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {data.skills.map((s) => (
                <span key={s.id} style={{ fontSize: 11, background: CHIP_BG, color: ACCENT, borderRadius: 4, padding: '2px 8px' }}>{s.name}</span>
              ))}
            </div>
          </div>
        )}
        {has(data.education) && (
          <div>
            <div className="resume-heading" style={label}>Education</div>
            {data.education.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{degreeLine(e)}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{e.institution}</div>
                <div style={{ fontSize: 10.5, color: '#9ca3af' }}>{range(e.startDate, e.endDate, e.currentlyStudying)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasMore && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, marginBottom: 20 }}>
          {has(data.certifications) && (
            <div>
              <div className="resume-heading" style={label}>Certifications</div>
              {data.certifications.map((c) => (
                <div key={c.id} className="resume-entry" style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 10.5, color: '#9ca3af' }}>{certMeta(c)}</div>
                </div>
              ))}
            </div>
          )}
          {has(data.languages) && (
            <div>
              <div className="resume-heading" style={label}>Languages</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {data.languages.map((l) => (
                  <span key={l.id} style={{ fontSize: 11, background: CHIP_BG, color: ACCENT, borderRadius: 4, padding: '2px 8px' }}>{languageLabel(l)}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timeline experience */}
      {has(data.experience) && (
        <>
          <div className="resume-heading" style={label}>Career Timeline</div>
          <div style={{ position: 'relative', borderLeft: `2px solid ${ACCENT}`, marginLeft: 5, paddingLeft: 22 }}>
            {data.experience.map((e) => (
              <div key={e.id} className="resume-entry" style={{ position: 'relative', marginBottom: 16 }}>
                <span style={{ position: 'absolute', left: -29, top: 3, width: 12, height: 12, borderRadius: '50%', background: '#fff', border: `3px solid ${ACCENT}` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{e.position}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{range(e.startDate, e.endDate, e.currentlyWorking)}</span>
                </div>
                <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{[e.company, e.location].filter(Boolean).join(' · ')}</div>
                <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#475569' }}>
                  {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {has(data.volunteer) && (
        <>
          <div className="resume-heading" style={{ ...label, marginTop: 18 }}>Volunteer Experience</div>
          <div style={{ position: 'relative', borderLeft: `2px solid ${ACCENT}`, marginLeft: 5, paddingLeft: 22 }}>
            {data.volunteer.map((v) => (
              <div key={v.id} className="resume-entry" style={{ position: 'relative', marginBottom: 16 }}>
                <span style={{ position: 'absolute', left: -29, top: 3, width: 12, height: 12, borderRadius: '50%', background: '#fff', border: `3px solid ${ACCENT}` }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{v.role}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{range(v.startDate, v.endDate, v.currentlyVolunteering)}</span>
                </div>
                <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700 }}>{v.organization}</div>
                <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#475569' }}>
                  {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {has(data.projects) && (
        <>
          <div className="resume-heading" style={{ ...label, marginTop: 18 }}>Projects</div>
          {data.projects.map((p) => (
            <div key={p.id} className="resume-entry" style={{ marginBottom: 9 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.name} {p.url && <span style={{ fontSize: 10.5, color: ACCENT, fontWeight: 400 }}>· {p.url}</span>}</div>
              <ul style={{ margin: '3px 0 0', paddingLeft: 17, color: '#475569' }}>
                {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {has(data.courses) && (
        <>
          <div className="resume-heading" style={{ ...label, marginTop: 18 }}>Courses &amp; Training</div>
          {data.courses.map((c) => (
            <div key={c.id} className="resume-entry" style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>{courseMeta(c)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.publications) && (
        <>
          <div className="resume-heading" style={{ ...label, marginTop: 18 }}>Publications</div>
          {data.publications.map((p) => (
            <div key={p.id} className="resume-entry" style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{p.title}</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>{pubMeta(p)}</div>
            </div>
          ))}
        </>
      )}

      {has(data.awards) && (
        <>
          <div className="resume-heading" style={{ ...label, marginTop: 18 }}>Awards &amp; Honors</div>
          {data.awards.map((a) => (
            <div key={a.id} className="resume-entry" style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>{awardMeta(a)}</div>
              {a.description && <p style={{ margin: '2px 0 0', color: '#475569' }}>{a.description}</p>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
