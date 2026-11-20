import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import React from 'react';

import { getHeadings } from '@/lib/headings';
import { richTextToMarkdown, richTextToPlainText } from '@/lib/richTextToText';
import config from '@/payload.config';
import { CopyPageButton } from '../../components/CopyPageButton/CopyPageButton';
import { FormattedText } from '../../components/FormattedText/FormattedText';
import { TableOfContents } from '../../components/TableOfContents/TableOfContents';
import './page.css';

// Always render with the latest content from the CMS
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

const getGuide = async (slug: string) => {
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
  const guide = await getGuide((await params).slug);
  return guide
    ? { title: `${guide.title} | SaleSys Docs`, description: guide.description }
    : { title: 'SaleSys Docs' };
}

export default async function GuidePage({ params }: Props) {
  const guide = await getGuide((await params).slug);
  if (!guide) notFound();

  // On unless turned off in the CMS (guides from before the option have no value), and only worth it with 2+ headings
  const headings = guide.tableOfContents !== false ? getHeadings(guide.content) : [];
  const showToc = headings.length >= 2;

  return (
    <article className="page">
      <div className="glow" />
      <div className="container">
        <Link className="back" href="/guides">
          <ArrowLeft size={16} /> Alla guider
        </Link>

        <header className="page-header guide-header">
          <div>
            <h1>{guide.title}</h1>
            <p className="lead">{guide.description}</p>
          </div>
          <CopyPageButton
            markdown={`# ${guide.title}\n\n${guide.description}\n\n${richTextToMarkdown(guide.content)}\n`}
            text={`${guide.title}\n\n${guide.description}\n\n${richTextToPlainText(guide.content)}\n`}
          />
        </header>

        <div className={showToc ? 'guide-body has-toc' : 'guide-body'}>
          <FormattedText className="long-text" data={guide.content} />
          {showToc && (
            <aside className="guide-toc">
              <TableOfContents headings={headings} />
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
