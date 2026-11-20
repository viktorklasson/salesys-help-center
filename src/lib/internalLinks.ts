import { slugify } from './slugify';

type LinkFields = {
  doc?: { relationTo?: string; value?: unknown } | null;
  anchor?: unknown;
};

/**
 * The address of something picked with the CMS link button: a FAQ question, FAQ category,
 * endpoint, API category or guide. The optional "Avsnitt på sidan" field adds #<section>.
 * Used by the site (components/FormattedText) and the Markdown copy of a guide (lib/richTextToText).
 */
export function internalLinkHref(fields: LinkFields): string {
  const { relationTo, value } = fields.doc ?? {};
  // Only populated when the page queries with depth ≥ 1
  if (!value || typeof value !== 'object') {
    return '#';
  }
  const doc = value as Record<string, unknown>;

  const anchor = String(fields.anchor ?? '')
    .replace(/^#/, '')
    .trim();
  function withAnchor(href: string) {
    return anchor ? `${href.split('#')[0]}#${anchor}` : href;
  }

  switch (relationTo) {
    case 'questions':
      return withAnchor(`/common-questions#q-${doc.id}`);
    case 'question-categories':
      return withAnchor(`/common-questions#${slugify(String(doc.title ?? ''))}`);
    case 'endpoints':
      // Stored on the endpoint when it's saved, e.g. /api-reference/dial#get-api-dial-calls-v1
      return withAnchor(String(doc.url ?? '/api-reference'));
    case 'api-categories':
      return withAnchor(`/api-reference/${doc.slug}`);
    case 'articles':
      return withAnchor(`/guides/${doc.slug}`);
    default:
      return '#';
  }
}
