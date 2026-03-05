import type { Metadata } from 'next';
import { FirmQuiz } from '@/components/FirmQuiz';

export const metadata: Metadata = {
  title: 'Which law firm suits you? · Commercial Awareness Daily',
  description:
    'Take our free 2-minute quiz to discover which type of law firm matches your personality, ambitions, and working style. Get personalised firm recommendations from 38 profiles.',
};

export default function FirmFitPage() {
  return <FirmQuiz />;
}
