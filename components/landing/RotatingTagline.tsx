'use client';

import { useEffect, useState } from 'react';

const TAGLINES = [
  { before: 'Resumes that ', highlight: 'open doors.' },
  { before: 'Your story. ', highlight: 'Their first impression.' },
  { before: 'Build it. Export it. ', highlight: 'Send it.' },
  { before: 'From blank page to ', highlight: 'dream job.' },
];

/** How long a tagline holds, and how long each half of the cross-fade takes. */
const HOLD_MS = 3200;
const FADE_MS = 350;

/**
 * The hero headline, cycling through TAGLINES.
 *
 * This is the only interactive part of the landing page, so it is the only part
 * that ships as a client component — everything around it renders on the server.
 */
export default function RotatingTagline() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Fade out, swap the copy while it is invisible, fade back in. The inner
    // timeout needs clearing too: without it an in-flight swap fires after
    // unmount and sets state on a dead component.
    let swap: ReturnType<typeof setTimeout> | undefined;
    const cycle = setInterval(() => {
      setVisible(false);
      swap = setTimeout(() => {
        setIdx((i) => (i + 1) % TAGLINES.length);
        setVisible(true);
      }, FADE_MS);
    }, HOLD_MS);

    return () => {
      clearInterval(cycle);
      clearTimeout(swap);
    };
  }, []);

  const { before, highlight } = TAGLINES[idx];

  return (
    <h1
      className="lp-tagline"
      data-visible={visible}
      style={{
        fontSize: 'clamp(36px, 6.5vw, 64px)',
        fontWeight: 600,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        margin: 0,
      }}
    >
      <span style={{ color: 'var(--lp-heading)' }}>{before}</span>
      <span className="lp-grad-text">{highlight}</span>
    </h1>
  );
}
