import type { CSSProperties, ReactNode } from 'react';
import { Phone, Mail, MapPin, Link2 } from 'lucide-react';
import {
  TemplateProps, fullName, range, bullets, degreeLine, has, cleanUrl,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel,
} from './shared';

// Template 16 — SIGNATURE HEADER: huge centered name, icon contact row, thin rule
// dividers between sections, solid color bar anchoring the foot of the page.
const sans = '"Segoe UI", system-ui, -apple-system, sans-serif';
const RULE = '#e2e2e2';
const MUTED = '#6b7280';
const BODY = '#374151';

function ContactItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {icon}
      {text}
    </span>
  );
}

export default function SignatureHeaderTemplate({ data, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#3f3f46';
  const heading: CSSProperties = {
    fontSize: 14.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#111',
    margin: '0 0 12px',
  };
  const divider = <div style={{ height: 1, background: RULE, margin: '20px 0' }} />;

  // Icon size, row font size and gap are all kept tight (rather than the more
  // generous sizing used elsewhere) specifically so a full set of contact
  // fields — including a raw pasted profile URL — has the best chance of
  // staying on one centered line instead of wrapping lopsided.
  const contactItems = [
    contact.phone && <ContactItem key="phone" icon={<Phone size={12} color={BODY} />} text={contact.phone} />,
    contact.email && <ContactItem key="email" icon={<Mail size={12} color={BODY} />} text={contact.email} />,
    (contact.city || contact.country) && (
      <ContactItem key="loc" icon={<MapPin size={12} color={BODY} />} text={[contact.city, contact.country].filter(Boolean).join(', ')} />
    ),
    contact.linkedin && <ContactItem key="li" icon={<Link2 size={12} color={BODY} />} text={cleanUrl(contact.linkedin)} />,
    contact.github && <ContactItem key="gh" icon={<Link2 size={12} color={BODY} />} text={cleanUrl(contact.github)} />,
    contact.website && <ContactItem key="web" icon={<Link2 size={12} color={BODY} />} text={cleanUrl(contact.website)} />,
  ].filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'var(--sheet-h)', fontFamily: sans, color: '#1f2937' }}>
      <div style={{ flex: 1, padding: '52px 58px 8px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 34, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0, color: '#111' }}>
            {fullName(contact)}
          </h1>
          {contact.jobTitle && (
            <div style={{ fontSize: 18, color: MUTED, marginTop: 6 }}>{contact.jobTitle}</div>
          )}
          {has(contactItems) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 20px', fontSize: 11.5, color: BODY, marginTop: 18 }}>
              {contactItems}
            </div>
          )}
        </div>
        <div style={{ height: 1, background: RULE, margin: '22px 0 4px' }} />

        {data.summary && (
          <>
            <div className="resume-heading" style={{ ...heading, marginTop: 20 }}>About Me</div>
            <p style={{ margin: 0, color: BODY }}>{data.summary}</p>
            {divider}
          </>
        )}

        {has(data.education) && (
          <>
            <div className="resume-heading" style={heading}>Education</div>
            {data.education.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12.5, color: MUTED }}>{[e.institution, range(e.startDate, e.endDate, e.currentlyStudying)].filter(Boolean).join(' | ')}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>{degreeLine(e)}</div>
                {(e.location || e.score) && (
                  <div style={{ fontSize: 12.5, color: MUTED, marginTop: 1 }}>{[e.location, e.score && `GPA ${e.score}`].filter(Boolean).join(' · ')}</div>
                )}
              </div>
            ))}
            {divider}
          </>
        )}

        {has(data.certifications) && (
          <>
            <div className="resume-heading" style={heading}>Certifications</div>
            {data.certifications.map((c) => (
              <div key={c.id} className="resume-entry" style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: MUTED, marginTop: 1 }}>{certMeta(c)}</div>
              </div>
            ))}
            {divider}
          </>
        )}

        {has(data.experience) && (
          <>
            <div className="resume-heading" style={heading}>Work Experience</div>
            {data.experience.map((e) => (
              <div key={e.id} className="resume-entry" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12.5, color: MUTED }}>{[e.company, range(e.startDate, e.endDate, e.currentlyWorking)].filter(Boolean).join(' | ')}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>{e.position}</div>
                {e.location && <div style={{ fontSize: 12.5, color: MUTED, marginTop: 1 }}>{e.location}</div>}
                <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: BODY }}>
                  {bullets(e.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
            {divider}
          </>
        )}

        {has(data.projects) && (
          <>
            <div className="resume-heading" style={heading}>Projects</div>
            {data.projects.map((p) => (
              <div key={p.id} className="resume-entry" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: 14.5 }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: MUTED }}>{range(p.startDate, p.endDate)}</span>
                </div>
                {p.url && <div style={{ fontSize: 12.5, color: MUTED }}>{p.url}</div>}
                <ul style={{ margin: '4px 0 0', paddingLeft: 18, color: BODY }}>
                  {bullets(p.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
            {divider}
          </>
        )}

        {has(data.publications) && (
          <>
            <div className="resume-heading" style={heading}>Publications</div>
            {data.publications.map((p) => (
              <div key={p.id} className="resume-entry" style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{p.title}</div>
                <div style={{ fontSize: 12.5, color: MUTED, marginTop: 1 }}>{pubMeta(p)}</div>
              </div>
            ))}
            {divider}
          </>
        )}

        {has(data.courses) && (
          <>
            <div className="resume-heading" style={heading}>Courses &amp; Training</div>
            {data.courses.map((c) => (
              <div key={c.id} className="resume-entry" style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: MUTED, marginTop: 1 }}>{courseMeta(c)}</div>
              </div>
            ))}
            {divider}
          </>
        )}

        {has(data.volunteer) && (
          <>
            <div className="resume-heading" style={heading}>Volunteer Experience</div>
            {data.volunteer.map((v) => (
              <div key={v.id} className="resume-entry" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12.5, color: MUTED }}>{[v.organization, range(v.startDate, v.endDate, v.currentlyVolunteering)].filter(Boolean).join(' | ')}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>{v.role}</div>
                <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: BODY }}>
                  {bullets(v.description).map((b, i) => <li key={i} style={{ marginBottom: 2 }}>{b}</li>)}
                </ul>
              </div>
            ))}
            {divider}
          </>
        )}

        {has(data.awards) && (
          <>
            <div className="resume-heading" style={heading}>Awards &amp; Honors</div>
            {data.awards.map((a) => (
              <div key={a.id} className="resume-entry" style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{a.name}</div>
                <div style={{ fontSize: 12.5, color: MUTED, marginTop: 1 }}>{awardMeta(a)}</div>
                {a.description && <p style={{ margin: '3px 0 0', color: BODY }}>{a.description}</p>}
              </div>
            ))}
            {divider}
          </>
        )}

        {has(data.languages) && (
          <>
            <div className="resume-heading" style={heading}>Languages</div>
            <p style={{ margin: 0, color: BODY }}>{data.languages.map(languageLabel).join('  ·  ')}</p>
            {divider}
          </>
        )}

        {has(data.skills) && (
          <>
            <div className="resume-heading" style={heading}>Skills</div>
            <ul style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: 24, rowGap: 6,
              margin: 0, padding: 0, listStyle: 'none', color: BODY,
            }}>
              {data.skills.map((s) => (
                <li key={s.id} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#111', flexShrink: 0 }} />
                  {s.name}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Signature bar anchoring the foot of the page. */}
      <div style={{ height: 26, background: ACCENT, flexShrink: 0 }} />
    </div>
  );
}
