'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Opens the section with this id (also inside a closed <details>) and scrolls to its start */
const openTarget = (id: string, behavior: ScrollBehavior) => {
  const target = id && document.getElementById(id);
  if (!target) return false;

  // Open without the opening animation (globals.css), so the page has its full height before scrolling
  const root = document.documentElement;
  root.setAttribute('data-instant-open', '');

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

  // scroll-margin-top (globals.css) keeps it below the sticky header
  target.scrollIntoView({ block: 'start', behavior });
  // Opening by hand animates again from the next frame on
  requestAnimationFrame(() => root.removeAttribute('data-instant-open'));
  return true;
};

const smooth = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

const hashId = () => decodeURIComponent(window.location.hash.slice(1));

/**
 * Makes #links work everywhere, also for content inside a closed <details>
 * (e.g. /common-questions#q-… or /api-reference/dial#get-api-dial-calls-v1):
 * - opening a page with a #link jumps straight to the section
 * - clicking a #link on the page glides there (instantly for visitors who prefer less motion)
 */
export function HashTarget() {
  const pathname = usePathname();

  useEffect(() => {
    openTarget(hashId(), 'instant');

    const onClick = (event: MouseEvent) => {
      // Only plain left clicks; Ctrl/Cmd-click etc. keep their usual meaning (new tab, …)
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element | null)?.closest?.('a[href]');
      if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== '_self')) return;

      const url = new URL(link.href);
      const samePage = url.origin === location.origin && url.pathname === location.pathname;
      if (!samePage || !url.hash) return;

      const id = decodeURIComponent(url.hash.slice(1));
      if (!document.getElementById(id)) return;

      event.preventDefault();
      if (url.hash !== location.hash) history.pushState(null, '', url.hash);
      openTarget(id, smooth());
    };

    // Back/forward between #links on the same page
    const onHashChange = () => openTarget(hashId(), smooth());

    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [pathname]);

  return null;
}
