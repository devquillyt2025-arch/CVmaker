import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">404</p>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">This page doesn&apos;t exist</h1>
      <div className="flex gap-3">
        <Link href="/" className="rounded-full border border-slate-300 dark:border-gray-700 px-5 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800">
          Home
        </Link>
        <Link href="/builder" className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
          Open Builder
        </Link>
      </div>
    </div>
  );
}
