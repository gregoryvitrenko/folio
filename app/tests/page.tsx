import { Header } from '@/components/Header';
import { TestCard } from '@/components/TestCard';
import { TESTS } from '@/lib/tests-data';
import { requireSubscription } from '@/lib/paywall';
import { getTodayDate } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function TestsPage() {
  await requireSubscription();
  const today = getTodayDate();

  return (
    <>
      <Header date={today} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Page heading */}
        <div className="space-y-4 mb-12 text-center">
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold opacity-40 font-sans">
            Aptitude Preparation
          </span>
          <h2 className="text-5xl font-serif">Psychometric Tests</h2>
          <p className="opacity-60 text-lg font-light">Watson Glaser and SJT practice.</p>
        </div>

        {/* Test grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TESTS.map((test) => (
            <TestCard key={test.slug} test={test} />
          ))}
        </div>
      </main>
    </>
  );
}
