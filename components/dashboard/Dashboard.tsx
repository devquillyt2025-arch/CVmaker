'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Clock, Copy, FileText, LayoutTemplate, Loader2, Pencil, Plus, Sparkles, Trash2, CloudOff, X,
} from 'lucide-react';
import FitPreview from '@/components/builder/FitPreview';
import FXMark from '@/components/landing/FXMark';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { TEMPLATE_META } from '@/lib/templates';
import {
  blankContent, cloudContent, exampleContent, forgetLocalResume, isPlaceholderData, resumeTitle,
  type CloudResume,
} from '@/lib/cloudResume';
import type { CloudContent } from '@/lib/store/slices/types';

/** `cloud` = listed from Neon; `local` = no database configured; `offline` = database unreachable. */
type Mode = 'loading' | 'cloud' | 'local' | 'offline';

const templateLabel = (id: string) => TEMPLATE_META.find((t) => t.id === id)?.label ?? 'Template';

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['second', 60], ['minute', 60], ['hour', 24], ['day', 7], ['week', 4.35], ['month', 12], ['year', Infinity],
];

/** "just now", "5 minutes ago", "yesterday", "3 weeks ago". */
function timeAgo(iso: string): string {
  let delta = (new Date(iso).getTime() - Date.now()) / 1000;
  if (!Number.isFinite(delta)) return '';
  if (Math.abs(delta) < 45) return 'just now';
  for (const [unit, size] of STEPS) {
    if (Math.abs(delta) < size) return rtf.format(Math.round(delta), unit);
    delta /= size;
  }
  return '';
}

function subtitle(r: CloudResume): string {
  const c = r.content.data?.contact;
  const name = [c?.firstName, c?.lastName].filter(Boolean).join(' ');
  return [r.title ? name : '', c?.jobTitle].filter(Boolean).join(' · ');
}

/** Scaled-down first page of a resume. */
function Thumbnail({ content }: { content: CloudContent }) {
  return (
    <div className="pointer-events-none aspect-[794/1123] w-full select-none overflow-hidden rounded-md bg-white shadow-md ring-1 ring-black/5" aria-hidden="true">
      <FitPreview
        data={content.data}
        templateId={content.templateId}
        sectionOrder={content.sectionOrder}
        hiddenSections={content.hiddenSections}
        builderDesign={{ ...content.builderDesign, zoom: 1 }}
      />
    </div>
  );
}

