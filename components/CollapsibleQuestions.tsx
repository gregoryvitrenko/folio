'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleQuestionsProps {
  questions: string[];
  firmShortName: string;
}

export function CollapsibleQuestions({ questions, firmShortName }: CollapsibleQuestionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between gap-3 group"
      >
        <p className="section-label">Practice Questions</p>
        <ChevronDown
          size={14}
          className={`text-stone-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {!open && (
        <p className="text-caption text-stone-400 dark:text-stone-500 mt-2">
          {questions.length} questions — click to expand
        </p>
      )}

      {open && (
        <div className="mt-4">
          <p className="text-caption text-stone-400 dark:text-stone-500 mb-5 leading-relaxed">
            {questions.length} questions tailored to {firmShortName} — drawn from the firm&apos;s profile, practice areas, and recent news. Try answering each one aloud.
          </p>
          <ol className="space-y-4">
            {questions.map((question, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 font-serif text-body text-stone-400 dark:text-stone-500 leading-none mt-0.5 w-6 text-right">
                  {i + 1}.
                </span>
                <p className="text-body text-stone-700 dark:text-stone-300 leading-relaxed">
                  {question}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
