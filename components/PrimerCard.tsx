import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { Primer } from '@/lib/types';

export function PrimerCard({ primer }: { primer: Primer }) {
  return (
    <Link href={`/primers/${primer.slug}`} className="block group">
      <article className="flex flex-col h-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-card px-5 pt-5 pb-5 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">

        {/* Top row: category chip (left) + clock + read time (right) */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-block border border-stone-300 dark:border-stone-600 rounded px-2 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400">
            {primer.category}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-sans text-stone-400 dark:text-stone-500">
            <Clock size={12} />
            <span>{primer.readTimeMinutes} MIN</span>
          </div>
        </div>

        {/* Large serif title */}
        <h3 className="font-serif text-[28px] leading-tight text-stone-900 dark:text-stone-50 tracking-tight mb-3 group-hover:underline decoration-stone-400 dark:decoration-stone-500 underline-offset-2">
          {primer.title}
        </h3>

        {/* Short description / strapline */}
        <p className="text-sm font-sans text-stone-500 dark:text-stone-400 leading-relaxed mb-4 line-clamp-2">
          {primer.strapline}
        </p>

        {/* Thin divider + READ PRIMER link */}
        <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800">
          <span className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-50 transition-colors">
            READ PRIMER ↗
          </span>
        </div>

      </article>
    </Link>
  );
}
