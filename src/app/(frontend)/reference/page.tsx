import { getPayload } from 'payload';
import React from 'react';

import config from '@/payload.config';
import { ServiceCard } from '../components/ServiceCard';

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

  return (
    <div className="page">
      <div className="glow" />
      <div className="container">
        <header className="page-header">
          <h1>
            Alla <b>funktioner</b>.
          </h1>
          {page.lead && <p className="lead">{page.lead}</p>}
        </header>
        <div className="grid">
          {services.docs.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}
