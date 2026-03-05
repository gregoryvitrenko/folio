import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getOnboarding } from '@/lib/onboarding';
import { FIRMS } from '@/lib/firms-data';
import { OnboardingForm } from './OnboardingForm';

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  // Fetch existing data for pre-fill (or null if first time)
  const existing = await getOnboarding(userId);

  const firms = FIRMS.map((f) => ({ slug: f.slug, shortName: f.shortName }));

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col">

      {/* Minimal header — matches sign-in/sign-up pages */}
      <header className="border-b border-stone-200 dark:border-stone-800">
        <div className="h-[3px] bg-stone-900 dark:bg-stone-100" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center">
          <Link href="/" className="inline-block">
            <h1 className="font-serif text-[22px] sm:text-[28px] font-bold tracking-tight text-stone-900 dark:text-stone-50 hover:opacity-75 transition-opacity">
              Commercial Awareness
            </h1>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <OnboardingForm firms={firms} initialData={existing} />
      </main>

    </div>
  );
}
