import { notFound } from 'next/navigation';
import { getTestBySlug } from '@/lib/tests-data';
import { requireSubscription } from '@/lib/paywall';
import { TestSession } from '@/components/TestSession';

export const dynamic = 'force-dynamic';

const FULL_COUNTS: Record<string, number> = {
  'watson-glaser': 40,
  'sjt': 25,
};

export default async function PracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string; format?: string }>;
}) {
  await requireSubscription();
  const { slug } = await params;
  const { mode, format } = await searchParams;

  const test = getTestBySlug(slug);
  if (!test) notFound();

  const practiceMode = mode === 'official' ? 'official' : 'feedback';
  const practiceFormat: 'quick' | 'full' = format === 'full' ? 'full' : 'quick';
  const questionCount = practiceFormat === 'full' ? (FULL_COUNTS[test.slug] ?? 25) : 10;

  return (
    <TestSession
      testType={test.slug}
      mode={practiceMode}
      questionCount={questionCount}
      format={practiceFormat}
    />
  );
}
