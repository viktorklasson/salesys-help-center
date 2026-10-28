import { RichText } from '@payloadcms/richtext-lexical/react';
import React from 'react';

import './FormattedText.css';

type Props = {
  /** A rich text field from the CMS */
  data: React.ComponentProps<typeof RichText>['data'] | null | undefined;
  className?: string;
};

/** Renders CMS text with bold, italic, underline and inline code */
export function FormattedText({ className, data }: Props) {
  if (!data?.root?.children?.length) return null;

  return <RichText className={['formatted-text', className].filter(Boolean).join(' ')} data={data} />;
}
