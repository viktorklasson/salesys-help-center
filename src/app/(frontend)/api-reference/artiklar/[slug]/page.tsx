import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import React from 'react';

import config from '@/payload.config';
import { FormattedText } from '../../../components/FormattedText/FormattedText';

// Always render with the latest content from the CMS
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

const getArticle = async (slug: string) => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    limit: 1,
    // 1 so images, files and linked pages in the text come with their URL
    depth: 1,
  });
  return docs[0];
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  return article
    ? { title: `${article.title} | SaleSys Docs`, description: article.description }
    : { title: 'SaleSys Docs' };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle((await params).slug);
  if (!article) notFound();

  return (
    <article className="page">
      <div className="glow" />
      <div className="container">
        <Link className="back" href="/api-reference#artiklar">
          <ArrowLeft size={16} /> API-referens
        </Link>

        <header className="page-header">
          <h1>{article.title}</h1>
          <p className="lead">{article.description}</p>
        </header>

        <FormattedText className="long-text" data={article.content} />
      </div>
    </article>
  );
}
