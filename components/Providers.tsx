'use client';

import React from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DialogProvider } from '@/components/ui/DialogProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange={false}>
      <DialogProvider>{children}</DialogProvider>
    </ThemeProvider>
  );
}
