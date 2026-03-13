import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { Primer } from '@/lib/types';

export function PrimerCard({ primer }: { primer: Primer }) {
  return (
    <Link href={`/primers/${primer.slug}`} className="block group">
      <article className="flex flex-col h-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-card px-5 pt-5 pb-5 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">

        {/* Category chip — text only, no icon, no color background */}
        <div className="mb-3">
          <span className="section-label text-stone-500 dark:text-stone-400">{primer.category}</span>
        </div>

        {/* Serif title */}
        <h3 className="font-serif text-[18px] font-bold leading-snug text-stone-900 dark:text-stone-50 tracking-tight group-hover:underline decoration-stone-400 dark:decoration-stone-500 underline-offset-2 mb-3">
          {primer.title}
        </h3>

        {/* Clock + read time */}
        <div className="flex items-center gap-1.5 text-caption text-stone-400 dark:text-stone-500 mb-4">
          <Clock size={12} />
          <span>{primer.readTimeMinutes} min read</span>
        </div>

        {/* Thin divider + READ PRIMER link text */}
        <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800">
          <span className="text-[11px] font-sans font-semibold tracking-[0.08em] uppercase text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-50 transition-colors">
            Read Primer ↗
          </span>
        </div>

      </article>
    </Link>
  );
}
