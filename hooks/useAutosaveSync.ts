import { useState, useEffect, useRef } from 'react';
import { ResumeData } from '@/lib/types';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const DEBOUNCE_MS = 1500;
const SAVED_RESET_MS = 3000;

export function useAutosaveSync(resumeId: string | null, data: ResumeData, setResumeId: (id: string) => void) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousJsonRef = useRef<string>('');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousJsonRef.current = JSON.stringify(data);
      return;
    }

    const currentJson = JSON.stringify(data);
    if (currentJson === previousJsonRef.current) return;

    previousJsonRef.current = currentJson;
    setSaveStatus('saving');

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      // Mock saving to database since we only use Zustand local storage now
      setSaveStatus('saved');
      
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setSaveStatus('idle'), SAVED_RESET_MS);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [data]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return { saveStatus };
}
