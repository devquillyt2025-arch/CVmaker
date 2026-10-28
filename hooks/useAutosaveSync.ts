import { useState, useEffect, useRef, useCallback } from 'react';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { DEMO_RESUME_DATA } from '@/lib/store/slices/defaultData';
import type { CloudContent, StoreState } from '@/lib/store/slices/types';

/** `local` = no database configured, so the browser copy is the only copy. */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'local';

const DEBOUNCE_MS = 1500;
const RETRY_MS = 10_000;
/** The last content the server confirmed, so unchanged state is never re-sent. */
const LAST_SAVED_KEY = 'foliox:lastSaved';

function cloudContent(s: StoreState): CloudContent {
  const { accentColor, fontPair, spacing, pageSize } = s.builderDesign;
  return {
    data: s.data,
    templateId: s.templateId,
    sectionOrder: s.sectionOrder,
    hiddenSections: s.hiddenSections,
    builderDesign: { accentColor, fontPair, spacing, pageSize },
  };
}

/** JSON with object keys sorted, so the store's key re-ordering doesn't count as a change. */
function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : 1)))
      : v,
  );
}

function readLastSaved(): string | null {
  try { return localStorage.getItem(LAST_SAVED_KEY); } catch { return null; }
}

function writeLastSaved(json: string) {
  try { localStorage.setItem(LAST_SAVED_KEY, json); } catch { /* storage full or blocked */ }
}

/**
 * Keeps the builder's resume saved to the cloud (Neon, via /api/resume).
 *
 * The persisted Zustand store stays the working copy, so the builder loads
 * instantly and keeps working offline. On top of that this hook:
 * - restores the resume from the cloud when this browser's local copy is gone;
 * - pushes anything not yet saved (offline edits, a template picked in the gallery);
 * - saves 1.5s after each change, retries when offline, and flushes on tab close.
 */
export function useAutosaveSync(): { saveStatus: SaveStatus } {
  const hydrated = useResumeStore((s) => s._hasHydrated);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const ready = useRef(false);
  const cloudOff = useRef(false);
  const inFlight = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRef = useRef<(keepalive?: boolean) => Promise<void>>(async () => {});

  const schedule = useCallback((delay: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      void saveRef.current();
    }, delay);
  }, []);

  const save = useCallback(async (keepalive = false) => {
    if (cloudOff.current) return;
    if (inFlight.current) { schedule(DEBOUNCE_MS); return; }

    const state = useResumeStore.getState();
    const json = JSON.stringify(cloudContent(state));
    if (json === readLastSaved() && state.resumeId) { setSaveStatus('saved'); return; }

    inFlight.current = true;
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: `{"id":${JSON.stringify(state.resumeId)},"content":${json}}`,
        keepalive,
      });
      if (res.status === 503) {
        cloudOff.current = true;
        setSaveStatus('local');
        return;
      }
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      const { id } = await res.json() as { id: string };
      if (id !== useResumeStore.getState().resumeId) useResumeStore.getState().setResumeId(id);
      writeLastSaved(json);
      // Edits made while the request was in flight go out next.
      if (JSON.stringify(cloudContent(useResumeStore.getState())) !== json) schedule(DEBOUNCE_MS);
      else setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
      schedule(RETRY_MS);
    } finally {
      inFlight.current = false;
    }
  }, [schedule]);

  saveRef.current = save;

  // Initial sync, once the local copy has loaded.
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/resume', { cache: 'no-store' });
        if (res.status === 503) {
          cloudOff.current = true;
          setSaveStatus('local');
          return;
        }
        if (res.ok) {
          const { resume } = await res.json() as { resume: { id: string; content: CloudContent } | null };
          const local = useResumeStore.getState();
          if (resume && !local.resumeId && !cancelled) {
            // This browser's local copy was cleared; the cloud copy is the latest.
            local.loadCloudContent(resume.content);
            local.setResumeId(resume.id);
            writeLastSaved(JSON.stringify(cloudContent(useResumeStore.getState())));
            setSaveStatus('saved');
          }
        }
      } catch {
        // Offline: the local copy still works, and the push below will retry.
      }
      if (cancelled) return;
      ready.current = true;
      const local = useResumeStore.getState();
      // Never upload the untouched demo resume every visitor starts with.
      const untouchedDemo = !local.resumeId && stableJson(local.data) === stableJson(DEMO_RESUME_DATA);
      if (!untouchedDemo) void saveRef.current();
    })();
    return () => { cancelled = true; };
  }, [hydrated]);

  // Save shortly after any change to what the cloud stores.
  useEffect(() => {
    if (!hydrated) return;
    let prev = cloudContent(useResumeStore.getState());
    return useResumeStore.subscribe((state) => {
      const next = cloudContent(state);
      const changed = next.data !== prev.data
        || next.templateId !== prev.templateId
        || next.sectionOrder !== prev.sectionOrder
        || next.hiddenSections !== prev.hiddenSections
        || JSON.stringify(next.builderDesign) !== JSON.stringify(prev.builderDesign);
      prev = next;
      if (!changed || !ready.current || cloudOff.current) return;
      setSaveStatus('saving');
      schedule(DEBOUNCE_MS);
    });
  }, [hydrated, schedule]);

  // Don't lose the last edit when the tab closes or the user leaves the builder.
  useEffect(() => {
    const flush = () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
      timer.current = null;
      void saveRef.current(true);
    };
    const onHide = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      flush();
    };
  }, []);

  return { saveStatus };
}
