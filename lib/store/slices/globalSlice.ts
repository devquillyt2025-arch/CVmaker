import { v4 as uuidv4 } from 'uuid';
import { StoreSlice } from './types';
import { emptyResumeData, DEMO_RESUME_DATA } from './defaultData';
import { TEMPLATE_META } from '../../templates';

export const DEFAULT_SECTION_ORDER = ['summary', 'skills', 'experience', 'education', 'certifications', 'courses', 'languages', 'projects', 'publications', 'volunteer', 'awards'];

export const DEFAULT_BUILDER_DESIGN = {
  accentColor: '#0D9488',
  fontPair: 'editorial' as const,
  spacing: 'balanced' as const,
  pageSize: 'a4' as const,
  zoom: 0.9,
};

export const createGlobalSlice: StoreSlice<Pick<import('./types').StoreState, 'resumeId' | 'templateId' | 'builderDesign' | 'data' | 'sectionOrder' | 'hiddenSections' | '_hasHydrated' | 'setHasHydrated' | 'setResumeId' | 'setTemplateId' | 'setBuilderDesign' | 'setSectionOrder' | 'toggleSectionVisibility' | 'loadResumeData' | 'loadCloudContent' | 'reset'>> = (set, get) => ({
  resumeId: null,
  templateId: 'signature-header',
  builderDesign: DEFAULT_BUILDER_DESIGN,
  data: DEMO_RESUME_DATA,
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
  _hasHydrated: false,

  setHasHydrated: (state) => set({ _hasHydrated: state }),
  setResumeId: (id) => set({ resumeId: id }),
  setTemplateId: (id) => set({ templateId: id }),
  setBuilderDesign: (design) => set((state) => ({
    builderDesign: { ...DEFAULT_BUILDER_DESIGN, ...state.builderDesign, ...design },
  })),
  setSectionOrder: (order) => set({ sectionOrder: order }),
  toggleSectionVisibility: (id) => set((state) => ({
    hiddenSections: state.hiddenSections.includes(id)
      ? state.hiddenSections.filter((s) => s !== id)
      : [...state.hiddenSections, id],
  })),

  loadResumeData: (data) => set({
    data: {
      ...emptyResumeData,
      ...data,
      experience: data.experience || [],
      education: data.education || [],
      skills: (data.skills || []).map((s) => ({ ...s, id: s.id || uuidv4() })),
      projects: data.projects || [],
      certifications: data.certifications || [],
      languages: data.languages || [],
      publications: data.publications || [],
      courses: data.courses || [],
      awards: data.awards || [],
      volunteer: data.volunteer || [],
      customSections: data.customSections || [],
      contact: { ...emptyResumeData.contact, ...(data.contact || {}) },
    },
  }),
  loadCloudContent: (content) => {
    get().loadResumeData(content.data);
    set((state) => ({
      // Fall back if the saved template has since been removed from the gallery.
      templateId: TEMPLATE_META.some((t) => t.id === content.templateId) ? content.templateId : state.templateId,
      sectionOrder: content.sectionOrder?.length ? content.sectionOrder : DEFAULT_SECTION_ORDER,
      hiddenSections: content.hiddenSections ?? [],
      builderDesign: { ...DEFAULT_BUILDER_DESIGN, ...content.builderDesign, zoom: state.builderDesign.zoom },
    }));
  },
  reset: () => set({ data: emptyResumeData, resumeId: null }),
});
