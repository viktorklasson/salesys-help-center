'use client';

import React, { useEffect, useState } from 'react';

import type { Heading } from '@/lib/headings';
import './TableOfContents.css';

/**
 * The headings of a text as links. Clicking one jumps to that chapter; the chapter you're
 * reading is highlighted while scrolling.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      // The last heading that has scrolled past the top (below the sticky header)
      let current: string | null = null;
      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActiveId(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [headings]);

  return (
    <nav aria-label="Innehåll" className="toc">
      <p className="toc-title">Innehåll</p>
      <ol>
        {headings.map(({ id, level, text }) => (
          <li className={`toc-level-${Math.min(level, 4)}`} key={id}>
            <a aria-current={id === activeId ? 'location' : undefined} href={`#${id}`}>
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
