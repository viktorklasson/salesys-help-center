import { slugify } from './slugify';

type Node = { type?: string; tag?: string; text?: string; children?: Node[] };

/** All text inside a node, e.g. a heading with bold parts */
export const textOf = (node: Node): string =>
  node.text ?? (node.children ?? []).map(textOf).join('');

/**
 * Gives each heading in a text an id from its text, e.g. "Ditt första orderarbete" -> "ditt-forsta-orderarbete".
 * A second heading with the same text gets "-2", a third "-3". Create one per text block, and call it
 * for every heading in order, so the text (FormattedText) and its table of contents get the same ids.
 */
export const createHeadingIds = () => {
  const used = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text) || 'avsnitt';
    const count = (used.get(base) ?? 0) + 1;
    used.set(base, count);
    return count > 1 ? `${base}-${count}` : base;
  };
};

export type Heading = { id: string; text: string; level: number };

/** The headings in a rich text field, in order. h1 counts as h2, the same as it's shown. */
export const getHeadings = (data: { root?: Node } | null | undefined): Heading[] => {
  const idFor = createHeadingIds();
  const headings: Heading[] = [];
  const walk = (nodes: Node[] = []) => {
    for (const node of nodes) {
      if (node.type === 'heading') {
        const text = textOf(node);
        headings.push({ id: idFor(text), text, level: Math.max(2, Number(node.tag?.slice(1)) || 2) });
      } else {
        walk(node.children);
      }
    }
  };
  walk(data?.root?.children);
  return headings;
};
