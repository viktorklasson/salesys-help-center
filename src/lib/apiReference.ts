import { getPayload } from 'payload';

import type { Endpoint } from '@/payload-types';
import config from '@/payload.config';

const API_ORIGIN = 'https://app.salesys.se';

/** Splits a line at its // comment. A // inside a string (e.g. "https://…") is not a comment. */
export const splitComment = (line: string): [code: string, comment: string | null] => {
  let inString = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inString && char === '\\')
      i++; // Skip escaped characters, e.g. \"
    else if (char === '"') inString = !inString;
    else if (!inString && char === '/' && line[i + 1] === '/')
      return [line.slice(0, i), line.slice(i)];
  }
  return [line, null];
};

/** Splits text into lines. Text pasted on Windows uses \r\n, which would otherwise leave a stray \r on every line. */
export const toLines = (text: string) => text.split(/\r\n?|\n/);

export const hasComments = (text: string | null | undefined) =>
  !!text && toLines(text).some((line) => splitComment(line)[1] !== null);

/** Removes // comments so the body is valid JSON again, and tidies the formatting when possible */
const stripComments = (text: string) => {
  const code = toLines(text)
    .map((line) => splitComment(line)[0].trimEnd())
    .filter((line) => line.trim())
    .join('\n');
  try {
    return JSON.stringify(JSON.parse(code), null, 2);
  } catch {
    return code;
  }
};

/** Builds a copy-pasteable curl command from the endpoint's method, path, required query params and body */
export const toCurl = (endpoint: Endpoint) => {
  const query = (endpoint.parameters ?? [])
    .filter((param) => param.in === 'query' && param.required)
    .map((param) => `${param.name}=<${param.name}>`)
    .join('&');
  const url = `${API_ORIGIN}${endpoint.path}${query ? `?${query}` : ''}`;

  const lines = [
    // GET is curl's default, so -X is only needed for other methods
    `curl ${endpoint.method === 'GET' ? '' : `-X ${endpoint.method} `}"${url}"`,
    `  -H "Authorization: Bearer <token>"`,
    `  -H "Content-Type: application/json"`,
  ];

  if (endpoint.method !== 'GET' && endpoint.requestBody?.trim()) {
    // Escape single quotes for the shell, and indent the JSON under the command
    // Comments are only for the docs; the command must send valid JSON
    const body = stripComments(endpoint.requestBody.trim())
      .replace(/'/g, `'\\''`)
      .replace(/\n/g, '\n  ');
    lines.push(`  -d '${body}'`);
  }

  return lines.join(' \\\n');
};

export const getService = async (slug: string) => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'services',
    // Advanced functions aren't part of the API reference, so their page is a 404
    where: { slug: { equals: slug }, isAdvanced: { not_equals: true } },
    limit: 1,
  });
  return docs[0];
};

const METHOD_ORDER: Endpoint['method'][] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/** Groups endpoints by section, keeping the order they come in */
export const groupEndpoints = (endpoints: Endpoint[]) => {
  const groups = new Map<string, Endpoint[]>();
  for (const endpoint of endpoints) {
    const name = endpoint.group || 'Övrigt';
    groups.set(name, [...(groups.get(name) ?? []), endpoint]);
  }
  // Within each section: GET, POST, PUT, PATCH, DELETE. The sort is stable,
  // so endpoints with the same method keep their order from the CMS.
  return [...groups].map(
    ([name, items]) =>
      [
        name,
        [...items].sort((a, b) => METHOD_ORDER.indexOf(a.method) - METHOD_ORDER.indexOf(b.method)),
      ] as const,
  );
};
