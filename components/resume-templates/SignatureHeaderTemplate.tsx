import type { CSSProperties, ReactNode } from 'react';
import { Phone, Mail, MapPin, Link2 } from 'lucide-react';
import {
  TemplateProps, fullName, range, bullets, degreeLine, has, cleanUrl, inOrder, customSections,
  certMeta, courseMeta, awardMeta, pubMeta, languageLabel, contactEntries, scoreText, toHref, TRACKING,
} from './shared';
import { FitText, Link } from './parts';

// Template 16 — SIGNATURE HEADER: centered name, icon contact row, accent section
// headings over a hairline rule, and a solid color bar anchoring the foot of the page.
//
// Laid out for how a recruiter actually skims: role title on the left, dates
// right-aligned on the same line, employer and location directly beneath, so the
// left edge reads as a career ladder and the right edge as a timeline. Body type
// sits at ~10pt so a typical resume fits a page without shrinking headings below it.
const sans = '"Segoe UI", system-ui, -apple-system, sans-serif';
const INK = '#111827';
const BODY = '#374151';
const MUTED = '#6b7280';
const RULE = '#e5e7eb';
const BAR_H = 12;

function ContactItem({ icon, text, href }: { icon: ReactNode; text: string; href?: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
      {icon}
      <Link href={href}>{text}</Link>
    </span>
  );
}

/** Title on the left, dates pinned right on the same baseline; subtitle line beneath. */
function EntryHead({ title, dates, sub }: { title?: string; dates?: string; sub?: ReactNode }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: INK, minWidth: 0 }}>{title}</span>
        {dates && (
          <span style={{ fontSize: 12, color: MUTED, whiteSpace: 'nowrap', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{dates}</span>
        )}
      </div>
      {sub && <div style={{ fontSize: 13, color: BODY, marginTop: 1 }}>{sub}</div>}
    </>
  );
}

/** "Stripe · San Francisco, CA" with the organisation emphasised over the place. */
function OrgLine({ org, place }: { org?: string; place?: string }) {
  if (!org && !place) return null;
  return (
    <>
      {org && <span style={{ fontWeight: 600 }}>{org}</span>}
      {org && place && <span style={{ color: MUTED }}>{'  ·  '}</span>}
      {place && <span style={{ color: MUTED }}>{place}</span>}
    </>
  );
}

function Bullets({ text }: { text?: string }) {
  const items = bullets(text);
  if (!items.length) return null;
  return (
    <ul style={{ margin: '5px 0 0', paddingLeft: 17, color: BODY }}>
      {items.map((b, i) => <li key={i} style={{ marginBottom: 2, paddingLeft: 2 }}>{b}</li>)}
    </ul>
  );
}

/** Name in bold followed by muted detail, for one-line items (certs, courses…). */
function NameMeta({ name, meta }: { name: string; meta?: string }) {
  return (
    <div>
      <span style={{ fontWeight: 600, color: INK }}>{name}</span>
      {meta && <span style={{ color: MUTED }}>{'  ·  '}{meta}</span>}
    </div>
  );
}

/** Inline list separated by middots — denser and easier to scan than a bullet grid. */
function InlineList({ items }: { items: string[] }) {
  return (
    <p style={{ margin: 0, color: BODY }}>
      {items.map((s, i) => (
        <span key={i}>
          {i > 0 && <span style={{ color: '#9ca3af' }}>{'  ·  '}</span>}
          {s}
        </span>
      ))}
    </p>
  );
}

