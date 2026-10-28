import { useState, useEffect, useRef, useCallback } from 'react';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { cloudContent, isPlaceholderData, readLastSaved, writeLastSaved, type CloudResume } from '@/lib/cloudResume';
import type { CloudContent } from '@/lib/store/slices/types';

/** `local` = no database configured, so the browser copy is the only copy. */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'local';

const DEBOUNCE_MS = 1500;
const RETRY_MS = 10_000;

/**
 * Keeps the builder's resume saved to the cloud (Neon, via /api/resume).
 *
 * The persisted Zustand store stays the working copy, so the builder loads
 * instantly and keeps working offline. On top of that this hook:
 * - restores the resume from the cloud when this browser's local copy is gone;
 * - pushes anything not yet saved (offline edits, a template picked in the gallery);
 * - saves 1.5s after each change, retries when offline, and flushes on tab close;
 * - opens `requestedId` (the builder's `?id=`, from the dashboard), saving the one it replaces first.
 *
 * `opening` is true while that resume loads, so the builder can show a loader
 * rather than flash the previous one; `openError` says why it couldn't open.
 */
export function useAutosaveSync(requestedId: string | null): { saveStatus: SaveStatus; opening: boolean; openError: string | null } {
  const hydrated = useResumeStore((s) => s._hasHydrated);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [opening, setOpening] = useState(() => Boolean(requestedId));
  const [openError, setOpenError] = useState<string | null>(null);

  const ready = useRef(false);
  const cloudOff = useRef(false);
  const inFlight = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRef = useRef<(keepalive?: boolean) => Promise<boolean>>(async () => false);

  const schedule = useCallback((delay: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      void saveRef.current();
    }, delay);
  }, []);

  /** Pushes the current resume; resolves true once the cloud has it. */
  const save = useCallback(async (keepalive = false): Promise<boolean> => {
    if (cloudOff.current) return false;
    if (inFlight.current) { schedule(DEBOUNCE_MS); return false; }

    const state = useResumeStore.getState();
    const json = JSON.stringify(cloudContent(state));
    if (json === readLastSaved() && state.resumeId) { setSaveStatus('saved'); return true; }

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
        return false;
      }
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      const { id } = await res.json() as { id: string };
      if (id !== useResumeStore.getState().resumeId) useResumeStore.getState().setResumeId(id);
      writeLastSaved(json);
      // Edits made while the request was in flight go out next.
      if (JSON.stringify(cloudContent(useResumeStore.getState())) !== json) schedule(DEBOUNCE_MS);
      else setSaveStatus('saved');
      return true;
    } catch {
      setSaveStatus('error');
      schedule(RETRY_MS);
      return false;
    } finally {
      inFlight.current = false;
    }
  }, [schedule]);

  saveRef.current = save;

  // Initial sync, once the local copy has loaded.
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const wanted = requestedId;
    if (wanted && wanted !== useResumeStore.getState().resumeId) setOpening(true);
    setOpenError(null);

    const adopt = (resume: { id: string; content: CloudContent }) => {
      const store = useResumeStore.getState();
      store.loadCloudContent(resume.content);
      store.setResumeId(resume.id);
      writeLastSaved(JSON.stringify(cloudContent(useResumeStore.getState())));
      setSaveStatus('saved');
    };

    (async () => {
      try {
        if (wanted && wanted !== useResumeStore.getState().resumeId) {
          // Opening another resume replaces this browser's working copy, so make
          // sure the cloud has the current one first — never drop unsaved edits.
          const current = useResumeStore.getState();
          const unsaved = JSON.stringify(cloudContent(current)) !== readLastSaved();
          if (current.resumeId && unsaved && !(await saveRef.current())) {
            setOpenError("Your current resume hasn't been saved to the cloud yet, so it can't be swapped out. Check your connection and try again.");
            return;
          }
          const res = await fetch(`/api/resumes/${encodeURIComponent(wanted)}`, { cache: 'no-store' });
          if (res.status === 404) { setOpenError('This resume no longer exists. It may have been deleted.'); return; }
          if (res.status === 503) { setOpenError('Cloud save is not configured, so saved resumes can’t be opened.'); return; }
          if (!res.ok) throw new Error(`Open failed (${res.status})`);
          const { resume } = await res.json() as { resume: CloudResume };
          if (!cancelled) adopt(resume);
          return;
        }
        if (wanted) return; // already the working copy

        const res = await fetch('/api/resume', { cache: 'no-store' });
        if (res.status === 503) {
          cloudOff.current = true;
          setSaveStatus('local');
          return;
        }
        if (res.ok) {
          const { resume } = await res.json() as { resume: { id: string; content: CloudContent } | null };
          // This browser's local copy was cleared; the cloud copy is the latest.
          if (resume && !useResumeStore.getState().resumeId && !cancelled) adopt(resume);
        }
      } catch {
        if (wanted) setOpenError("Couldn't load this resume. Check your connection and try again.");
        // Otherwise offline: the local copy still works, and the push below will retry.
      } finally {
        if (!cancelled) {
          setOpening(false);
          ready.current = true;
          const local = useResumeStore.getState();
          // Never upload the demo every visitor starts with, or an empty resume.
          if (local.resumeId || !isPlaceholderData(local.data)) void saveRef.current();
        }
      }
    })();
    return () => { cancelled = true; };
  }, [hydrated, requestedId]);

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

  return { saveStatus, opening, openError };
}
