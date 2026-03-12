import React from 'react';
import Link from 'next/link';
import { TrendingUp, BarChart2, Landmark, Zap, Scale, Gavel, Globe, Bot, ChevronRight } from 'lucide-react';
import type { Primer, TopicCategory } from '@/lib/types';
import { TOPIC_STYLES } from '@/lib/types';

const TOPIC_ICONS: Record<TopicCategory, React.ElementType> = {
  'M&A':              TrendingUp,
  'Capital Markets':  BarChart2,
  'Banking & Finance': Landmark,
  'Energy & Tech':    Zap,
  'Regulation':       Scale,
  'Disputes':         Gavel,
  'International':    Globe,
  'AI & Law':         Bot,
};

const TOPIC_ICON_COLORS: Record<TopicCategory, string> = {
  'M&A':              'text-blue-700 dark:text-blue-400',
  'Capital Markets':  'text-violet-700 dark:text-violet-400',
  'Banking & Finance':'text-orange-700 dark:text-orange-400',
  'Energy & Tech':    'text-emerald-700 dark:text-emerald-400',
  'Regulation':       'text-amber-700 dark:text-amber-400',
  'Disputes':         'text-rose-700 dark:text-rose-400',
  'International':    'text-teal-700 dark:text-teal-400',
  'AI & Law':         'text-indigo-700 dark:text-indigo-400',
};

export function PrimerCard({ primer }: { primer: Primer }) {
  const styles = TOPIC_STYLES[primer.category];
  const Icon = TOPIC_ICONS[primer.category];
  const iconColor = TOPIC_ICON_COLORS[primer.category];

  return (
    <Link href={`/primers/${primer.slug}`} className="block group">
      <article className="flex flex-col h-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-card px-5 pt-5 pb-5 hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
        {/* Icon + category row */}
        <div className="flex items-center gap-2 mb-4">
          <Icon size={20} className={iconColor} />
          <span className={`section-label ${styles.label}`}>{primer.category}</span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-[18px] font-bold leading-snug text-stone-900 dark:text-stone-50 tracking-tight group-hover:underline decoration-stone-400 dark:decoration-stone-500 underline-offset-2 mb-2">
          {primer.title}
        </h3>

        {/* Strapline — capped at 2 lines */}
        <p className="text-caption text-stone-500 dark:text-stone-400 leading-relaxed mb-4 line-clamp-2">
          {primer.strapline}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-stone-400 dark:text-stone-500">
              <span className="font-sans font-semibold text-stone-600 dark:text-stone-300">{primer.sections.length}</span>{' '}sections
            </span>
            {primer.interviewQs && primer.interviewQs.length > 0 && (
              <span className="text-[11px] text-stone-400 dark:text-stone-500">
                <span className="font-sans font-semibold text-stone-600 dark:text-stone-300">{primer.interviewQs.length}</span>{' '}interview Qs
              </span>
            )}
          </div>
          <ChevronRight size={14} className="shrink-0 text-stone-300 dark:text-stone-600 group-hover:text-stone-500 dark:group-hover:text-stone-400 transition-colors" />
        </div>
      </article>
    </Link>
  );
}
