import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import './not-found.css';

export const metadata: Metadata = {
  title: 'Sidan hittades inte | SaleSys Docs',
};

/** Shown for unknown URLs (via [...notFound]) and when a page calls notFound(), e.g. an unknown function */
export default function NotFound() {
  return (
    <div className="page not-found">
      <div className="glow" />
      <div className="container container--narrow">
        <header className="page-header">
          <h1>
            <b>Ojdå!</b>
          </h1>
          <h2 className="subheading">Den sidan finns inte.</h2>
          <p className="lead">
            Sidan du letar efter har flyttats eller tagits bort, eller så är adressen felstavad.
          </p>
          <div className="not-found-actions">
            <Link className="btn-primary" href="/">
              Till startsidan
            </Link>
          </div>
        </header>
      </div>
    </div>
  );
}
