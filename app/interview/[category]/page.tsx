import { notFound } from 'next/navigation';
import { requireSubscription } from '@/lib/paywall';
import { getTodayDate } from '@/lib/storage';
import { getCategoryBySlug, getQuestionsByCategory } from '@/lib/interview-data';
import { InterviewPractice } from '@/components/InterviewPractice';

export const dynamic = 'force-dynamic';

export default async function InterviewCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  await requireSubscription();
  const { category } = await params;

  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const questions = getQuestionsByCategory(cat.slug);
  const today = getTodayDate();

  return (
    <InterviewPractice
      category={cat}
      questions={questions}
      date={today}
    />
  );
}
