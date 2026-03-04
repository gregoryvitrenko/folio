import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { PrimerView } from '@/components/PrimerView';
import { getPrimerBySlug } from '@/lib/primers-data';
import { requireSubscription } from '@/lib/paywall';
import { getTodayDate } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function PrimerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireSubscription();
  const { slug } = await params;
  const primer = getPrimerBySlug(slug);
  if (!primer) notFound();

  const today = getTodayDate();

  return (
    <>
      <Header date={today} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <PrimerView primer={primer} />
      </main>
    </>
  );
}
