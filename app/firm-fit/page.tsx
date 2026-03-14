import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { getTodayDate } from '@/lib/storage';

export const metadata: Metadata = {
  title: 'Fit Assessment · Folio',
  description:
    'Discover which firms and practice areas align with your professional profile.',
};

const ASSESSMENTS = [
  {
    number: '01',
    title: 'Firm Fit',
    description: 'A values-based assessment to match your personality with firm cultures.',
    href: '/firm-fit/quiz',
    dark: true,
  },
  {
    number: '02',
    title: 'Area Fit',
    description: 'Analyse your skills to find the practice areas where you\'ll excel.',
    href: '/area-fit',
    dark: false,
  },
];

export default function FitPage() {
  const today = getTodayDate();

  return (
    <>
      <Header date={today} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">

        {/* Heading */}
        <div className="text-center space-y-3 mb-16">
          <span className="section-label opacity-40">Strategic Alignment</span>
          <h1 className="font-serif text-5xl text-stone-900 dark:text-stone-50">
            Fit Assessment
          </h1>
          <p className="text-base text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            Discover which firms and practice areas align with your professional profile.
          </p>
        </div>

        {/* Two assessment cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {ASSESSMENTS.map((a) => (
            <div
              key={a.number}
              className={`rounded-3xl p-8 flex flex-col justify-between min-h-[340px] ${
                a.dark
                  ? 'bg-stone-900 dark:bg-stone-950 text-white'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-50'
              }`}
            >
              <div className="space-y-4">
                <p className={`section-label ${a.dark ? 'text-stone-500' : 'text-stone-400'}`}>
                  Assessment {a.number}
                </p>
                <h2 className={`font-serif text-3xl ${a.dark ? 'text-white' : 'text-stone-900 dark:text-stone-50'}`}>
                  {a.title}
                </h2>
                <p className={`text-sm leading-relaxed ${a.dark ? 'text-stone-400' : 'text-stone-500 dark:text-stone-400'}`}>
                  {a.description}
                </p>
              </div>

              <Link
                href={a.href}
                className={`mt-8 block w-full text-center py-3.5 rounded-full font-sans text-label font-semibold tracking-widest uppercase transition-colors ${
                  a.dark
                    ? 'bg-white text-stone-900 hover:bg-stone-100'
                    : 'border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:border-stone-500 dark:hover:border-stone-400'
                }`}
              >
                Start Assessment
              </Link>
            </div>
          ))}
        </div>

      </main>
    </>
  );
}