/** A resume's name, renamed in place: click the pencil, Enter saves, Escape cancels. */
function EditableTitle({ resume, onRename, large }: { resume: CloudResume; onRename?: (title: string) => void; large?: boolean }) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const title = resumeTitle(resume);
  const textClass = large ? 'text-xl font-semibold' : 'text-sm font-semibold';

  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  if (editing && onRename) {
    const commit = () => {
      const next = inputRef.current?.value.trim() ?? '';
      setEditing(false);
      if (next !== title) onRename(next);
    };
    return (
      <input
        ref={inputRef}
        defaultValue={title}
        maxLength={120}
        aria-label="Resume name"
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') setEditing(false);
        }}
        className={`${textClass} w-full rounded-md border border-indigo-400 bg-white px-2 py-0.5 text-slate-900 outline-none ring-2 ring-indigo-500/20 dark:bg-gray-950 dark:text-white`}
      />
    );
  }

  return (
    <div className="group/title flex min-w-0 items-center gap-1.5">
      <h3 className={`${textClass} truncate text-slate-900 dark:text-white`} title={title}>{title}</h3>
      {onRename && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="shrink-0 rounded p-1 text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-700 focus:opacity-100 group-hover/title:opacity-100 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label={`Rename ${title}`}
          title="Rename"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function StatTile({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-gray-400">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">{value}</p>
      {detail && <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-gray-400" title={detail}>{detail}</p>}
    </div>
  );
}

function IconAction({ label, onClick, disabled, danger, children }: {
  label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition disabled:opacity-40 dark:text-gray-400 ${
        danger
          ? 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400'
          : 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-gray-800 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const hydrated = useResumeStore((s) => s._hasHydrated);
  const [mode, setMode] = useState<Mode>('loading');
  const [cloud, setCloud] = useState<CloudResume[]>([]);
  const [creating, setCreating] = useState<'blank' | 'example' | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/resumes', { cache: 'no-store' });
      if (res.status === 503) { setMode('local'); return; }
      if (!res.ok) throw new Error();
      const { resumes } = await res.json() as { resumes: CloudResume[] };
      setCloud(resumes);
      setMode('cloud');
    } catch {
      setMode('offline');
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  // The builder's working copy can be a few seconds ahead of the cloud (its last
  // save may still be in flight), so its card shows the local content.
  // Selected field by field: a selector that builds a new object every call
  // would make Zustand re-render forever.
  const data = useResumeStore((s) => s.data);
  const templateId = useResumeStore((s) => s.templateId);
  const sectionOrder = useResumeStore((s) => s.sectionOrder);
  const hiddenSections = useResumeStore((s) => s.hiddenSections);
  const builderDesign = useResumeStore((s) => s.builderDesign);
  const workingId = useResumeStore((s) => s.resumeId);
  const working = useMemo(
    () => (hydrated ? cloudContent({ data, templateId, sectionOrder, hiddenSections, builderDesign }) : null),
    [hydrated, data, templateId, sectionOrder, hiddenSections, builderDesign],
  );
  const hasWorkingCopy = Boolean(working && (workingId || !isPlaceholderData(working.data)));

  const resumes: CloudResume[] = mode === 'cloud'
    ? cloud.map((r) => (r.id === workingId && working ? { ...r, content: working } : r))
    : hasWorkingCopy && working
      ? [{ id: workingId ?? 'local', title: null, content: working, createdAt: '', updatedAt: '' }]
      : [];

  const latest = resumes[0];
  const templatesUsed = new Set(resumes.map((r) => r.content.templateId)).size;

  const open = (r: CloudResume) => router.push(mode === 'cloud' ? `/builder?id=${r.id}` : '/builder');

  const create = async (kind: 'blank' | 'example') => {
    const content = kind === 'blank' ? blankContent() : exampleContent();
    setError('');
    if (mode !== 'cloud') {
      // Without the cloud the browser holds a single resume, so a new one replaces it.
      if (hasWorkingCopy && !window.confirm('Without cloud save this browser keeps one resume. Replace it with a new one?')) return;
      const store = useResumeStore.getState();
      store.loadCloudContent(content);
      store.setResumeId(null);
      router.push('/builder');
      return;
    }
    setCreating(kind);
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error();
      const { resume } = await res.json() as { resume: CloudResume };
      router.push(`/builder?id=${resume.id}`);
    } catch {
      setError("Couldn't create a resume. Check your connection and try again.");
      setCreating(null);
    }
  };

  const duplicate = async (r: CloudResume) => {
    setBusyId(r.id);
    setError('');
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: r.content, title: `${resumeTitle(r)} (copy)` }),
      });
      if (!res.ok) throw new Error();
      const { resume } = await res.json() as { resume: CloudResume };
      setCloud((list) => [resume, ...list]);
    } catch {
      setError(`Couldn't duplicate “${resumeTitle(r)}”.`);
    } finally {
      setBusyId(null);
    }
  };

  const rename = async (r: CloudResume, title: string) => {
    const previous = r.title;
    setCloud((list) => list.map((x) => (x.id === r.id ? { ...x, title: title || null } : x)));
    try {
      const res = await fetch(`/api/resumes/${r.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title || null }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setCloud((list) => list.map((x) => (x.id === r.id ? { ...x, title: previous } : x)));
      setError("Couldn't rename the resume.");
    }
  };

  const remove = async (r: CloudResume) => {
    if (!window.confirm(`Delete “${resumeTitle(r)}”? This can't be undone.`)) return;
    setBusyId(r.id);
    setError('');
    try {
      const res = await fetch(`/api/resumes/${r.id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 404) throw new Error();
      setCloud((list) => list.filter((x) => x.id !== r.id));
      if (r.id === useResumeStore.getState().resumeId) forgetLocalResume();
    } catch {
      setError(`Couldn't delete “${resumeTitle(r)}”.`);
    } finally {
      setBusyId(null);
    }
  };

  const canManage = mode === 'cloud';
  const loading = mode === 'loading' || !hydrated;

  const newButton = (
    <button
      type="button"
      onClick={() => create('blank')}
      disabled={creating !== null || loading || mode === 'offline'}
      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60"
    >
      {creating === 'blank' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      New resume
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-[#0a0a0f]/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="FolioX home">
            <FXMark size={30} />
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              Folio<span className="text-indigo-500">X</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/templates"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white sm:inline-flex"
            >
              Templates
            </Link>
            <ThemeToggle />
            {newButton}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Your resumes</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            {mode === 'local'
              ? 'Cloud save isn’t configured, so this browser keeps a single resume.'
              : 'Saved to the cloud for this browser. Pick up where you left off.'}
          </p>
        </div>

        {mode === 'offline' && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            <CloudOff className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="flex-1">
              Couldn’t reach the cloud, so only the resume on this device is shown.{' '}
              <button type="button" onClick={() => { setMode('loading'); void load(); }} className="font-semibold underline underline-offset-2">
                Try again
              </button>
            </div>
          </div>
        )}

        {error && (
          <div role="alert" className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            <span className="flex-1">{error}</span>
            <button type="button" onClick={() => setError('')} aria-label="Dismiss" className="rounded p-1 hover:bg-red-100 dark:hover:bg-red-500/20">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-6" aria-label="Loading your resumes">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((i) => <div key={i} className="h-[104px] rounded-xl bg-slate-200 dark:bg-gray-800" />)}
            </div>
            <div className="h-56 rounded-xl bg-slate-200 dark:bg-gray-800" />
          </div>
        ) : resumes.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <FileText className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No resumes yet</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-gray-400">
              Start from a blank page, or explore with an example resume you can edit into your own.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {newButton}
              <button
                type="button"
                onClick={() => create('example')}
                disabled={creating !== null || mode === 'offline'}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {creating === 'example' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Start from an example
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatTile
                icon={<FileText className="h-3.5 w-3.5" />}
                label="Resumes"
                value={String(resumes.length)}
                detail={resumes.length === 1 ? '1 resume saved' : `${resumes.length} resumes saved`}
              />
              <StatTile
                icon={<Clock className="h-3.5 w-3.5" />}
                label="Last edited"
                value={latest.updatedAt ? timeAgo(latest.updatedAt) : 'On this device'}
                detail={resumeTitle(latest)}
              />
              <StatTile
                icon={<LayoutTemplate className="h-3.5 w-3.5" />}
                label="Templates in use"
                value={String(templatesUsed)}
                detail={[...new Set(resumes.map((r) => templateLabel(r.content.templateId)))].join(', ')}
              />
            </div>

            {/* Continue editing */}
            <section className="mt-8" aria-labelledby="continue-heading">
              <h2 id="continue-heading" className="mb-3 text-sm font-semibold text-slate-700 dark:text-gray-300">Continue where you left off</h2>
              <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center">
                <button type="button" onClick={() => open(latest)} className="w-36 shrink-0 self-center sm:w-44 sm:self-auto" aria-label={`Open ${resumeTitle(latest)}`}>
                  <Thumbnail content={latest.content} />
                </button>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <Clock className="h-3 w-3" /> Most recent
                  </span>
                  <div className="mt-2">
                    <EditableTitle resume={latest} large onRename={canManage ? (t) => rename(latest, t) : undefined} />
                  </div>
                  {subtitle(latest) && <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-gray-400">{subtitle(latest)}</p>}
                  <p className="mt-3 text-xs text-slate-500 dark:text-gray-400">
                    {templateLabel(latest.content.templateId)}
                    {latest.updatedAt && <> · Edited {timeAgo(latest.updatedAt)}</>}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => open(latest)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                    >
                      <Pencil className="h-4 w-4" /> Continue editing
                    </button>
                    {canManage && (
                      <button
                        type="button"
                        onClick={() => duplicate(latest)}
                        disabled={busyId === latest.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        <Copy className="h-4 w-4" /> Duplicate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* All resumes */}
            <section className="mt-10" aria-labelledby="all-heading">
              <h2 id="all-heading" className="mb-3 text-sm font-semibold text-slate-700 dark:text-gray-300">
                All resumes <span className="font-normal text-slate-400 dark:text-gray-500">({resumes.length})</span>
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* New resume tile */}
                <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-white/50 p-5 text-center dark:border-gray-700 dark:bg-gray-900/40">
                  <button
                    type="button"
                    onClick={() => create('blank')}
                    disabled={creating !== null || mode === 'offline'}
                    className="flex flex-col items-center gap-2 rounded-lg p-2 text-slate-700 transition hover:text-indigo-600 disabled:opacity-60 dark:text-gray-200 dark:hover:text-indigo-400"
                  >
                    <span className="rounded-full bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      {creating === 'blank' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                    </span>
                    <span className="text-sm font-semibold">New blank resume</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => create('example')}
                    disabled={creating !== null || mode === 'offline'}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 underline-offset-2 hover:text-indigo-600 hover:underline disabled:opacity-60 dark:text-gray-400 dark:hover:text-indigo-400"
                  >
                    {creating === 'example' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    or start from an example
                  </button>
                </div>

                {resumes.map((r, i) => (
                  <article
                    key={r.id}
                    className={`group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 ${busyId === r.id ? 'opacity-60' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => open(r)}
                      className="relative block bg-slate-100 px-6 pt-5 dark:bg-gray-950"
                      aria-label={`Open ${resumeTitle(r)}`}
                    >
                      <Thumbnail content={r.content} />
                      {i === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white">Latest</span>
                      )}
                    </button>
                    <div className="flex flex-1 flex-col gap-1 border-t border-slate-100 p-4 dark:border-gray-800">
                      <EditableTitle resume={r} onRename={canManage ? (t) => rename(r, t) : undefined} />
                      {subtitle(r) && <p className="truncate text-xs text-slate-500 dark:text-gray-400">{subtitle(r)}</p>}
                      <p className="text-xs text-slate-400 dark:text-gray-500">
                        {templateLabel(r.content.templateId)}
                        {r.updatedAt && <> · {timeAgo(r.updatedAt)}</>}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <button
                          type="button"
                          onClick={() => open(r)}
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                          Open
                        </button>
                        {canManage && (
                          <div className="flex items-center">
                            <IconAction label={`Duplicate ${resumeTitle(r)}`} onClick={() => duplicate(r)} disabled={busyId === r.id}>
                              <Copy className="h-4 w-4" />
                            </IconAction>
                            <IconAction label={`Delete ${resumeTitle(r)}`} onClick={() => remove(r)} disabled={busyId === r.id} danger>
                              <Trash2 className="h-4 w-4" />
                            </IconAction>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
