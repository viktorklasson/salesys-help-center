import { internalLinkHref } from './internalLinks';

/**
 * Turns a rich text field from the CMS into Markdown or plain text, e.g. for the "Kopiera sida"
 * button on a guide. Follows how the site shows the text: h1 counts as h2 (the page title is the h1),
 * internal links get the same address as on the site (lib/internalLinks), and code blocks keep their language.
 * Plain text leaves out formatting, link addresses and uploaded files.
 *
 * Links are relative (/guides/…), as on the site. Needs the field queried with depth ≥ 1, so internal
 * links and uploads come with their address.
 */

type Node = {
  type?: string;
  children?: Node[];
  text?: string;
  format?: number | string;
  tag?: string;
  listType?: string;
  value?: unknown;
  checked?: boolean;
  fields?: Record<string, unknown>;
};

type RichText = { root?: { children?: Node[] } } | null | undefined;

// Text format bits used by Lexical
const BOLD = 1;
const ITALIC = 2;
const STRIKETHROUGH = 4;
const CODE = 16;

/** Characters that would otherwise be read as Markdown formatting */
function escapeMarkdown(text: string) {
  return text.replace(/[\\`*_[\]<>]/g, '\\$&');
}

function formatText(text: string, format: number) {
  if (format & CODE) {
    return text.includes('`') ? `\`\` ${text} \`\`` : `\`${text}\``;
  }

  // Markers must touch the text, so "**bold **" becomes "**bold** "
  const [, before, core, after] = escapeMarkdown(text).match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  if (!core) {
    return before + after;
  }
  let wrapped = core;
  if (format & STRIKETHROUGH) {
    wrapped = `~~${wrapped}~~`;
  }
  if (format & ITALIC) {
    wrapped = `*${wrapped}*`;
  }
  if (format & BOLD) {
    wrapped = `**${wrapped}**`;
  }
  return before + wrapped + after;
}

/** The text of a paragraph, heading or list item, without line breaks at the start or end */
function inline(nodes: Node[] = [], markdown: boolean): string {
  return inlineNodes(nodes, markdown).trim();
}

function inlineNodes(nodes: Node[] = [], markdown: boolean): string {
  return nodes.map((node) => inlineNode(node, markdown)).join('');
}

function inlineNode(node: Node, markdown: boolean): string {
  switch (node.type) {
    case 'text':
      return markdown ? formatText(node.text ?? '', Number(node.format) || 0) : (node.text ?? '');
    case 'linebreak':
      return markdown ? '  \n' : '\n';
    case 'tab':
      return '\t';
    case 'link':
    case 'autolink': {
      const text = inlineNodes(node.children, markdown);
      if (!markdown) {
        return text;
      }
      const href =
        node.fields?.linkType === 'internal'
          ? internalLinkHref(node.fields)
          : String(node.fields?.url ?? '');
      return href && href !== '#' ? `[${text}](${href})` : text;
    }
    default:
      return inlineNodes(node.children, markdown);
  }
}

function list(node: Node, markdown: boolean, indent: string): string {
  return (node.children ?? [])
    .map((item, i) => listItem(node, item, i, markdown, indent))
    .filter(Boolean)
    .join('\n');
}

function listItem(parent: Node, item: Node, index: number, markdown: boolean, indent: string): string {
  const marker =
    parent.listType === 'number'
      ? `${Number(item.value) || index + 1}.`
      : parent.listType === 'check'
        ? `- [${item.checked ? 'x' : ' '}]`
        : '-';
  const childIndent = indent + ' '.repeat(marker.length + 1);
  const children = item.children ?? [];
  // A nested list is a list item of its own, holding only the list
  const text = inline(
    children.filter((child) => child.type !== 'list'),
    markdown,
  ).replace(/\n/g, `\n${childIndent}`);
  const nested = children
    .filter((child) => child.type === 'list')
    .map((child) => list(child, markdown, childIndent));

  return [text && `${indent}${marker} ${text}`, ...nested].filter(Boolean).join('\n');
}

function block(node: Node, markdown: boolean): string {
  switch (node.type) {
    case 'heading': {
      const text = inline(node.children, markdown);
      const level = Math.max(2, Number(node.tag?.slice(1)) || 2);
      return markdown ? `${'#'.repeat(level)} ${text}` : text;
    }
    case 'list':
      return list(node, markdown, '');
    case 'quote': {
      const text = inline(node.children, markdown);
      return markdown ? text.replace(/^/gm, '> ') : text;
    }
    case 'horizontalrule':
      return markdown ? '---' : '';
    case 'upload': {
      const file = node.value as { url?: string; alt?: string; filename?: string; mimeType?: string };
      if (!markdown || !file || typeof file !== 'object' || !file.url) {
        return '';
      }
      const label = escapeMarkdown(file.alt || file.filename || '');
      return file.mimeType?.startsWith('image/') ? `![${label}](${file.url})` : `[${label}](${file.url})`;
    }
    case 'block': {
      if (node.fields?.blockType !== 'Code') {
        return '';
      }
      // Text pasted on Windows uses \r\n
      const code = String(node.fields.code ?? '').replace(/\r\n?/g, '\n');
      if (!markdown) {
        return code;
      }
      const fence = code.includes('```') ? '````' : '```';
      return `${fence}${node.fields.language ?? ''}\n${code}\n${fence}`;
    }
    default:
      return inline(node.children, markdown);
  }
}

function convert(data: RichText, markdown: boolean) {
  return (data?.root?.children ?? [])
    .map((node) => block(node, markdown))
    .filter((text) => text.trim())
    .join('\n\n');
}

export function richTextToMarkdown(data: RichText) {
  return convert(data, true);
}

export function richTextToPlainText(data: RichText) {
  return convert(data, false);
}
