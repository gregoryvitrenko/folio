'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ClipboardList, GraduationCap } from 'lucide-react';

interface TestPracticeProps {
  testType: string;
}

export function TestPractice({ testType }: TestPracticeProps) {
  const [mode, setMode] = useState<'feedback' | 'official'>('feedback');

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm px-6 py-6">
      <div className="flex items-center gap-2 mb-5">
        <GraduationCap size={13} className="text-stone-400 dark:text-stone-500" />
        <span className="font-sans text-[10px] font-semibold tracking-[0.15em] uppercase text-stone-500 dark:text-stone-400">
          Practice Session
        </span>
      </div>

      <p className="text-[13px] text-stone-500 dark:text-stone-400 mb-4">Choose your practice mode:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setMode('feedback')}
          className={`text-left rounded-sm border px-4 py-3 transition-colors ${
            mode === 'feedback'
              ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800'
              : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={12} className="text-stone-500 dark:text-stone-400 shrink-0" />
            <span className="text-[12px] font-semibold text-stone-800 dark:text-stone-200">Feedback as you go</span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
            See the correct answer and explanation after each question. Best for learning.
          </p>
        </button>

        <button
          onClick={() => setMode('official')}
          className={`text-left rounded-sm border px-4 py-3 transition-colors ${
            mode === 'official'
              ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800'
              : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList size={12} className="text-stone-500 dark:text-stone-400 shrink-0" />
            <span className="text-[12px] font-semibold text-stone-800 dark:text-stone-200">Official practice</span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
            Answer all questions first, then receive your full report. Simulates the real test.
          </p>
        </button>
      </div>

      <Link
        href={`/tests/${testType}/practice?mode=${mode}`}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-[12px] font-semibold rounded-sm hover:opacity-90 transition-opacity"
      >
        <GraduationCap size={13} />
        Start Practice
      </Link>
    </div>
  );
}
