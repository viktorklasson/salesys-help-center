import { ArrowLeft, Code2, MapPin } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { getIcon } from '@/icons';
import type { Service, ServicesPage } from '@/payload-types';
import { FormattedText } from '../FormattedText/FormattedText';
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
          <Icon className="page-icon" size={32} strokeWidth={1.5} />
          <h1>{service.name}</h1>
          <FormattedText className="lead" data={service.intro} />
        </header>

        {!!service.features?.length && (
          <section>
            <h2>
              Det här <b>kan du göra</b>.
            </h2>
            <div className="grid grid--fit">
              {service.features.map((feature) => (
                <div className="card" key={feature.id}>
                  <h3>{feature.title}</h3>
                  <FormattedText data={feature.description} />
                </div>
              ))}
            </div>
          </section>
        )}

        {developerNote && (
          <section className="developer">
            <Code2 size={20} />
            <div>
              <h3>För utvecklare</h3>
              <FormattedText data={developerNote} />
              <p>
                <code>
                  {API_BASE_URL}/{service.slug}
                </code>
              </p>
                <p>Komplett information finns i tjänstens</p> 
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
