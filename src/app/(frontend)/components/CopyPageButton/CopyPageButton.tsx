'use client';

import { ArrowUpRight, Check, ChevronDown, Copy, FileText, Sparkles } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import './CopyPageButton.css';

/**
 * "Kopiera sida" copies the page as plain text; the arrow next to it opens a menu for copying it
 * as Markdown instead, or asking Claude or ChatGPT about the page. Shows "Kopierat" for a moment after copying.
 */
export function CopyPageButton({ markdown, text }: { markdown: string; text: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Close the menu on a click outside it or Escape
  useEffect(() => {
    if (!open) {
      return;
    }
    function closeOutside(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  /** A new chat with the AI service, with a question about this page already typed in (not sent) */
  function askUrl(chatUrl: string) {
    const question = `Läs ${window.location.href} så att jag kan ställa frågor om innehållet.`;
    return `${chatUrl}?q=${encodeURIComponent(question)}`;
  }

  async function copy(content: string) {
    setOpen(false);
    await navigator.clipboard.writeText(content);
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="copy-page" ref={ref}>
      <button className="copy-page-main" onClick={() => copy(text)} type="button">
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Kopierat' : 'Kopiera sida'}
      </button>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Fler sätt att kopiera"
        className="copy-page-toggle"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <ChevronDown size={16} />
      </button>
      {/* Only rendered after a click, so window is available here */}
      {open && (
        <div className="copy-page-menu" role="menu">
          <button
            onClick={() =>
              // Relative links (/guides/…) only work on this site, so make them full addresses
              copy(markdown.replace(/\]\(\//g, `](${window.location.origin}/`))
            }
            role="menuitem"
            type="button"
          >
            <FileText size={16} />
            <span>Kopiera som Markdown</span>
          </button>
          <a
            href={askUrl('https://claude.ai/new')}
            onClick={() => setOpen(false)}
            rel="noopener"
            role="menuitem"
            target="_blank"
          >
            <Sparkles size={16} />
            <span>Fråga Claude</span>
            <ArrowUpRight className="copy-page-external" size={14} />
          </a>
          <a
            href={askUrl('https://chatgpt.com/')}
            onClick={() => setOpen(false)}
            rel="noopener"
            role="menuitem"
            target="_blank"
          >
            <Sparkles size={16} />
            <span>Fråga ChatGPT</span>
            <ArrowUpRight className="copy-page-external" size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
