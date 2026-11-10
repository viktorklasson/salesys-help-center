import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getPayload } from 'payload';
import React from 'react';

import { getIcon } from '@/icons';
import config from '@/payload.config';
import { FormattedText } from '../components/FormattedText/FormattedText';
import { SectionHeading } from '../components/SectionHeading/SectionHeading';
import { slugify } from '@/lib/slugify';
import './page.css';

// Always render with the latest content from the CMS
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'API-referens | SaleSys Docs',
};

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
            <FormattedText className="lead" data={page.lead} />
          </div>
        </section>

        <section>
          {!!page.prerequisites?.length && (
            <div className="prerequisites">
              <SectionHeading id="borja-har">Börja här</SectionHeading>
              <ol className="prerequisites-list">
                {page.prerequisites.map((step) => {
                  const List = step.listStyle === 'bulleted' ? 'ul' : 'ol';
                  const stepId = slugify(step.title);
                  return (
                    <li id={stepId} key={step.id}>
                      {/* Same name = only one step open at a time */}
                      <details name="prerequisites">
                        <summary>
                          <span>
                            {step.title}
                            <a
                              aria-label="Länk till steget"
                              className="anchor-link"
                              href={`#${stepId}`}
                            >
                              #
                            </a>
                          </span>
                        </summary>
                        <FormattedText data={step.introduction} />
                        {!!step.list?.length && (
                          <List className="prerequisite-steps">
                            {step.list.map(({ id, item }) => (
                              <li key={id}>
                                <FormattedText data={item} />
                              </li>
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
          <div>
            <SectionHeading id="tjanster">Tjänster</SectionHeading>
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
          </div>
        </section>
      </div>
    </div>
  );
}
