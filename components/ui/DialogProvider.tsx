'use client';

import {
  createContext, useCallback, useContext, useEffect, useId, useRef, useState,
  type KeyboardEvent, type ReactNode,
} from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Destructive action: red confirm button, and Cancel holds the initial focus. */
  danger?: boolean;
}

interface PromptOptions {
  title: string;
  message?: ReactNode;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  maxLength?: number;
}

interface DialogApi {
  /** Resolves true when confirmed, false when cancelled. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  /** Resolves the trimmed text, or null when cancelled. */
  prompt: (options: PromptOptions) => Promise<string | null>;
}

type Request =
  | { kind: 'confirm'; options: ConfirmOptions; resolve: (ok: boolean) => void }
  | { kind: 'prompt'; options: PromptOptions; resolve: (value: string | null) => void };

const DialogContext = createContext<DialogApi | null>(null);

/**
 * In-app replacements for window.confirm / window.prompt, so questions appear
 * on the page in the app's own style rather than as the browser's dialog box.
 */
export function useDialog(): DialogApi {
  const api = useContext(DialogContext);
  if (!api) throw new Error('useDialog must be used inside <DialogProvider>');
  return api;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<Request | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) => new Promise<boolean>((resolve) => setRequest({ kind: 'confirm', options, resolve })),
    [],
  );
  const prompt = useCallback(
    (options: PromptOptions) => new Promise<string | null>((resolve) => setRequest({ kind: 'prompt', options, resolve })),
    [],
  );

  return (
    <DialogContext.Provider value={{ confirm, prompt }}>
      {children}
      {request && <Dialog key={request.options.title} request={request} onDone={() => setRequest(null)} />}
    </DialogContext.Provider>
  );
}

function Dialog({ request, onDone }: { request: Request; onDone: () => void }) {
  const { options } = request;
  const danger = request.kind === 'confirm' && request.options.danger;
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState(request.kind === 'prompt' ? request.options.defaultValue ?? '' : '');

  const finish = useCallback((ok: boolean) => {
    if (request.kind === 'confirm') request.resolve(ok);
    else request.resolve(ok ? value.trim() || null : null);
    onDone();
  }, [request, value, onDone]);

  // Initial focus, and hand focus back to whatever opened the dialog.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    if (request.kind === 'prompt') inputRef.current?.select();
    else (danger ? cancelRef : confirmRef).current?.focus();
    return () => opener?.focus?.();
  }, [request.kind, danger]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      finish(false);
      return;
    }
    // Keep Tab inside the dialog while it is open.
    if (e.key === 'Tab' && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('input, button:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  const canConfirm = request.kind === 'confirm' || value.trim().length > 0;
  const confirmLabel = options.confirmLabel ?? (request.kind === 'prompt' ? 'Save' : 'Confirm');
  const cancelLabel = (request.kind === 'confirm' && request.options.cancelLabel) || 'Cancel';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) finish(false); }}
      onKeyDown={onKeyDown}
    >
      <div
        ref={panelRef}
        role={danger ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/[0.07] dark:bg-[#12121a]"
      >
        <form
          onSubmit={(e) => { e.preventDefault(); if (canConfirm) finish(true); }}
          className="p-6"
        >
          <div className="flex gap-4">
            {danger && (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-white">{options.title}</h2>
              {options.message && <div className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{options.message}</div>}
              {request.kind === 'prompt' && (
                <label className="mt-4 block">
                  <span className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-300">{request.options.label}</span>
                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={request.options.placeholder}
                    maxLength={request.options.maxLength}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                  />
                </label>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              ref={cancelRef}
              type="button"
              onClick={() => finish(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmRef}
              type="submit"
              disabled={!canConfirm}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50 ${
                danger ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
