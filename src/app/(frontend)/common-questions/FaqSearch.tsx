'use client';

import { Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { normalize } from '@/lib/search';

/**
 * A search box above the questions. Filters on the question and the answer text
 * (each <details> carries it in data-search); every word typed has to match.
 * Categories without any match are hidden.
 */
export function FaqSearch({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const words = normalize(query).split(' ').filter(Boolean);
    let count = 0;

    for (const section of list.querySelectorAll<HTMLElement>(':scope > section')) {
      let visibleInSection = 0;
      for (const item of section.querySelectorAll<HTMLElement>('[data-search]')) {
        const text = item.dataset.search ?? '';
        const visible = words.every((word) => text.includes(word));
        item.hidden = !visible;
        if (visible) visibleInSection++;
      }
      section.hidden = visibleInSection === 0;
      count += visibleInSection;
    }

    setMatches(words.length ? count : null);
  }, [query]);

  return (
    <>
      <div className="faq-search">
        <Search aria-hidden className="faq-search-icon" size={18} />
        <input
          aria-label="Sök bland vanliga frågor"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === 'Escape' && setQuery('')}
          placeholder="Sök bland frågor och svar…"
          type="search"
          value={query}
        />
        {query && (
          <button
            aria-label="Rensa sökningen"
            className="faq-search-clear"
            onClick={() => setQuery('')}
            type="button"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {matches !== null && (
        <p aria-live="polite" className="faq-search-result">
          {matches === 0
            ? `Inga frågor matchar "${query.trim()}".`
            : `${matches} ${matches === 1 ? 'fråga' : 'frågor'} matchar.`}
        </p>
      )}

      <div ref={listRef}>{children}</div>
    </>
  );
}
