'use client';

import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { PAGE_SIZES, DEFAULT_PAGE_SIZE } from '@/components/resume-templates/shared';
import ResumePreview from './ResumePreview';

/**
 * Full-size resume preview that shrinks to its container's width. CSS `zoom`
 * (unlike a transform) also shrinks the layout box, so scrolling and centring
 * stay right.
 */
export default function FitPreview(props: ComponentProps<typeof ResumePreview>) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const pageW = PAGE_SIZES[props.builderDesign?.pageSize ?? DEFAULT_PAGE_SIZE]?.w ?? PAGE_SIZES[DEFAULT_PAGE_SIZE].w;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      // +2 for the preview's 1px border on each side
      setScale(Math.min(1, el.clientWidth / (pageW + 2)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [pageW]);

  return (
    <div ref={ref} className="w-full">
      <div className="mx-auto w-fit" style={{ zoom: scale }}>
        <ResumePreview {...props} />
      </div>
    </div>
  );
}