export default function SignatureHeaderTemplate({ data, sectionOrder, accentColor }: TemplateProps) {
  const { contact } = data;
  const ACCENT = accentColor || '#3f3f46';
  const heading: CSSProperties = {
    fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: TRACKING, color: ACCENT,
    paddingBottom: 4, borderBottom: `1px solid ${RULE}`, margin: '0 0 10px',
  };
  // Space between entries goes above each one (not below), so the last entry
  // doesn't add to the gap before the next section.
  const entry = (i: number, space = 12): CSSProperties => ({ marginTop: i ? space : 0 });
  const gap = <div style={{ height: 18 }} />;

  const iconProps = { size: 11, color: MUTED, strokeWidth: 2 } as const;
  const ICON = { phone: Phone, email: Mail, location: MapPin } as const;
  const contactItems = contactEntries(contact, ['phone', 'email', 'location', 'linkedin', 'github', 'website']).map((c) => {
    const Icon = ICON[c.key as keyof typeof ICON] ?? Link2;
    return <ContactItem key={c.key} icon={<Icon {...iconProps} />} text={c.text} href={c.href} />;
  });

  // Padding lives on this root (not an inner wrapper) because the Spacing control
  // overrides the root's padding; the foot bar is absolutely positioned so it
  // stays full-bleed whatever padding that control applies.
  return (
    <div style={{
      position: 'relative', minHeight: 'var(--sheet-h)', padding: `44px 54px ${BAR_H + 40}px`,
      fontFamily: sans, fontSize: 13.5, lineHeight: 1.5, color: BODY,
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <FitText as="h1" size={30} wrap style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, lineHeight: 1.15, margin: 0, color: INK }}>
          {fullName(contact)}
        </FitText>
        {contact.jobTitle && (
          <div style={{ fontSize: 15, fontWeight: 500, color: ACCENT, marginTop: 4, letterSpacing: 0.2 }}>{contact.jobTitle}</div>
        )}
        {has(contactItems) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 18px', fontSize: 11.5, color: BODY, marginTop: 12 }}>
            {contactItems}
          </div>
        )}
      </div>
      <div style={{ height: 2, background: ACCENT, margin: '18px 0 20px' }} />

      {inOrder(sectionOrder, {
        summary: data.summary && (
          <>
            <div className="resume-heading" style={heading}>Summary</div>
            <p style={{ margin: 0, color: BODY }}>{data.summary}</p>
          </>
        ),
        education: has(data.education) && (
          <>
            <div className="resume-heading" style={heading}>Education</div>
            {data.education.map((e, i) => (
              <div key={e.id} className="resume-entry" style={entry(i)}>
                <EntryHead
                  title={degreeLine(e) || e.institution}
                  dates={range(e.startDate, e.endDate, e.currentlyStudying)}
                  sub={<OrgLine org={degreeLine(e) ? e.institution : undefined} place={[e.location, scoreText(e.score)].filter(Boolean).join('  ·  ')} />}
                />
              </div>
            ))}
          </>
        ),
        certifications: has(data.certifications) && (
          <>
            <div className="resume-heading" style={heading}>Certifications</div>
            {data.certifications.map((c, i) => (
              <div key={c.id} className="resume-entry" style={entry(i, 4)}>
                <NameMeta name={c.name} meta={certMeta(c)} />
              </div>
            ))}
          </>
        ),
        experience: has(data.experience) && (
          <>
            <div className="resume-heading" style={heading}>Work Experience</div>
            {data.experience.map((e, i) => (
              <div key={e.id} className="resume-entry" style={entry(i)}>
                <EntryHead
                  title={e.position || e.company}
                  dates={range(e.startDate, e.endDate, e.currentlyWorking)}
                  sub={<OrgLine org={e.position ? e.company : undefined} place={e.location} />}
                />
                <Bullets text={e.description} />
              </div>
            ))}
          </>
        ),
        projects: has(data.projects) && (
          <>
            <div className="resume-heading" style={heading}>Projects</div>
            {data.projects.map((p, i) => (
              <div key={p.id} className="resume-entry" style={entry(i)}>
                <EntryHead
                  title={p.name}
                  dates={range(p.startDate, p.endDate)}
                  sub={p.url ? <Link href={toHref(p.url)} style={{ color: MUTED, fontSize: 12, overflowWrap: 'anywhere' }}>{cleanUrl(p.url)}</Link> : undefined}
                />
                <Bullets text={p.description} />
              </div>
            ))}
          </>
        ),
        publications: has(data.publications) && (
          <>
            <div className="resume-heading" style={heading}>Publications</div>
            {data.publications.map((p, i) => (
              <div key={p.id} className="resume-entry" style={entry(i, 4)}>
                <NameMeta name={p.title} meta={pubMeta(p)} />
              </div>
            ))}
          </>
        ),
        courses: has(data.courses) && (
          <>
            <div className="resume-heading" style={heading}>Courses &amp; Training</div>
            {data.courses.map((c, i) => (
              <div key={c.id} className="resume-entry" style={entry(i, 4)}>
                <NameMeta name={c.name} meta={courseMeta(c)} />
              </div>
            ))}
          </>
        ),
        volunteer: has(data.volunteer) && (
          <>
            <div className="resume-heading" style={heading}>Volunteer Experience</div>
            {data.volunteer.map((v, i) => (
              <div key={v.id} className="resume-entry" style={entry(i)}>
                <EntryHead
                  title={v.role || v.organization}
                  dates={range(v.startDate, v.endDate, v.currentlyVolunteering)}
                  sub={<OrgLine org={v.role ? v.organization : undefined} />}
                />
                <Bullets text={v.description} />
              </div>
            ))}
          </>
        ),
        awards: has(data.awards) && (
          <>
            <div className="resume-heading" style={heading}>Awards &amp; Honors</div>
            {data.awards.map((a, i) => (
              <div key={a.id} className="resume-entry" style={entry(i, 6)}>
                <NameMeta name={a.name} meta={awardMeta(a)} />
                {a.description && <p style={{ margin: '1px 0 0', color: BODY }}>{a.description}</p>}
              </div>
            ))}
          </>
        ),
        languages: has(data.languages) && (
          <>
            <div className="resume-heading" style={heading}>Languages</div>
            <InlineList items={data.languages.map(languageLabel)} />
          </>
        ),
        skills: has(data.skills) && (
          <>
            <div className="resume-heading" style={heading}>Skills</div>
            <InlineList items={data.skills.map((s) => s.name)} />
          </>
        ),
        ...customSections(data, (sec) => (
          <>
            <div className="resume-heading" style={heading}>{sec.title}</div>
            {sec.items.map((it, i) => (
              <div key={it.id} className="resume-entry" style={entry(i, 6)}>
                {it.name && <div style={{ fontWeight: 600, color: INK }}>{it.name}</div>}
                {it.description && <p style={{ margin: '1px 0 0', color: BODY }}>{it.description}</p>}
              </div>
            ))}
          </>
        )),
      }, gap)}

      {/* Signature bar anchoring the foot of the page — of every page, in print. */}
      <div className="resume-foot-bar" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: BAR_H, background: ACCENT }} />
    </div>
  );
}
