import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, initials, range, bullets, degreeLine, has, tint, cleanUrl,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel,
} from './shared';

// Template 2 — SIDEBAR DARK: 30% navy sidebar + 70% white content.
const sans = '"Segoe UI", system-ui, -apple-system, Roboto, sans-serif';
const NAVY = '#1e293b';

export default function SidebarDarkTemplate({ data, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#2563eb';
  // Sidebar text sits on the dark navy panel, so it needs a lightened tone of
  // the accent to stay legible — the raw accent is reserved for the white main
  // column, where it already has enough contrast.
  const ACCENT_ON_DARK = tint(ACCENT, 0.55);
  const sideLabel: CSSProperties = {
    color: ACCENT_ON_DARK, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2,
    margin: '18px 0 7px', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 4,
  };
  const mainLabel: CSSProperties = {
    color: NAVY, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
    borderBottom: `2px solid ${ACCENT}`, paddingBottom: 3, margin: '18px 0 9px',
  };

  return (
    <div style={{ display: 'flex', fontFamily: sans, minHeight: 'var(--sheet-h)', color: '#111' }}>
      {/* Sidebar */}
      <div style={{ width: '32%', background: NAVY, color: '#e2e8f0', padding: '34px 22px' }}>
        <div style={{
          width: 84, height: 84, borderRadius: '50%', background: ACCENT, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 800,
          margin: '0 auto 14px',
        }}>{initials(contact)}</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', textAlign: 'center', margin: 0, lineHeight: 1.2 }}>
          {fullName(contact)}
        </h1>
        {contact.jobTitle && <div style={{ textAlign: 'center', color: ACCENT_ON_DARK, fontSize: 12, marginTop: 4 }}>{contact.jobTitle}</div>}

        <div className="resume-heading" style={sideLabel}>Contact</div>
        {[contact.email, contact.phone, [contact.city, contact.country].filter(Boolean).join(', '), cleanUrl(contact.linkedin), cleanUrl(contact.github), cleanUrl(contact.website)].filter(Boolean).map((c, i) => (
          <div key={i} style={{ fontSize: 11, marginBottom: 5, wordBreak: 'break-word' }}>{c}</div>
        ))}

        {has(data.skills) && (
          <>
            <div className="resume-heading" style={sideLabel}>Skills</div>
            {data.skills.map((s) => <div key={s.id} style={{ fontSize: 11.5, marginBottom: 5 }}>{s.name}</div>)}
          </>
        )}

        {has(data.education) && (
          <>
            <div className="resume-heading" style={sideLabel}>Education</div>
            {data.education.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 9 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#fff' }}>{degreeLine(e)}</div>
                <div style={{ fontSize: 10.5 }}>{e.institution}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{range(e.startDate, e.endDate, e.currentlyStudying)}</div>
              </div>
            ))}
          </>
        )}

        {has(data.certifications) && (
          <>
            <div className="resume-heading" style={sideLabel}>Certifications</div>
            {data.certifications.map((c) => (
              <div key={c.id} className="resume-entry" style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{c.name}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{certMeta(c)}</div>
              </div>
            ))}
          </>
        )}

        {has(data.languages) && (
          <>
            <div className="resume-heading" style={sideLabel}>Languages</div>
            {data.languages.map((l) => <div key={l.id} style={{ fontSize: 11, marginBottom: 4 }}>{languageLabel(l)}</div>)}
          </>
        )}
      </div>

      {/* Main */}
      <div style={{ width: '68%', padding: '34px 30px', fontSize: 12.5, lineHeight: 1.5 }}>
        {data.summary && (
          <>
            <div className="resume-heading" style={mainLabel}>Profile</div>
            <p style={{ margin: 0, color: '#334155' }}>{data.summary}</p>
          </>
        )}
        {has(data.experience) && (
          <>
            <div className="resume-heading" style={mainLabel}>Experience</div>
            {data.experience.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{e.position}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{range(e.startDate, e.endDate, e.currentlyWorking)}</span>
                </div>
                <div style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{[e.company, e.location].filter(Boolean).join(' · ')}</div>
                <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#334155' }}>
                  {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>
        )}
        {has(data.projects) && (
          <>
            <div className="resume-heading" style={mainLabel}>Projects</div>
            {data.projects.map((p) => (
              <div key={p.id} className="resume-entry" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{range(p.startDate, p.endDate)}</span>
                </div>
                {p.url && <div style={{ fontSize: 11, color: ACCENT }}>{p.url}</div>}
                <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#334155' }}>
                  {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>
        )}
        {has(data.courses) && (
          <>
            <div className="resume-heading" style={mainLabel}>Courses &amp; Training</div>
            {data.courses.map((c) => (
              <div key={c.id} className="resume-entry" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{c.name}</span>
                <div style={{ fontSize: 11, color: '#64748b' }}>{courseMeta(c)}</div>
              </div>
            ))}
          </>
        )}
        {has(data.publications) && (
          <>
            <div className="resume-heading" style={mainLabel}>Publications</div>
            {data.publications.map((p) => (
              <div key={p.id} className="resume-entry" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{p.title}</span>
                <div style={{ fontSize: 11, color: '#64748b' }}>{pubMeta(p)}</div>
              </div>
            ))}
          </>
        )}
        {has(data.volunteer) && (
          <>
            <div className="resume-heading" style={mainLabel}>Volunteer Experience</div>
            {data.volunteer.map((v) => (
              <div key={v.id} className="resume-entry" style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>{v.role}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{range(v.startDate, v.endDate, v.currentlyVolunteering)}</span>
                </div>
                <div style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{v.organization}</div>
                <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#334155' }}>
                  {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>
        )}
        {has(data.awards) && (
          <>
            <div className="resume-heading" style={mainLabel}>Awards &amp; Honors</div>
            {data.awards.map((a) => (
              <div key={a.id} className="resume-entry" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{a.name}</span>
                <div style={{ fontSize: 11, color: '#64748b' }}>{awardMeta(a)}</div>
                {a.description && <p style={{ margin: '2px 0 0', color: '#334155' }}>{a.description}</p>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
