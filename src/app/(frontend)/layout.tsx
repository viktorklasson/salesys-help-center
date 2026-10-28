import { Nunito, Nunito_Sans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { getPayload } from 'payload';
import React from 'react';
// Global styles first, so component and page styles can build on them
import './globals.css';
import './layout.css';
import { MobileMenu } from './components/MobileMenu/MobileMenu';
import { NavLink } from './components/NavLink/NavLink';
import { Metadata } from 'next';

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
      <NavLink href="/service">Funktioner</NavLink>
      <NavLink href="/common-questions">Vanliga frågor</NavLink>
      <NavLink href="/api-reference">API-referens</NavLink>
    </>
  );

  return (
    <html className={`${nunito.variable} ${nunitoSans.variable}`} lang="sv">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link className="logo" href="/">
              <Image alt="SaleSys" height={28} width={120} priority src="/api/media/file/salesys-logo.webp" />
              <span className="logo-suffix">Docs</span>
            </Link>
            <nav className="site-nav">{navLinks}</nav>
            <MobileMenu>{navLinks}</MobileMenu>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="site-footer-inner">
            {settings.footerText && <p>{settings.footerText}</p>}
          </div>
        </footer>
      </body>
    </html>
  );
}
