import { notFound } from 'next/navigation';
import { getBriefing } from '@/lib/storage';
import { Header } from '@/components/Header';
import { BriefingView } from '@/components/BriefingView';
import { requireSubscription } from '@/lib/paywall';
import { isValidDate } from '@/lib/security';

interface Params {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: Params) {
  const { date } = await params;
  return {
    title: `${date} · Commercial Awareness Daily`,
  };
}

export const dynamic = 'force-dynamic';

export default async function ArchiveDatePage({ params }: Params) {
  await requireSubscription();
  const { date } = await params;

  if (!isValidDate(date)) {
    notFound();
  }

  const briefing = await getBriefing(date);
  if (!briefing) notFound();

  return (
    <>
      <Header date={new Date().toISOString().split('T')[0]} isArchive archiveDate={date} />
      <BriefingView briefing={briefing} />
    </>
  );
}
