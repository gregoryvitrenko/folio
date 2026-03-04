import { notFound } from 'next/navigation';
import { getTestBySlug } from '@/lib/tests-data';
import { requireSubscription } from '@/lib/paywall';
import { TestSession } from '@/components/TestSession';

export const dynamic = 'force-dynamic';

export default async function PracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  await requireSubscription();
  const { slug } = await params;
  const { mode } = await searchParams;

  const test = getTestBySlug(slug);
  if (!test) notFound();

  const practiceMode = mode === 'official' ? 'official' : 'feedback';

  return <TestSession testType={test.slug} mode={practiceMode} />;
}
