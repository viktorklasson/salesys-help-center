import { getPayload } from 'payload';
import React from 'react';

import config from '@/payload.config';
import { FormattedText } from '../components/FormattedText/FormattedText';
import { SectionHeading } from '../components/SectionHeading/SectionHeading';
import { ServiceCard } from '../components/ServiceCard/ServiceCard';

// Always render with the latest content from the CMS
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Funktioner | SaleSys Docs',
};

export default async function ReferencePage() {
  const payload = await getPayload({ config });
  const [page, services] = await Promise.all([
    payload.findGlobal({ slug: 'services-page' }),
    payload.find({ collection: 'services', sort: 'order', limit: 0 }),
  ]);

  // Functions marked "Avancerad funktion" in the CMS get their own list below the main one
  const basicDocs = services.docs.filter((service) => !service.isAdvanced);
  const advancedDocs = services.docs.filter((service) => service.isAdvanced);

  return (
    <div className="page">
      <div className="glow" />
      <div className="container">
        <header className="page-header">
          <h1>
            Alla <b>funktioner</b>.
          </h1>
          <FormattedText className="lead" data={page.lead} />
        </header>
        <div className="grid">
          {basicDocs.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {advancedDocs.length > 0 && (
          <section>
            <SectionHeading id="avancerade-funktioner">
              Avancerade <b>funktioner</b>.
            </SectionHeading>
            <div className="grid">
              {advancedDocs.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
