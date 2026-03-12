import { AlertTriangle } from 'lucide-react';
import { Header } from '@/components/Header';
import { FirmsDirectory } from '@/components/FirmsDirectory';
import { FIRMS } from '@/lib/firms-data';
import { requireSubscription } from '@/lib/paywall';
import { getTodayDate } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function FirmsPage() {
  await requireSubscription();
  const today = getTodayDate();

  return (
    <>
      <Header date={today} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Page heading */}
        <div className="space-y-4 mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold opacity-40 font-sans">
            Directory
          </span>
          <h2 className="text-5xl font-serif">Law Firm Profiles</h2>
          <p className="max-w-xl opacity-60 text-lg font-light">46 firms. Magic Circle to boutique.</p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 rounded-card bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 px-4 py-3 mb-8">
          <AlertTriangle size={13} className="shrink-0 mt-0.5 text-stone-400 dark:text-stone-500" />
          <p className="text-[12px] text-stone-500 dark:text-stone-400 leading-relaxed">
            Deadline windows shown are approximate and based on typical prior-year cycles.
            Always verify opening and closing dates on each firm&apos;s official graduate recruitment page before applying.
          </p>
        </div>

        {/* Search + tier jump links + firm grid — all client-side */}
        <FirmsDirectory firms={FIRMS} />

      </main>
    </>
  );
}
