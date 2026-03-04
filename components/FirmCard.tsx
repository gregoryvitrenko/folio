import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { FirmProfile, FirmTier } from '@/lib/types';

const TIER_BADGE: Record<FirmTier, string> = {
  'Magic Circle':
    'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  'Silver Circle':
    'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800',
  'International':
    'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800',
  'US Firms':
    'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  'Boutique':
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
};

export function FirmCard({ firm }: { firm: FirmProfile }) {
  return (
    <Link href={`/firms/${firm.slug}`} className="block group">
      <article className="flex flex-col h-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm px-5 pt-5 pb-5 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
        {/* Name row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="font-serif text-[18px] font-bold leading-snug text-stone-900 dark:text-stone-50 tracking-tight group-hover:underline decoration-stone-400 dark:decoration-stone-500 underline-offset-2">
              {firm.name}
            </h3>
            {firm.shortName !== firm.name && (
              <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">
                {firm.shortName}
              </span>
            )}
          </div>
          <span
            className={`shrink-0 mt-0.5 inline-block text-[10px] font-sans font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-sm ${TIER_BADGE[firm.tier]}`}
          >
            {firm.tier}
          </span>
        </div>

        {/* Practice area chips (top 3) */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {firm.practiceAreas.slice(0, 3).map((area) => (
            <span
              key={area}
              className="inline-block text-[10px] font-sans font-medium px-2 py-0.5 rounded-sm bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700"
            >
              {area}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-auto pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-stone-400 dark:text-stone-500">
              <span className="font-mono font-semibold text-stone-600 dark:text-stone-300">
                {firm.trainingContract.intakeSizeNote}
              </span>
              {' '}intake
            </span>
            <span className="text-[11px] text-stone-400 dark:text-stone-500">
              NQ{' '}
              <span className="font-mono font-semibold text-stone-600 dark:text-stone-300">
                {firm.trainingContract.nqSalaryNote}
              </span>
            </span>
          </div>
          <ChevronRight
            size={14}
            className="shrink-0 text-stone-300 dark:text-stone-600 group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors"
          />
        </div>
      </article>
    </Link>
  );
}
