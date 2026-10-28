'use client';

import { useEffect } from 'react';
import { ResumeData, TemplateId } from '@/lib/types';
import type { StoreState } from '@/lib/store/slices/types';
import FitPreview from './FitPreview';

interface Props {
  data: ResumeData;
  templateId: TemplateId;
  sectionOrder?: string[];
  hiddenSections?: string[];
  builderDesign?: StoreState['builderDesign'];
  onClose: () => void;
  onDownload: () => void;
}

export default function PreviewModal({ data, templateId, sectionOrder, hiddenSections, builderDesign, onClose, onDownload }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden"
        style={{ height: '92vh' }}>

        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">PDF Preview</h2>
            <p className="text-xs text-gray-500">Exactly how your resume will look when downloaded</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 transition-colors"
              aria-label="Close preview"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* HTML Preview */}
        <div className="flex-1 bg-gray-200 overflow-y-auto overflow-x-hidden p-4 sm:p-8">
          <FitPreview
            data={data}
            templateId={templateId}
            sectionOrder={sectionOrder}
            hiddenSections={hiddenSections}
            builderDesign={builderDesign}
          />
        </div>
      </div>
    </div>
  );
}
