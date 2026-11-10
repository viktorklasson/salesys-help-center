import { ArrowLeft, Code2, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import React from 'react';

import { getIcon } from '@/icons';
import type { Service, ServicesPage } from '@/payload-types';
import { FormattedText } from '../FormattedText/FormattedText';
import { SectionHeading } from '../SectionHeading/SectionHeading';
import './ServicePage.css';

const API_BASE_URL = 'https://app.salesys.se/api';

export function ServicePage({
  developerNote,
  service,
}: {
  developerNote?: ServicesPage['developerNote'];
  service: Service;
}) {
  const Icon = getIcon(service.icon);

  return (
    <article className="page">
      <div className="glow" />
      <div className="container">
        <Link className="back" href="/service">
          <ArrowLeft size={16} /> Alla funktioner
        </Link>

        <header className="page-header">
          <div className="header-icon-container">
            <Icon className="page-icon" size={64} strokeWidth={1.5} />
            <h1>{service.name}</h1>
          </div>
          <FormattedText className="lead" data={service.intro} />
        </header>

        <FormattedText className="long-text" data={service.content} />

        {developerNote && (
          <section className="developer">
            <Code2 size={20} />
            <div>
              <SectionHeading as="h3" id="for-utvecklare">
                För utvecklare
              </SectionHeading>
              <FormattedText data={developerNote} />
              <p>
                <code>
                  {API_BASE_URL}/{service.slug}
                </code>
              </p>
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
