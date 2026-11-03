import { BlocksFeature, CodeBlock } from '@payloadcms/richtext-lexical';

/**
 * A code block in the editor: pick a language and paste code. Shown on the site in the same dark
 * panel as the API examples (components/FormattedText).
 */
export const codeBlockFeature = () =>
  BlocksFeature({
    blocks: [
      CodeBlock({
        defaultLanguage: 'json',
        // Monaco language IDs, used for highlighting in the editor
        languages: {
          json: 'JSON',
          shell: 'Shell / cURL',
          javascript: 'JavaScript',
          typescript: 'TypeScript',
          php: 'PHP',
          html: 'HTML',
          css: 'CSS',
          sql: 'SQL',
          xml: 'XML',
          yaml: 'YAML',
          plaintext: 'Text',
        },
      }),
    ],
  });
