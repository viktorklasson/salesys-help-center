import { RichText } from '@payloadcms/richtext-lexical/react';
import { ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { getPayload } from 'payload';
import React from 'react';

import config from '@/payload.config';
import { FormattedText } from '../components/FormattedText/FormattedText';
import './page.css';

// Always render with the latest content from the CMS
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Vanliga frågor | SaleSys Docs',
};

export default async function CommonQuestionsPage() {
  const payload = await getPayload({ config });

  const [page, categories, questions] = await Promise.all([
    payload.findGlobal({ slug: 'common-questions-page' }),
    payload.find({ collection: 'question-categories', sort: 'order', limit: 0 }),
    payload.find({ collection: 'questions', sort: 'order', depth: 0, limit: 0 }),
  ]);

  const groups = categories.docs
    .map((category) => ({
      ...category,
      questions: questions.docs.filter((q) => q.category === category.id),
    }))
    .filter((group) => group.questions.length > 0);

  return (
    <div className="page">
      <div className="glow" />
      <div className="container container--narrow">
        <header className="page-header">
          <h1>
            {page.title} {page.highlightedTitle && <b>{page.highlightedTitle}</b>}.
          </h1>
          <FormattedText className="lead" data={page.lead} />
        </header>

        {groups.map((group) => (
          <section key={group.id}>
            <h2>{group.title}</h2>
            <div className="faq">
              {group.questions.map(({ answer, id, link, question }) => (
                <details id={`q-${id}`} key={id}>
                  <summary>
                    {question}
                    <Plus size={20} />
                  </summary>
                  <RichText className="faq-answer" data={answer} />
                  {link?.href && (
                    <Link className="card-more" href={link.href}>
                      {link.label || 'Läs mer'} <ArrowRight size={14} />
                    </Link>
                  )}
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
