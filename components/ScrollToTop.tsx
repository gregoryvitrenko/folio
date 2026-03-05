'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 p-2.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 shadow-lg hover:bg-stone-700 dark:hover:bg-stone-300 transition-all duration-200 opacity-80 hover:opacity-100"
    >
      <ArrowUp size={14} />
    </button>
  );
}
