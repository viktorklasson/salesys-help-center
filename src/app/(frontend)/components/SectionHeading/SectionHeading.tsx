import React from 'react';

import './SectionHeading.css';

/** A heading you can link to: it gets an id, and a # link on hover for copying the address */
export function SectionHeading({
  as: Tag = 'h2',
  children,
  className,
  id,
}: {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  className?: string;
  id: string;
}) {
  return (
    <Tag className={['section-heading', className].filter(Boolean).join(' ')} id={id}>
      {children}
      <a aria-label="Länk till avsnittet" className="anchor-link" href={`#${id}`}>
        #
      </a>
    </Tag>
  );
}
