import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import React from 'react';

import config from '@/payload.config';
import { ServicePage } from '../../components/ServicePage';

// Always render with the latest content from the CMS
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

const getService = async (slug: string) => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return docs[0];
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService((await params).slug);
  return { title: service ? `${service.name} | SaleSys Docs` : 'SaleSys Docs' };
}

export default async function Page({ params }: Props) {
  const service = await getService((await params).slug);
  if (!service) notFound();

  const payload = await getPayload({ config });
  const { developerNote } = await payload.findGlobal({ slug: 'services-page' });

  return <ServicePage developerNote={developerNote} service={service} />;
}
