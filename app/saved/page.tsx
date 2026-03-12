import { getTodayDate } from '@/lib/storage';
import { Header } from '@/components/Header';
import { SavedView } from '@/components/SavedView';
import { requireSubscription } from '@/lib/paywall';

export const dynamic = 'force-dynamic';

export default async function SavedPage() {
  await requireSubscription();
  const today = getTodayDate();

  return (
    <>
      <Header date={today} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-4 mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold opacity-40 font-sans">
            Your Library
          </span>
          <h2 className="text-5xl font-serif">Saved Articles</h2>
          <p className="max-w-xl opacity-60 text-lg font-light">Bookmarked stories and notes.</p>
        </div>
        <SavedView today={today} />
      </main>
    </>
  );
}
