import type { Briefing } from '@/lib/types';
import { StoryGrid } from './StoryGrid';
import { SectorWatch } from './SectorWatch';
import { PodcastPlayer } from './PodcastPlayer';
import { QuizBanner } from './QuizBanner';

interface BriefingViewProps {
  briefing: Briefing;
  subscribed?: boolean;
}

export function BriefingView({ briefing, subscribed = false }: BriefingViewProps) {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-28">

      {/* Podcast player */}
      <PodcastPlayer briefing={briefing} />

      {/* Daily quiz entry point */}
      <QuizBanner date={briefing.date} />

      {/* Story grid with practice group tabs */}
      <div className="mb-12">
        <StoryGrid stories={briefing.stories} date={briefing.date} subscribed={subscribed} />
      </div>

      {/* Bigger Picture */}
      {(briefing.sectorWatch || briefing.oneToFollow) && (
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 font-sans flex-shrink-0">
              Bigger Picture
            </span>
            <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
          </div>
          <SectorWatch
            sectorWatch={briefing.sectorWatch}
            oneToFollow={briefing.oneToFollow}
          />
        </section>
      )}

      {/* Footer */}
      <footer className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="font-mono text-[10px] text-stone-400 dark:text-stone-600 tracking-wide">
          Updated{' '}
          {new Date(briefing.generatedAt).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/London',
          })}{' '}
          GMT · {briefing.stories.length} stories
        </p>
        <p className="font-serif text-[11px] text-stone-400 dark:text-stone-600 italic">
          Commercial Awareness Daily
        </p>
      </footer>

    </main>
  );
}
