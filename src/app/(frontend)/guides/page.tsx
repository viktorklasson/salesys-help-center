import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getPayload } from 'payload';
import React from 'react';

import { getIcon } from '@/icons';
import config from '@/payload.config';
// Same list style as the services on the API reference page
import '../api-reference/page.css';

// Always render with the latest content from the CMS (and not at build time, which has no PAYLOAD_SECRET)
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Guider | SaleSys Docs',
};

export default async function GuidesPage() {
  const payload = await getPayload({ config });
  const guides = await payload.find({
    collection: 'articles',
    sort: 'order',
    limit: 0,
    depth: 0,
    // Only what the list shows, not the guide text
    select: { title: true, slug: true, description: true, icon: true },
  });

  return (
    <div className="page">
      <div className="glow" />
      <div className="container">
        <header className="page-header">
          <h1>
            Alla <b>guider</b>.
          </h1>
          <p className="lead">Guider och fördjupningar om SaleSys.</p>
        </header>

        {guides.docs.length === 0 ? (
          <p>Det finns inga guider ännu.</p>
        ) : (
          <ul className="endpoint-list">
            {guides.docs.map((guide) => {
              const Icon = getIcon(guide.icon);
              return (
                <li key={guide.id}>
                  <Link href={`/guides/${guide.slug}`}>
                    <Icon className="endpoint-icon" size={20} strokeWidth={1.7} />
                    <span className="endpoint-name">
                      <strong>{guide.title}</strong>
                      <span>{guide.description}</span>
                    </span>
                    <ChevronRight className="endpoint-arrow" size={18} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
