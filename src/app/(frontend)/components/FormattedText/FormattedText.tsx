import type {
  DefaultNodeTypes,
  SerializedHeadingNode,
  SerializedLinkNode,
  SerializedUploadNode,
} from '@payloadcms/richtext-lexical';
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText,
} from '@payloadcms/richtext-lexical/react';
import { Paperclip } from 'lucide-react';
import React from 'react';

import type { Media } from '@/payload-types';
import { createHeadingIds, textOf } from '@/lib/headings';
import { slugify } from '@/lib/slugify';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import { SectionHeading } from '../SectionHeading/SectionHeading';
import './FormattedText.css';

/**
 * The address of something picked with the CMS link button: a function, FAQ question,
 * FAQ category, endpoint or guide. The optional "Avsnitt på sidan" field adds #<section>.
 */
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { relationTo, value } = linkNode.fields.doc ?? {};
  // Only populated when the page queries with depth ≥ 1
  if (!value || typeof value !== 'object') return '#';

  const anchor = String(linkNode.fields.anchor ?? '')
    .replace(/^#/, '')
    .trim();
  const withAnchor = (href: string) => (anchor ? `${href.split('#')[0]}#${anchor}` : href);

  switch (relationTo) {
    case 'services':
      return withAnchor(`/service/${value.slug}`);
    case 'questions':
      return withAnchor(`/common-questions#q-${value.id}`);
    case 'question-categories':
      return withAnchor(`/common-questions#${slugify(String(value.title ?? ''))}`);
    case 'endpoints':
      // Stored on the endpoint when it's saved, e.g. /api-reference/dial#get-api-dial-calls-v1
      return withAnchor(String(value.url ?? '/api-reference'));
    case 'articles':
      return withAnchor(`/guides/${value.slug}`);
    default:
      return '#';
  }
};

type Props = {
  /** A rich text field from the CMS */
  data: React.ComponentProps<typeof RichText>['data'] | null | undefined;
  className?: string;
};

/**
 * Headings get an id from their text (and a # link), so every section can be linked to.
 * Images use Payload's default rendering. Videos and audio get native players,
 * and any other file (PDF, zip, …) becomes a download link.
 *
 * Built per text block, so two headings with the same text get unique ids (…-2, …-3).
 */
const createConverters =
  (): JSXConvertersFunction<DefaultNodeTypes> =>
  ({ defaultConverters }) => {
    // Shared with the table of contents (lib/headings), so its links match these ids
    const idFor = createHeadingIds();

    return {
      ...defaultConverters,
      ...LinkJSXConverter({ internalDocToHref }),
      heading: ({ node, nodesToJSX }) => {
        const heading = node as SerializedHeadingNode;

        return (
          <SectionHeading
            as={heading.tag === 'h1' ? 'h2' : heading.tag}
            id={idFor(textOf(heading))}
          >
            {nodesToJSX({ nodes: heading.children })}
          </SectionHeading>
        );
      },
      // Code blocks from the CMS (fields/codeBlockFeature), in the same dark panel as the API examples
      blocks: {
        Code: ({ node }: { node: { fields: { code?: string; language?: string } } }) => (
          <CodeBlock>{node.fields.code ?? ''}</CodeBlock>
        ),
      },
      upload: (args) => {
        // Only populated when the page queries with depth ≥ 1
        const file = (args.node as SerializedUploadNode).value;
        if (!file || typeof file !== 'object') return null;

        const { alt, filename, mimeType, url } = file as Media;
        if (!url) return null;

        if (mimeType?.startsWith('video/')) {
          return (
            <video className="formatted-media" controls preload="metadata" src={url} title={alt} />
          );
        }
        if (mimeType?.startsWith('audio/')) {
          return (
            <audio className="formatted-media" controls preload="metadata" src={url} title={alt} />
          );
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
    };
  };

/** Renders CMS text with headings, bold, italic, underline, inline code, links and media */
export function FormattedText({ className, data }: Props) {
  if (!data?.root?.children?.length) return null;

  return (
    <RichText
      className={['formatted-text', className].filter(Boolean).join(' ')}
      converters={createConverters()}
      data={data}
    />
  );
}
