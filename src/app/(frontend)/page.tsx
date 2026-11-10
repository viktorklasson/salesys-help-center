import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getPayload } from 'payload';
import React from 'react';
import Image from 'next/image';

import config from '@/payload.config';
import { FormattedText } from './components/FormattedText/FormattedText';
import './page.css';

// Always render with the latest content from the CMS
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const payload = await getPayload({ config });
  const [page, categories, questions] = await Promise.all([
    payload.findGlobal({ slug: 'home-page', depth: 1 }),
    payload.find({ collection: 'question-categories', sort: 'order', limit: 0, depth: 0 }),
    payload.find({ collection: 'questions', sort: 'order', limit: 0, depth: 0 }),
  ]);
  const popularQuestions = categories.docs
    .flatMap((category) => questions.docs.filter((q) => q.category === category.id))
    .slice(0, 4);

  return (
    <div className="home">
      <div className="glow" />

      <section className="container home-hero">
        <div>
          <div style={{ display: 'flex' }}>
            <Image alt="SaleSys logo" width={64} height={64} src="/api/media/file/salesys-logo-img.png" />
            <h1>Docs</h1>
          </div>
          <FormattedText className="lead" data={page.lead} />
          <div className="home-actions">
            <Link className="text-link" href="/service">
              Utforska alla funktioner <ArrowRight size={16} />
            </Link>
            <Link className="text-link" href="/api-reference">
              Se API-referens <ArrowRight size={16} />
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
    </div>
  );
}
