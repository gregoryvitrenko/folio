import { Header } from '@/components/Header';
import { getTodayDate } from '@/lib/storage';

const TAB_WIDTHS = [48, 72, 68, 88, 60, 76, 60];
const ARTICLE_LINES = [100, 83, 67];

export default function TopicLoading() {
  const today = getTodayDate();
  return (
    <>
      <Header date={today} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Tab bar skeleton */}
        <div className="flex items-center gap-1 border-b border-stone-200 dark:border-stone-800 mb-6 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-2.5">
          {TAB_WIDTHS.map((w, i) => (
            <div
              key={i}
              className="h-2 rounded-sm animate-pulse bg-stone-100 dark:bg-stone-800 flex-shrink-0"
              style={{ width: w }}
            />
          ))}
        </div>

        {/* Heading skeleton */}
        <div className="mb-8 mt-4 animate-pulse space-y-3">
          <div className="h-10 w-52 bg-stone-100 dark:bg-stone-800 rounded-sm" />
          <div className="h-2.5 w-20 bg-stone-100 dark:bg-stone-800 rounded-sm" />
        </div>

        {/* Article skeletons */}
        <div className="space-y-12">
          {[0, 1].map((i) => (
            <div key={i} className="animate-pulse space-y-3 border-b border-stone-100 dark:border-stone-800 pb-10">
              <div className="h-2.5 w-14 bg-stone-100 dark:bg-stone-800 rounded-sm" />
              <div className="h-7 w-3/4 bg-stone-100 dark:bg-stone-800 rounded-sm" />
              <div className="space-y-2 pt-1">
                {ARTICLE_LINES.map((pct, j) => (
                  <div
                    key={j}
                    className="h-2.5 bg-stone-100 dark:bg-stone-800 rounded-sm"
                    style={{ width: `${pct}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

      </main>
    </>
  );
}
