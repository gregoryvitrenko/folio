import { Header } from '@/components/Header';
import { getTodayDate } from '@/lib/storage';

const TAB_WIDTHS = [48, 72, 68, 88, 60, 76, 60];

export default function HomeLoading() {
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

        {/* Story card skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm p-5 space-y-3"
            >
              <div className="h-2.5 w-14 bg-stone-100 dark:bg-stone-800 rounded-sm" />
              <div className="space-y-2">
                <div className="h-5 w-full bg-stone-100 dark:bg-stone-800 rounded-sm" />
                <div className="h-5 w-4/5 bg-stone-100 dark:bg-stone-800 rounded-sm" />
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="h-2.5 w-full bg-stone-100 dark:bg-stone-800 rounded-sm" />
                <div className="h-2.5 w-5/6 bg-stone-100 dark:bg-stone-800 rounded-sm" />
              </div>
            </div>
          ))}
        </div>

      </main>
    </>
  );
}
