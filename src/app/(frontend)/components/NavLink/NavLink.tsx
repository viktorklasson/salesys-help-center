'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import './NavLink.css';

export function NavLink({ children, href }: { children: React.ReactNode; href: string }) {
  const pathname = usePathname();
  // "/reference" is also active on "/reference/dial" etc.
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link aria-current={isActive ? 'page' : undefined} className="nav-link" href={href}>
      {children}
    </Link>
  );
}
