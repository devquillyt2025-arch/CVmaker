import type { CSSProperties } from 'react';
import {
  TemplateProps, fullName, initials, range, bullets, degreeLine, has, tint, cleanUrl, toHref, contactEntries,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel, inOrder, customSections, TRACKING,
} from './shared';
import { FitText, Link, Monogram } from './parts';

// Template 2 — SIDEBAR DARK: 30% navy sidebar + 70% white content.
const sans = '"Segoe UI", system-ui, -apple-system, Roboto, sans-serif';
const NAVY = '#1e293b';
const titleRow: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 };
const dates: CSSProperties = { fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', flexShrink: 0 };

export default function SidebarDarkTemplate({ data, sectionOrder, accentColor }: TemplateProps) {
  const { contact } = data;
  const contacts = contactEntries(contact);
  const ACCENT = accentColor || '#2563eb';
  // Sidebar text sits on the dark navy panel, so it needs a lightened tone of
  // the accent to stay legible — the raw accent is reserved for the white main
  // column, where it already has enough contrast.
  const ACCENT_ON_DARK = tint(ACCENT, 0.55);
  const sideLabel: CSSProperties = {
    color: ACCENT_ON_DARK, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: TRACKING,
    margin: '18px 0 7px', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 4,
  };
  const mainLabel: CSSProperties = {
    color: NAVY, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: TRACKING,
    borderBottom: `2px solid ${ACCENT}`, paddingBottom: 3, margin: '18px 0 9px',
  };

  return (
    <div data-bleed style={{ display: 'flex', fontFamily: sans, minHeight: 'var(--sheet-h)', color: '#111' }}>
      {/* Print only: carries the sidebar colour to the foot of every printed page. */}
      <div className="resume-print-bg" aria-hidden style={{ left: 0, width: '32%', background: NAVY }} />
      {/* Sidebar */}
      <div style={{ width: '32%', background: NAVY, color: '#e2e8f0', padding: '34px 22px' }}>
        <Monogram text={initials(contact)} size={84} background={ACCENT} />
        {/* Breaks only between words: a hyphenated surname split over two lines
            reads as two names to a parser. Shrinks instead if one word is too wide. */}
        <FitText as="h1" size={20} wrap style={{ fontWeight: 700, color: '#fff', textAlign: 'center', margin: 0, lineHeight: 1.2 }}>
          {fullName(contact)}
        </FitText>
        {contact.jobTitle && <div style={{ textAlign: 'center', color: ACCENT_ON_DARK, fontSize: 12, marginTop: 4 }}>{contact.jobTitle}</div>}

        {has(contacts) && <div className="resume-heading" style={sideLabel}>Contact</div>}
        {/* Location may wrap; an email or URL shrinks to one line instead, since
            a wrapped address can't be read back as one by a parser. */}
        {contacts.map((c) => (c.key === 'location'
          ? <div key={c.key} style={{ fontSize: 11, marginBottom: 5 }}>{c.text}</div>
          : <FitText key={c.key} size={11} style={{ marginBottom: 5 }}><Link href={c.href}>{c.text}</Link></FitText>
        ))}

        {inOrder(sectionOrder, {
          skills: has(data.skills) && (
            <>
              <div className="resume-heading" style={sideLabel}>Skills</div>
              {data.skills.map((s) => <div key={s.id} style={{ fontSize: 11.5, marginBottom: 5 }}>{s.name}</div>)}
            </>
          ),
          education: has(data.education) && (
            <>
              <div className="resume-heading" style={sideLabel}>Education</div>
              {data.education.map((e) => (
                <div key={e.id} className="resume-entry" style={{ marginBottom: 9 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#fff' }}>{degreeLine(e) || e.institution}</div>
                  {degreeLine(e) && e.institution && <div style={{ fontSize: 10.5 }}>{e.institution}</div>}
                  <div style={{ fontSize: 10.5, color: '#b6c2d1' }}>{range(e.startDate, e.endDate, e.currentlyStudying)}</div>
                </div>
              ))}
            </>
          ),
          certifications: has(data.certifications) && (
            <>
              <div className="resume-heading" style={sideLabel}>Certifications</div>
              {data.certifications.map((c) => (
                <div key={c.id} className="resume-entry" style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{c.name}</div>
                  <div style={{ fontSize: 10.5, color: '#b6c2d1' }}>{certMeta(c)}</div>
                </div>
              ))}
            </>
          ),
          languages: has(data.languages) && (
            <>
              <div className="resume-heading" style={sideLabel}>Languages</div>
              {data.languages.map((l) => <div key={l.id} style={{ fontSize: 11, marginBottom: 4 }}>{languageLabel(l)}</div>)}
            </>
          ),
        })}
      </div>

      {/* Main */}
      <div style={{ width: '68%', padding: '34px 30px', fontSize: 12.5, lineHeight: 1.5 }}>
        {inOrder(sectionOrder, {
          summary: data.summary && (
            <>
              <div className="resume-heading" style={mainLabel}>Profile</div>
              <p style={{ margin: 0, color: '#334155' }}>{data.summary}</p>
            </>
          ),
          experience: has(data.experience) && (
            <>
              <div className="resume-heading" style={mainLabel}>Experience</div>
              {data.experience.map((e) => (
                <div key={e.id} className="resume-entry" style={{ marginBottom: 12 }}>
                  <div style={titleRow}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{e.position || e.company}</span>
                    <span style={dates}>{range(e.startDate, e.endDate, e.currentlyWorking)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{[e.position && e.company, e.location].filter(Boolean).join(' · ')}</div>
                  <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#334155' }}>
                    {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          ),
          projects: has(data.projects) && (
            <>
              <div className="resume-heading" style={mainLabel}>Projects</div>
              {data.projects.map((p) => (
                <div key={p.id} className="resume-entry" style={{ marginBottom: 10 }}>
                  <div style={titleRow}>
                    <span style={{ fontSize: 12.5, fontWeight: 700 }}>{p.name}</span>
                    <span style={dates}>{range(p.startDate, p.endDate)}</span>
                  </div>
                  {p.url && <div style={{ fontSize: 11, color: ACCENT, overflowWrap: 'anywhere' }}><Link href={toHref(p.url)}>{cleanUrl(p.url)}</Link></div>}
                  <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#334155' }}>
                    {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          ),
          courses: has(data.courses) && (
            <>
              <div className="resume-heading" style={mainLabel}>Courses &amp; Training</div>
              {data.courses.map((c) => (
                <div key={c.id} className="resume-entry" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>{c.name}</span>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{courseMeta(c)}</div>
                </div>
              ))}
            </>
          ),
          publications: has(data.publications) && (
            <>
              <div className="resume-heading" style={mainLabel}>Publications</div>
              {data.publications.map((p) => (
                <div key={p.id} className="resume-entry" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>{p.title}</span>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{pubMeta(p)}</div>
                </div>
              ))}
            </>
          ),
          volunteer: has(data.volunteer) && (
            <>
              <div className="resume-heading" style={mainLabel}>Volunteer Experience</div>
              {data.volunteer.map((v) => (
                <div key={v.id} className="resume-entry" style={{ marginBottom: 10 }}>
                  <div style={titleRow}>
                    <span style={{ fontSize: 12.5, fontWeight: 700 }}>{v.role || v.organization}</span>
                    <span style={dates}>{range(v.startDate, v.endDate, v.currentlyVolunteering)}</span>
                  </div>
                  {v.role && v.organization && <div style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{v.organization}</div>}
                  <ul style={{ margin: '4px 0 0', paddingLeft: 17, color: '#334155' }}>
                    {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          ),
          awards: has(data.awards) && (
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
          ),
          ...customSections(data, (sec) => (
            <>
              <div className="resume-heading" style={mainLabel}>{sec.title}</div>
              {sec.items.map((it) => (
                <div key={it.id} className="resume-entry" style={{ marginBottom: 8 }}>
                  {it.name && <span style={{ fontSize: 12.5, fontWeight: 700 }}>{it.name}</span>}
                  {it.description && <p style={{ margin: '2px 0 0', color: '#334155' }}>{it.description}</p>}
                </div>
              ))}
            </>
          )),
        })}
      </div>
    </div>
  );
}
