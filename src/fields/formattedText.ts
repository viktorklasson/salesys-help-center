import {
  BoldFeature,
  FixedToolbarFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
  UnderlineFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical';
import type { RichTextField } from 'payload';

type Options = Omit<RichTextField, 'type' | 'editor'> & {
  /** Also allow `inline code`, e.g. for API texts */
  code?: boolean;
};

/**
 * Body text with light formatting: bold, italic, underline, and images or other files from Media.
 * Use this for paragraphs on the site, not for titles, labels or links.
 */
export const formattedText = ({ code = false, ...field }: Options): RichTextField => ({
  ...field,
  type: 'richText',
  editor: lexicalEditor({
    features: [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      ...(code ? [InlineCodeFeature()] : []),
      // Images, videos, audio and other files from the Media collection
      UploadFeature(),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ],
  }),
});
