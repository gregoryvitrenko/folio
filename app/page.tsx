import { getBriefing, getLatestBriefing, getTodayDate } from '@/lib/storage';
import { Header } from '@/components/Header';
import { BriefingView } from '@/components/BriefingView';
import { GenerateButton } from '@/components/GenerateButton';
import { LandingHero } from '@/components/LandingHero';
import { YourFirmsStrip } from '@/components/YourFirmsStrip';
import { getSubscriptionStatus } from '@/lib/paywall';
import { getOnboarding } from '@/lib/onboarding';
import { auth } from '@clerk/nextjs/server';

const ADMIN_USER_ID = 'user_3AR29PSfsNfmy9wxcyjCvplC7hH';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const today = getTodayDate();
  const { userId } = await auth();
  const isAdmin = userId === ADMIN_USER_ID;

  const [briefing, subscriptionStatus, onboardingData] = await Promise.all([
    getBriefing(today).then((b) => b ?? getLatestBriefing()),
    getSubscriptionStatus(),
    userId ? getOnboarding(userId) : Promise.resolve(null),
  ]);

  const subscribed = subscriptionStatus === 'subscribed';
  const showFirmsStrip =
    subscribed &&
    (onboardingData?.targetFirms?.length ?? 0) > 0;

  if (!briefing) {
    return (
      <>
        <Header date={today} />
        {(subscriptionStatus === 'unauthenticated' || subscriptionStatus === 'free') && <LandingHero />}
        {showFirmsStrip && <YourFirmsStrip slugs={onboardingData!.targetFirms} />}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center text-center gap-10">
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 dark:text-stone-500 font-sans">
              No briefing yet
            </p>
            <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
              Your morning briefing will appear here
            </h2>
            <p className="text-[15px] text-stone-500 dark:text-stone-400 max-w-sm leading-[1.7]">
              Generate your first briefing using live web search and AI synthesis.
            </p>
          </div>
          {isAdmin && <GenerateButton />}
        </main>
      </>
    );
  }

  const isStale = briefing.date !== today;

  return (
    <>
      <Header date={today} />
      {(subscriptionStatus === 'unauthenticated' || subscriptionStatus === 'free') && <LandingHero />}
      {showFirmsStrip && <YourFirmsStrip slugs={onboardingData!.targetFirms} />}
      {isStale && isAdmin && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5">
          <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-card bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Showing briefing from {briefing.date} — today&apos;s hasn&apos;t been generated yet.
            </p>
            <GenerateButton />
          </div>
        </div>
      )}
      <BriefingView briefing={briefing} subscribed={subscribed} />
    </>
  );
}
