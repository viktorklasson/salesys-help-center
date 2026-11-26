import { Nunito, Nunito_Sans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { getPayload } from 'payload';
import React from 'react';
// Global styles first, so component and page styles can build on them
import './globals.css';
import './layout.css';
import { MobileMenu } from './components/MobileMenu/MobileMenu';
import { HashTarget } from './components/HashTarget/HashTarget';
import { NavLink } from './components/NavLink/NavLink';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { Metadata } from 'next';

import { THEME_SCRIPT } from '@/lib/theme';
import config from '@/payload.config';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['200', '300', '400', '600'],
});
const nunitoSans = Nunito_Sans({ subsets: ['latin'], variable: '--font-body' });

const getSiteSettings = async () => {
  const payload = await getPayload({ config });
  return payload.findGlobal({ slug: 'site-settings' });
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    description: settings.metaDescription ?? undefined,
    title: 'SaleSys Docs',
  };
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  const settings = await getSiteSettings();

  // Shown in the header on large screens and in the hamburger menu on small ones
  const navLinks = (
    <>
      <NavLink href="/api-reference">API-referens</NavLink>
      <NavLink href="/guides">Guider</NavLink>
      <NavLink href="/common-questions">Vanliga frågor</NavLink>
    </>
  );

  return (
    // The <head> script sets data-theme before React loads, so React must accept the attribute
    <html
      className={`${nunito.variable} ${nunitoSans.variable}`}
      lang="sv"
      suppressHydrationWarning
    >
      <head>
        {/* Light or dark before anything is shown (lib/theme) */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            {/* The symbol as an image, the name as text, so its colors can follow the theme */}
            <Link className="logo" href="/">
              <Image
                alt=""
                className="logo-symbol"
                height={32}
                width={32}
                priority
                src="/api/media/file/salesys-logo-img.png"
              />
              <span className="logo-name">
                Sale<span>Sys</span>
              </span>
              <span className="logo-suffix">Docs</span>
            </Link>
            <nav className="site-nav">{navLinks}</nav>
            <div className="site-header-actions">
              <ThemeToggle />
              <MobileMenu>{navLinks}</MobileMenu>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <HashTarget />
        <footer className="site-footer">
          <div className="site-footer-inner">
            {settings.footerText && <p>{settings.footerText}</p>}
          </div>
        </footer>
      </body>
    </html>
  );
}
