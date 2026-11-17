import { ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { getPayload } from 'payload';
import React from 'react';

import config from '@/payload.config';
import { FormattedText } from '../components/FormattedText/FormattedText';
import { SectionHeading } from '../components/SectionHeading/SectionHeading';
import { normalize } from '@/lib/search';
import { slugify } from '@/lib/slugify';
import { FaqSearch } from './FaqSearch';
import './page.css';

type TextNode = { text?: string; children?: TextNode[] };

/** All text in a rich text answer, with a space between paragraphs and list items */
const plainText = (node: TextNode | undefined): string =>
  node?.text ?? (node?.children ?? []).map(plainText).join(' ');

/** What the search box matches against: the question and its answer, lowercase */
const searchText = (question: string, answer: unknown) =>
  normalize(`${question} ${plainText((answer as { root?: TextNode } | null)?.root)}`);

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
    // 1 so images and files in answers come with their URL
    payload.find({ collection: 'questions', sort: 'order', depth: 1, limit: 0 }),
  ]);

  // At depth 1 the category is the full document, not just its ID
  const categoryId = (category: (typeof questions.docs)[number]['category']) =>
    typeof category === 'object' ? category.id : category;

  const groups = categories.docs
    .map((category) => ({
      ...category,
      questions: questions.docs.filter((q) => categoryId(q.category) === category.id),
    }))
    .filter((group) => group.questions.length > 0);

  return (
    <div className="page">
      <div className="glow" />
      <div className="container">
        <header className="page-header">
          <h1>
            {page.title} {page.highlightedTitle && <b>{page.highlightedTitle}</b>}.
          </h1>
          <FormattedText className="lead" data={page.lead} />
        </header>

        <FaqSearch>
          {groups.map((group) => (
            <section key={group.id}>
              <SectionHeading id={slugify(group.title)}>{group.title}</SectionHeading>
              <div className="faq">
                {group.questions.map(({ answer, id, link, question }) => (
                  <details data-search={searchText(question, answer)} id={`q-${id}`} key={id}>
                    <summary>
                      <span>
                        {question}
                        {/* Clicking a link inside <summary> follows it instead of toggling the question */}
                        <a aria-label="Länk till frågan" className="anchor-link" href={`#q-${id}`}>
                          #
                        </a>
                      </span>
                      <Plus size={20} />
                    </summary>
                    <FormattedText className="faq-answer" data={answer} />
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
        </FaqSearch>
      </div>
    </div>
  );
}
