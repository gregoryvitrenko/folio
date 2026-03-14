import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upgrade to Folio',
  description: 'Get full access to Folio for £4/month — daily commercial awareness briefings, firm profiles, interview prep, aptitude tests, and audio briefings. Built for UK law students targeting training contracts.',
  openGraph: {
    title: 'Upgrade to Folio — £4/month',
    description: 'Daily commercial awareness briefings, firm profiles, interview prep, Watson Glaser practice, and audio briefings for UK law students targeting Magic Circle training contracts.',
  },
};

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
