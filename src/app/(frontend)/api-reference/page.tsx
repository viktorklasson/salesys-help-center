import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getPayload } from 'payload';
import React from 'react';

import { getIcon } from '@/icons';
import config from '@/payload.config';

// Always render with the latest content from the CMS
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'API-referens | SaleSys Docs',
};

// Renders `backticks` in CMS text as inline code
const withInlineCode = (text: string) =>
  text.split(/`([^`]+)`/).map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));

export default async function ApiReferencePage() {
  const payload = await getPayload({ config });
  const [page, services] = await Promise.all([
    payload.findGlobal({ slug: 'api-reference-page' }),
    payload.find({ collection: 'services', sort: 'order', limit: 0 }),
  ]);

  return (
    <div className="page">
      <div className="glow" />
      <div className="container">
        <section className="api-hero">
          <div>
            <h1>
              API-<b>referens</b>.
            </h1>
            {page.lead && <p className="lead">{page.lead}</p>}
          </div>
        </section>

        <section>
          {!!page.prerequisites?.length && (
            <div className="prerequisites">
              <h2>Börja här</h2>
              <ol className="prerequisites-list">
                {page.prerequisites.map((step) => {
                  const List = step.listStyle === 'bulleted' ? 'ul' : 'ol';
                  return (
                    <li key={step.id}>
                      {/* Same name = only one step open at a time */}
                      <details name="prerequisites">
                        <summary>{step.title}</summary>
                        <p>{withInlineCode(step.introduction)}</p>
                        {!!step.list?.length && (
                          <List className="prerequisite-steps">
                            {step.list.map(({ id, item }) => (
                              <li key={id}>{withInlineCode(item)}</li>
                            ))}
                          </List>
                        )}
                      </details>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
          <ul className="endpoint-list">
            {services.docs.map((service) => {
              const Icon = getIcon(service.icon);
              return (
                <li key={service.id}>
                  <Link href={`/api-reference/${service.slug}`}>
                    <Icon className="endpoint-icon" size={20} strokeWidth={1.7} />
                    <span className="endpoint-name">
                      <strong>{service.name}</strong>
                      <span>{service.tagline}</span>
                    </span>
                    <code className="endpoint-path">/{service.slug}</code>
                    <ChevronRight className="endpoint-arrow" size={18} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
