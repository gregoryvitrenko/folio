'use client';

import { ThemeProvider } from 'next-themes';
import { BookmarksProvider } from '@/components/BookmarksProvider';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <BookmarksProvider>
        {children}
      </BookmarksProvider>
    </ThemeProvider>
  );
}
