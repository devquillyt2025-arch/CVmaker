'use client';

import { memo } from 'react';
import type { ResumeData, TemplateId } from '@/lib/types';
import type { StoreState } from '@/lib/store/slices/types';
import ResumeDoc from '@/components/resume-templates';

// ResumePreview renders the selected HTML template inside an A4 sheet. It is the
// single render path shared by the builder live preview and the gallery
// thumbnails. (PDF export uses the separate react-pdf renderer in lib/resumePdf.)
interface ResumePreviewProps {
  data: ResumeData;
  templateId: string;
  sectionOrder?: string[];
  hiddenSections?: string[];
  builderDesign?: StoreState['builderDesign'];
}

const ResumePreview = memo(function ResumePreview({
  data,
  templateId,
  hiddenSections = [],
  builderDesign,
}: ResumePreviewProps) {
  return (
    <div
      className="print-preview-container"
      style={{
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 10px 40px -4px rgba(0,0,0,0.10)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <ResumeDoc
        data={data}
        templateId={templateId as TemplateId}
        hiddenSections={hiddenSections}
        spacing={builderDesign?.spacing}
        fontPair={builderDesign?.fontPair}
        pageSize={builderDesign?.pageSize}
        accentColor={builderDesign?.accentColor}
      />
    </div>
  );
});

export default ResumePreview;
