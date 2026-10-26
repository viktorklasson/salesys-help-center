import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getPayload } from 'payload';
import React from 'react';

import { getIcon } from '@/icons';
import type { Service } from '@/payload-types';
import config from '@/payload.config';

// Always render with the latest content from the CMS
export const dynamic = 'force-dynamic';

// Relationships come back as full documents at depth 1, or as IDs if the service was deleted
const serviceHref = (service: Service | string | null | undefined) =>
  typeof service === 'object' && service ? `/reference/${service.slug}` : null;

export default async function HomePage() {
  const payload = await getPayload({ config });
  const [page, services, categories, questions] = await Promise.all([
    payload.findGlobal({ slug: 'home-page', depth: 1 }),
    payload.find({ collection: 'services', sort: 'order', limit: 0 }),
    payload.find({ collection: 'question-categories', sort: 'order', limit: 0, depth: 0 }),
    payload.find({ collection: 'questions', sort: 'order', limit: 0, depth: 0 }),
  ]);
  const popularQuestions = categories.docs
    .flatMap((category) => questions.docs.filter((q) => q.category === category.id))
    .slice(0, 4);
  const getStartedHref = serviceHref(page.getStartedService);

  return (
    <div className="home">
      <div className="glow" />

      <section className="container home-hero">
        <div>
          <h1>Docs</h1>
          {page.lead && <p className="lead">{page.lead}</p>}
          <div className="home-actions">
            {getStartedHref && (
              <Link className="btn-primary" href={getStartedHref}>
                Kom igång
              </Link>
            )}
            <Link className="text-link" href="#funktioner">
              Utforska alla funktioner <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {popularQuestions.length > 0 && (
          <aside className="home-card">
            <h3>Vanliga frågor</h3>
            <ul>
              {popularQuestions.map((q) => (
                <li key={q.id}>
                  <Link href={`/common-questions#q-${q.id}`}>{q.question}</Link>
                </li>
              ))}
            </ul>
            <Link className="card-more" href="/common-questions">
              Se alla frågor <ArrowRight size={14} />
            </Link>
          </aside>
        )}
      </section>

      {!!page.taskColumns?.length && (
        <section className="container home-tasks">
          {page.taskColumns.map((column) => (
            <div key={column.id}>
              <h2>{column.title}</h2>
              <ul className="link-list">
                {column.links?.map((link) => {
                  const href = serviceHref(link.service);
                  return (
                    href && (
                      <li key={link.id}>
                        <Link href={href}>
                          {link.label} <ArrowRight size={14} />
                        </Link>
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      )}

      <section className="container" id="funktioner">
        <h2 className="home-section-title">Bläddra bland funktioner</h2>
        <div className="product-grid">
          {services.docs.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <Link className="product" href={`/reference/${service.slug}`} key={service.id}>
                <span className="product-icon">
                  <Icon size={20} strokeWidth={1.7} />
                </span>
                <span>
                  <strong>{service.name}</strong>
                  <span>{service.tagline}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {!!page.helpLinks?.length && (
        <section className="container home-help">
          {page.helpLinks.map((item) => {
            const Icon = getIcon(item.icon);
            const isExternal = /^https?:\/\//.test(item.url);
            return (
              <Link
                href={item.url}
                key={item.id}
                {...(isExternal && { rel: 'noopener noreferrer', target: '_blank' })}
              >
                <Icon size={20} />
                <span>
                  <strong>{item.title}</strong>
                  {item.description && <span>{item.description}</span>}
                </span>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}
