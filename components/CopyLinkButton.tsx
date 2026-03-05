'use client';

import { useState } from 'react';
import { Link, Check } from 'lucide-react';

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-sans tracking-wide
        border transition-all duration-200 shrink-0
        ${
          copied
            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-700 dark:hover:text-stone-200'
        }
      `}
      title="Copy link to article"
    >
      {copied ? (
        <>
          <Check size={11} />
          Copied
        </>
      ) : (
        <>
          <Link size={11} />
          Copy link
        </>
      )}
    </button>
  );
}
