import { RichText } from '@payloadcms/richtext-lexical/react';
import React from 'react';

import { TextConverters } from './TextConverters';
import './FormattedText.css';

type Props = {
  /** A rich text field from the CMS */
  data: React.ComponentProps<typeof RichText>['data'] | null | undefined;
  className?: string;
};

/** Renders CMS text with headings, bold, italic, underline, inline code, links and media */
export function FormattedText({ className, data }: Props) {
  if (!data?.root?.children?.length) {
    return null;
  }

  return (
    <RichText
      className={['formatted-text', className].filter(Boolean).join(' ')}
      // RichText calls this every time it renders, so each text block gets its own heading ids
      converters={({ defaultConverters }) =>
        new TextConverters().toJSXConverters(defaultConverters)
      }
      data={data}
    />
  );
}
