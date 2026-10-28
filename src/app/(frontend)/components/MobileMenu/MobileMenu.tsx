'use client';

import { Menu, X } from 'lucide-react';
import React, { useRef } from 'react';

import './MobileMenu.css';

/**
 * Hamburger menu for small screens, built on the native Popover API:
 * the browser handles opening, closing on outside click and Escape.
 */
export function MobileMenu({ children }: { children: React.ReactNode }) {
  const menuRef = useRef<HTMLDivElement>(null);

  // The header stays mounted between pages, so close the menu when a link is clicked
  const closeOnLinkClick = (event: React.MouseEvent) => {
    if ((event.target as Element).closest('a')) menuRef.current?.hidePopover();
  };

  return (
    <>
      <button aria-label="Meny" className="menu-button" popoverTarget="mobile-menu" type="button">
        <Menu className="menu-icon-open" size={24} />
        <X className="menu-icon-close" size={24} />
      </button>
      <div className="mobile-menu" id="mobile-menu" popover="auto" ref={menuRef}>
        <nav onClick={closeOnLinkClick}>{children}</nav>
      </div>
    </>
  );
}
