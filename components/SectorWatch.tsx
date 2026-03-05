import { TrendingUp } from 'lucide-react';
import type { SectorWatchData, OneToFollowData } from '@/lib/types';

interface SectorWatchProps {
  sectorWatch: string | SectorWatchData;
  oneToFollow: string | OneToFollowData;
}

function isSWData(v: unknown): v is SectorWatchData {
  return typeof v === 'object' && v !== null && 'trend' in v && 'body' in v;
}

function isOTFData(v: unknown): v is OneToFollowData {
  return typeof v === 'object' && v !== null && 'story' in v && 'why' in v;
}

export function SectorWatch({ sectorWatch, oneToFollow }: SectorWatchProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* ── Sector Watch ── */}
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm px-6 pt-5 pb-6 overflow-hidden">
        {/* Top editorial accent line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-stone-900 dark:bg-stone-100" />

        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={11} className="text-stone-500 dark:text-stone-400 flex-shrink-0" />
          <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400">
            Sector Watch
          </span>
        </div>

        {isSWData(sectorWatch) ? (
          <>
            <h3 className="font-serif text-[20px] font-bold leading-tight text-stone-900 dark:text-stone-50 mb-3">
              {sectorWatch.trend}
            </h3>
            <p className="text-[14px] text-stone-600 dark:text-stone-400 leading-[1.75]">
              {sectorWatch.body}
            </p>
          </>
        ) : (
          <p className="text-[15px] text-stone-700 dark:text-stone-300 leading-[1.7]">
            {sectorWatch}
          </p>
        )}
      </div>

      {/* ── One to Follow ── */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm px-6 pt-5 pb-6">
        <div className="flex items-center gap-2 mb-4">
          {/* Pulsing amber dot — signals developing/live story */}
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 dark:bg-amber-500 opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-amber-400" />
          </span>
          <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400">
            One to Follow
          </span>
        </div>

        {isOTFData(oneToFollow) ? (
          <>
            <p className="text-[15px] font-semibold text-stone-900 dark:text-stone-50 leading-snug mb-3">
              {oneToFollow.story}
            </p>
            <p className="text-[13px] text-stone-500 dark:text-stone-400 leading-[1.65]">
              {oneToFollow.why}
            </p>
          </>
        ) : (
          <p className="text-[15px] text-stone-700 dark:text-stone-300 leading-[1.7]">
            {oneToFollow}
          </p>
        )}
      </div>

    </div>
  );
}
