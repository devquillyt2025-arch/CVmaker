'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * A landing-page link that reacts the moment it is clicked.
 *
 * A plain <Link> gives no feedback until the next route has rendered — in dev
 * that includes compiling the route on first visit, which takes seconds and
 * makes the button look dead, so people click it again. Here the navigation
 * runs in a transition: the button shows a spinner while it is pending and
 * ignores repeat clicks. Modified clicks (new tab/window) keep normal link
 * behaviour.
 */
export default function NavCta({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (pending) return;
    startTransition(() => router.push(href));
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-busy={pending}
      className={className}
      style={pending ? { cursor: 'progress', opacity: 0.85 } : undefined}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </Link>
  );
}
