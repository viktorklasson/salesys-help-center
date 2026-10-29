import type { DefaultNodeTypes, SerializedUploadNode } from '@payloadcms/richtext-lexical';
import { type JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react';
import { Paperclip } from 'lucide-react';
import React from 'react';

import type { Media } from '@/payload-types';
import './FormattedText.css';

type Props = {
  /** A rich text field from the CMS */
  data: React.ComponentProps<typeof RichText>['data'] | null | undefined;
  className?: string;
};

/**
 * Images use Payload's default rendering. Videos and audio get native players,
 * and any other file (PDF, zip, …) becomes a download link.
 */
const converters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: (args) => {
    // Only populated when the page queries with depth ≥ 1
    const file = (args.node as SerializedUploadNode).value;
    if (!file || typeof file !== 'object') return null;

    const { alt, filename, mimeType, url } = file as Media;
    if (!url) return null;

    if (mimeType?.startsWith('video/')) {
      return <video className="formatted-media" controls preload="metadata" src={url} title={alt} />;
    }
    if (mimeType?.startsWith('audio/')) {
      return <audio className="formatted-media" controls preload="metadata" src={url} title={alt} />;
    }
    if (!mimeType?.startsWith('image/')) {
      return (
        <a className="formatted-file" download href={url}>
          <Paperclip size={16} />
          {alt || filename}
        </a>
      );
    }

    const defaultUpload = defaultConverters.upload;
    return typeof defaultUpload === 'function' ? defaultUpload(args) : null;
  },
});

/** Renders CMS text with bold, italic, underline, inline code and media */
export function FormattedText({ className, data }: Props) {
  if (!data?.root?.children?.length) return null;

  return (
    <RichText
      className={['formatted-text', className].filter(Boolean).join(' ')}
      converters={converters}
      data={data}
    />
  );
}
