'use client';

import { Check, Copy } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import './CopyButton.css';

/**
 * A small icon button that copies the given text, and shows a check mark for a moment after.
 * Inside a code panel (components/CodeBlock) it moves left of the code's scrollbar.
 */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  // The scrollbar's width depends on the system (0 where it only shows while scrolling), so measure it.
  // Code that gets longer or shorter (e.g. a narrower window) can add or remove the scrollbar.
  useEffect(() => {
    const panel = ref.current?.closest<HTMLElement>('.code-block');
    const pre = panel?.querySelector('pre');
    if (!panel || !pre) {
      return;
    }
    // Also fires when the scrollbar appears, since it takes space from the code
    const observer = new ResizeObserver(() => {
      panel.style.setProperty('--scrollbar-width', `${pre.offsetWidth - pre.clientWidth}px`);
    });
    observer.observe(pre);
    return () => observer.disconnect();
  }, []);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      aria-label={copied ? 'Kopierat' : 'Kopiera'}
      className="copy-button"
      onClick={copy}
      ref={ref}
      title={copied ? 'Kopierat' : 'Kopiera'}
      type="button"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}
