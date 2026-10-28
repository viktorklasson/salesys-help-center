import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { getIcon } from '@/icons';
import type { Service } from '@/payload-types';
import './ServiceCard.css';

export function ServiceCard({ service }: { service: Service }) {
  const Icon = getIcon(service.icon);

  return (
    <Link className="card card--link" href={`/service/${service.slug}`}>
      <Icon className="card-icon" size={24} strokeWidth={1.7} />
      <h3>{service.name}</h3>
      <p>{service.tagline}</p>
      <span className="card-more">
        Läs mer <ArrowRight size={14} />
      </span>
    </Link>
  );
}
