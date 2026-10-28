import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FolioX — Resumes that open doors.',
  description:
    'A free resume builder that runs in your browser. Seven typeset templates, a live preview of the exact page you export, and AI help for the hard parts. No sign-up.',
  keywords: ['ATS resume', 'resume builder', 'resume templates', 'PDF resume', 'CV maker'],
  icons: {
    icon: '/foliox-logo.png',
    apple: '/foliox-logo.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
<body className="font-sans antialiased text-[#e2e8f0] dark:bg-[#0A0A0F] bg-gray-50 transition-colors duration-200">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
