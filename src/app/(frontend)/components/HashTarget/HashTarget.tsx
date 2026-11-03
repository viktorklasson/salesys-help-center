'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Makes links like /common-questions#q-… or /api-reference/dial#get-api-dial-calls-v1 work
 * for content inside a closed <details>: opens it, then scrolls to it.
 */
export function HashTarget() {
  const pathname = usePathname();

  useEffect(() => {
    const openTarget = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id && document.getElementById(id);
      if (!target) return;

      // The target itself, or a <details> directly inside it (e.g. an <li>)
      const own =
        target instanceof HTMLDetailsElement
          ? target
          : target.querySelector<HTMLDetailsElement>(':scope > details');
      if (own) own.open = true;

      // Every <details> around it
      let parent = target.parentElement?.closest('details');
      while (parent) {
        parent.open = true;
        parent = parent.parentElement?.closest('details');
      }

      target.scrollIntoView({ block: 'start' });
    };

    openTarget();
    window.addEventListener('hashchange', openTarget);
    return () => window.removeEventListener('hashchange', openTarget);
  }, [pathname]);

  return null;
}
