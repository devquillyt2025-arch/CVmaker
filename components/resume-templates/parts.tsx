import {
  Fragment, createElement, useEffect, useLayoutEffect, useRef, useState,
  type CSSProperties, type ReactNode,
} from 'react';
import type { ContactEntry } from './shared';

// Building blocks shared by the templates. Everything here renders the same in
// the live preview, the gallery thumbnails and the exported PDF.

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * A link in the exported PDF (Chrome turns `<a href>` into a link annotation),
 * styled as plain text so it reads the same on paper. Opens in a new tab when
 * clicked in the live preview, so the builder itself is never navigated away.
 */
export function Link({ href, children, style }: { href?: string; children: ReactNode; style?: CSSProperties }) {
  if (!href) return style ? <span style={style}>{children}</span> : <>{children}</>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', ...style }}>
      {children}
    </a>
  );
}

/**
 * Contact details on one wrapping line. Each item is unbreakable — the line
 * wraps *between* items only. Letting it wrap inside one split an email or URL
 * at its hyphen ("jane@example-" / "mail.com"), which no parser can put back
 * together, so the address was lost.
 */
export function ContactRow({ items, sep, style }: { items: ContactEntry[]; sep: ReactNode; style?: CSSProperties }) {
  if (!items.length) return null;
  return (
    <div style={style}>
      {items.map((it, i) => (
        <Fragment key={it.key}>
          {i > 0 && <>{' '}{sep}{' '}</>}
          <Link href={it.href} style={{ whiteSpace: 'nowrap' }}>{it.text}</Link>
        </Fragment>
      ))}
    </div>
  );
}

/**
 * Text that shrinks (never grows) until it fits its column, for content that
 * must not wrap mid-token in a narrow sidebar — an email address, a URL, a
 * hyphenated surname. Words are kept whole; `wrap` still allows breaks between
 * them. Measured after every render, so a font change re-fits it, and the fitted
 * size is an inline style that react-to-print carries into the PDF.
 */
export function FitText({
  as = 'div', size, min = 7, wrap = false, style, children,
}: {
  as?: 'div' | 'h1';
  /** Font size in px when the text fits. */
  size: number;
  min?: number;
  /** Allow line breaks between words (text children only). */
  wrap?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = `${size}px`;
      const ratio = el.clientWidth / el.scrollWidth;
      // Quarter-pixel steps, with a little slack for rounding in scrollWidth.
      if (ratio < 1) el.style.fontSize = `${Math.max(min, Math.floor(size * ratio * 0.98 * 4) / 4)}px`;
    };
    fit();
    // Re-fit once web fonts arrive; their metrics differ from the fallback's.
    document.fonts?.ready.then(fit);
  });

  const content = wrap && typeof children === 'string'
    ? children.split(/\s+/).filter(Boolean).map((w, i) => (
      <Fragment key={i}>{i > 0 && ' '}<span style={{ whiteSpace: 'nowrap' }}>{w}</span></Fragment>
    ))
    : children;
  return createElement(as, { ref, style: { ...style, fontSize: size, whiteSpace: wrap ? undefined : 'nowrap' } }, content);
}

/**
 * Initials in a filled circle, painted to a canvas and shown as a PNG
 * background. Real text — even inside an SVG — lands in the PDF's text layer
 * as the first and largest thing on the page, and a parser that takes the top,
 * largest line as the candidate's name reads "JD" instead of "Jane Doe".
 * Pixels have no text layer. Until the canvas has painted, the plain circle shows.
 */
export function Monogram({ text, size, background, color = '#fff' }: { text: string; size: number; background: string; color?: string }) {
  const [png, setPng] = useState<string>();

  useEffect(() => {
    const scale = 4; // ~380dpi at print size
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);
    ctx.fillStyle = color;
    ctx.font = `800 ${Math.round(size * 0.36)}px "Segoe UI", Helvetica, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, size / 2, size / 2 + size * 0.02);
    setPng(canvas.toDataURL('image/png'));
  }, [text, size, color]);

  return (
    <div
      role="img"
      aria-label={text}
      style={{
        width: size, height: size, margin: '0 auto 14px', borderRadius: '50%',
        background: png ? `url("${png}") center / contain no-repeat, ${background}` : background,
      }}
    />
  );
}
