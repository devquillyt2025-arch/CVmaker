import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import RotatingTagline from '@/components/landing/RotatingTagline';

/**
 * Landing page.
 *
 * Rebuilt against the app as it actually is now: a local-only builder. The
 * previous version sold the upload -> JD -> paid-rewrite -> DOCX funnel, and
 * every one of those pieces (auth, payments, the tailor entry point, server
 * persistence) was removed. Copy here claims only what /builder does today —
 * no pricing, no accounts, no server-side storage.
 *
 * Styling reuses the --lp-* tokens already in globals.css, which carry proper
 * light and dark values, so this page themes itself with the rest of the app.
 * Hover and the brand gradient are `.lp-*` classes there too, which keeps this
 * a server component — only <RotatingTagline> and <ThemeToggle> ship JS.
 */

const ATS_FEATURES = ['Single-column export', 'Selectable text', 'Embedded fonts', 'Real A4 geometry'];

function FXMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.78)} viewBox="0 0 36 28" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="fxg" x1="0" y1="0" x2="36" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6C63FF" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <line x1="3" y1="3" x2="3" y2="25" stroke="url(#fxg)" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="3" y1="3" x2="14" y2="3" stroke="url(#fxg)" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="3" y1="14" x2="11" y2="14" stroke="url(#fxg)" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="19" y1="3" x2="33" y2="25" stroke="url(#fxg)" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="33" y1="3" x2="19" y2="25" stroke="url(#fxg)" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--lp-bg)', color: 'var(--lp-heading)', fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: 1400, height: 800,
          background: 'radial-gradient(ellipse at 50% 40%, var(--lp-glow) 0%, transparent 65%)',
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-8 h-16"
        style={{
          background: 'var(--lp-nav-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--lp-nav-border)',
        }}
      >
        <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
          <FXMark size={34} />
          <span style={{ width: 1, height: 20, background: 'var(--lp-nav-sep)', display: 'inline-block' }} />
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--lp-heading)' }}>
            Folio<span className="lp-grad-text">X</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="lp-navlink hidden sm:inline-flex rounded-full px-[18px] py-1.5 text-sm font-medium no-underline"
          >
            Templates
          </Link>

          <ThemeToggle />

          <Link
            href="/builder"
            className="lp-cta-sm rounded-full px-5 py-[7px] text-[13px] font-bold text-white no-underline"
          >
            Open Builder
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative z-10 flex flex-col justify-center items-center text-center px-4"
        style={{ minHeight: 'calc(100vh - 64px)', paddingTop: 96, paddingBottom: 96 }}
      >
        <div className="mx-auto" style={{ maxWidth: 780 }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--lp-badge-text)', background: 'var(--lp-pill-bg)',
              border: '1px solid var(--lp-pill-border)', borderRadius: 999,
              padding: '6px 18px', marginBottom: 44,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6C63FF', display: 'inline-block', boxShadow: '0 0 8px rgba(108,99,255,0.9)' }} />
            Free · No sign-up
          </div>

          {/* Fixed height so the rotating headline never reflows the page. */}
          <div style={{ minHeight: 'clamp(80px, 10vw, 140px)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
            <RotatingTagline />
          </div>

          <p style={{ fontSize: 18, color: 'var(--lp-body)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.65 }}>
            A resume builder that runs in your browser. Fifteen typeset templates, a live
            preview of the exact page you&rsquo;ll export, and AI that helps you write the hard parts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/builder"
              className="lp-cta-lg inline-flex items-center gap-2 rounded-full px-10 py-4 text-base font-bold text-white no-underline"
            >
              Start building →
            </Link>

            <Link
              href="/templates"
              className="lp-btn-ghost inline-flex items-center rounded-full px-[30px] py-4 text-[15px] font-semibold no-underline"
            >
              Browse templates
            </Link>
          </div>

          <p style={{ fontSize: 13, color: 'var(--lp-valueprop)', letterSpacing: '0.02em', marginTop: 20 }}>
            Your resume stays in your browser. Nothing to create, nothing to pay for.
          </p>

          <div style={{ marginTop: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lp-muted)', marginBottom: 12 }}>
              Built for the systems that read you first
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {ATS_FEATURES.map((name) => (
                <Chip key={name} name={name} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section
        className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20"
        style={{ borderTop: '1px solid var(--lp-section-border)', paddingTop: 56 }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--lp-section-label)', marginBottom: 32 }}>
          How FolioX works
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          <FeatureCard
            icon="✍️"
            title="Write it once, see it typeset."
            body="Edit on the left, watch the finished page redraw on the right. What you see is the page that comes out — same measurements, same fonts."
            badge="FREE"
            variant="free"
          />
          <FeatureCard
            icon="🎨"
            title="Fifteen templates, one click apart."
            body="Classic, academic, government, editorial and more. Switch template, accent colour, typeface or density without retyping a word."
            variant="paid"
          />
          <FeatureCard
            icon="✨"
            title="AI for the parts nobody enjoys."
            body="Draft a summary, sharpen weak bullets, and surface the skills and keywords a posting is really asking for."
            badge="CLAUDE"
            variant="paid"
          />
        </div>
      </section>

      <footer
        className="relative z-10 py-6 text-center text-xs"
        style={{ borderTop: '1px solid var(--lp-footer-border)', background: 'var(--lp-bg)', color: 'var(--lp-footer-text)' }}
      >
        FolioX · Your resume is stored locally in this browser · No account required
      </footer>
    </div>
  );
}

function Chip({ name }: { name: string }) {
  return (
    <span className="lp-chip inline-flex cursor-default items-center gap-[5px] rounded-full px-[13px] py-[5px] text-xs font-medium">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {name}
    </span>
  );
}

function FeatureCard({
  icon, title, body, badge, variant = 'default',
}: {
  icon: string; title: string; body: string;
  badge?: string; variant?: 'free' | 'paid' | 'default';
}) {
  const isFree = variant === 'free';

  // The free/paid variants differ only in these four values; `.lp-card` in
  // globals.css reads them and owns the shared hover behaviour.
  const cardVars = {
    '--card-bg': isFree ? 'var(--lp-free-card-bg)' : 'var(--lp-card-bg)',
    '--card-border': isFree ? 'var(--lp-free-border)' : 'var(--lp-card-border)',
    '--card-border-hover': isFree ? 'var(--lp-free-border-h)' : 'var(--lp-card-border-h)',
    '--card-shadow-hover': variant === 'paid' ? '0 0 28px rgba(108,99,255,0.12)' : 'none',
  } as CSSProperties;

  return (
    <div className="lp-card relative flex cursor-default flex-col gap-4 rounded-[14px] p-6" style={cardVars}>
      {badge && (
        <span
          style={{
            position: 'absolute', top: 16, right: 16, fontSize: 9, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 999, padding: '3px 9px',
            color: isFree ? '#10b981' : '#a78bfa',
            background: isFree ? 'rgba(16,185,129,0.12)' : 'rgba(108,99,255,0.15)',
            border: `1px solid ${isFree ? 'rgba(16,185,129,0.30)' : 'rgba(108,99,255,0.35)'}`,
          }}
        >
          {badge}
        </span>
      )}

      <div
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-[22px]"
        style={{
          background: isFree ? 'var(--lp-free-icon-bg)' : 'var(--lp-icon-bg)',
          border: `1px solid ${isFree ? 'var(--lp-free-icon-border)' : 'var(--lp-icon-border)'}`,
        }}
      >
        {icon}
      </div>

      <div>
        <p style={{ fontWeight: 700, fontSize: 14, color: isFree ? 'var(--lp-free-title)' : 'var(--lp-card-title)', margin: 0, lineHeight: 1.4, paddingRight: badge ? 64 : 0 }}>
          {title}
        </p>
        <p style={{ fontSize: 13, color: 'var(--lp-card-body)', marginTop: 8, lineHeight: 1.65 }}>
          {body}
        </p>
      </div>
    </div>
  );
}
