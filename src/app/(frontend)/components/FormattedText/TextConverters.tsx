import type {
  DefaultNodeTypes,
  SerializedHeadingNode,
  SerializedLinkNode,
  SerializedUploadNode,
} from '@payloadcms/richtext-lexical';
import {
  defaultJSXConverters,
  type JSXConverterArgs,
  type JSXConverters,
  LinkJSXConverter,
} from '@payloadcms/richtext-lexical/react';
import { Paperclip } from 'lucide-react';
import React from 'react';

import type { Media } from '@/payload-types';
import { createHeadingIds, textOf } from '@/lib/headings';
import { internalLinkHref } from '@/lib/internalLinks';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import { SectionHeading } from '../SectionHeading/SectionHeading';

/**
 * How each part of a CMS text is shown. Create one per text block, so the heading ids start over:
 * two headings with the same text in one block get unique ids (…-2, …-3).
 */
export class TextConverters {
  // Shared with the table of contents (lib/headings), so its links match these ids
  private readonly idFor = createHeadingIds();

  /** Headings get an id from their text (and a # link), so every section can be linked to */
  heading({ node, nodesToJSX }: JSXConverterArgs<SerializedHeadingNode>) {
    return (
      <SectionHeading as={node.tag === 'h1' ? 'h2' : node.tag} id={this.idFor(textOf(node))}>
        {nodesToJSX({ nodes: node.children })}
      </SectionHeading>
    );
  }

  /** Code blocks from the CMS (fields/codeBlockFeature), in the same dark panel as the API examples */
  codeBlock({ node }: { node: { fields: { code?: string; language?: string } } }) {
    return <CodeBlock>{node.fields.code ?? ''}</CodeBlock>;
  }

  /**
   * Images use Payload's default rendering. Videos and audio get native players,
   * and any other file (PDF, zip, …) becomes a download link.
   */
  upload(args: JSXConverterArgs<SerializedUploadNode>) {
    // Only populated when the page queries with depth ≥ 1
    const file = args.node.value;
    if (!file || typeof file !== 'object') {
      return null;
    }

    const { alt, filename, mimeType, url } = file as Media;
    if (!url) {
      return null;
    }

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

    const defaultUpload = defaultJSXConverters.upload;
    return typeof defaultUpload === 'function' ? defaultUpload(args) : null;
  }

  /** Payload's converters, with the ones above in place of the defaults */
  toJSXConverters(
    defaultConverters: JSXConverters<DefaultNodeTypes>,
  ): JSXConverters<DefaultNodeTypes> {
    return {
      ...defaultConverters,
      // Addresses of pages picked with the CMS link button
      ...LinkJSXConverter({
        internalDocToHref: ({ linkNode }: { linkNode: SerializedLinkNode }) =>
          internalLinkHref(linkNode.fields),
      }),
      // Bound, since RichText calls them on their own
      heading: this.heading.bind(this),
      blocks: { Code: this.codeBlock.bind(this) },
      upload: this.upload.bind(this),
    };
  }
}
