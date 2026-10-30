'use client';

import { memo, useEffect, useRef, useState } from 'react';
import type { ResumeData, TemplateId } from '@/lib/types';
import type { StoreState } from '@/lib/store/slices/types';
import ResumeDoc from '@/components/resume-templates';
import { PAGE_SIZES, DEFAULT_PAGE_SIZE } from '@/components/resume-templates/shared';
import { pageBreaks as findPageBreaks } from './pagination';

// ResumePreview renders the selected HTML template inside a page-sized sheet. It is the
// single render path shared by the builder live preview, the preview modal, the
// gallery thumbnails and the PDF export (react-to-print clones this DOM).
interface ResumePreviewProps {
  data: ResumeData;
  templateId: string;
  sectionOrder?: string[];
  hiddenSections?: string[];
  builderDesign?: StoreState['builderDesign'];
  /** Draw a marker where each printed page will end (never printed itself). */
  pageBreaks?: boolean;
  /** Called with the number of pages the export will have, whenever it changes. Must be stable. */
  onPageCount?: (pages: number) => void;
}

const ResumePreview = memo(function ResumePreview({
  data,
  templateId,
  sectionOrder,
  hiddenSections = [],
  builderDesign,
  pageBreaks = false,
  onPageCount,
}: ResumePreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [breaks, setBreaks] = useState<number[]>([]);
  const pageH = (PAGE_SIZES[builderDesign?.pageSize ?? DEFAULT_PAGE_SIZE] ?? PAGE_SIZES[DEFAULT_PAGE_SIZE]).h;
  const measuring = pageBreaks || Boolean(onPageCount);

  // Re-measured after every render (a template or spacing switch can change the
  // padding without changing the height) and on every resize of the sheet.
  useEffect(() => {
    const sheet = ref.current?.querySelector<HTMLElement>('.resume-sheet');
    if (!measuring || !sheet) return;
    const measure = () => {
      // Zero height means the preview is hidden (phone layout): keep the last result.
      if (!sheet.offsetHeight) return;
      const next = findPageBreaks(sheet, pageH);
      setBreaks((prev) => (prev.join() === next.join() ? prev : next));
      onPageCount?.(next.length + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sheet);
    return () => ro.disconnect();
  });

  return (
    <div
      ref={ref}
      className="print-preview-container"
      style={{
        position: 'relative',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 10px 40px -4px rgba(0,0,0,0.10)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <ResumeDoc
        data={data}
        templateId={templateId as TemplateId}
        sectionOrder={sectionOrder}
        hiddenSections={hiddenSections}
        spacing={builderDesign?.spacing}
        fontPair={builderDesign?.fontPair}
        pageSize={builderDesign?.pageSize}
        accentColor={builderDesign?.accentColor}
      />
      {pageBreaks && breaks.map((y, i) => (
        <div key={y} className="resume-page-break" style={{ top: y }} aria-hidden="true">
          <span>Page {i + 2}</span>
        </div>
      ))}
    </div>
  );
});

export default ResumePreview;
