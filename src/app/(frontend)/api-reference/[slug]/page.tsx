import { ArrowLeft, ChevronDown } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import React from 'react';

import { getIcon } from '@/icons';
import type { Endpoint } from '@/payload-types';
import config from '@/payload.config';
import { CodeBlock } from '../../components/CodeBlock/CodeBlock';
import { FormattedText } from '../../components/FormattedText/FormattedText';
import './page.css';

// Always render with the latest content from the CMS
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

const PARAMETER_LOCATION = {
  path: 'Sökväg',
  query: 'Query',
  header: 'Header',
  body: 'Body',
} as const;

type Parameter = NonNullable<Endpoint['parameters']>[number];

/** Path, query and header parameters */
const ParameterList = ({ params }: { params?: Parameter[] }) => {
  if (!params?.length) return null;

  return (
    <div className="parameters">
      <h3 className="details-heading">Parametrar</h3>
      <dl>
        {params.map((param) => (
          <div key={param.id}>
            <dt>
              <code>{param.name}</code>
              {param.type && <span className="param-type">{param.type}</span>}
              <span className="param-in">{PARAMETER_LOCATION[param.in]}</span>
              {param.required && <span className="param-required">Obligatorisk</span>}
            </dt>
            {param.description && <dd>{param.description}</dd>}
          </div>
        ))}
      </dl>
    </div>
  );
};

/** A placeholder value that shows the type, e.g. "string", ["ObjectId"] or {} */
const placeholderFor = (type: string | null | undefined): string => {
  const base = (type ?? '').split(' ')[0];
  if (base.endsWith('[]')) return `[${placeholderFor(base.slice(0, -2))}]`;
  if (base === 'object') return '{}';
  if (base === 'boolean') return 'true';
  if (base === 'integer' || base === 'number') return '0';
  return `"${base || 'string'}"`;
};

/** Body fields as JSON, with each field's description as a comment beside it */
const BodySchema = ({ params }: { params?: Parameter[] }) => {
  if (!params?.length) return null;

  const lines = params.map((param, i) => ({
    code: `  "${param.name}": ${placeholderFor(param.type)}${i < params.length - 1 ? ',' : ''}`,
    comment: [param.required && 'Obligatorisk.', param.description].filter(Boolean).join(' '),
  }));
  const allOptional = params.every((param) => !param.required);

  // Same style as bodies written in the CMS: each comment on its own line above the field,
  // with a blank line between commented fields
  return (
    <div>
      <h3 className="details-heading">Body</h3>
      <CodeBlock>
        {'{\n'}
        {allOptional && (
          <span className="code-comment">
            {'  // Alla fält är valfria - skicka ett, några eller alla.\n'}
          </span>
        )}
        {lines.map((line, i) => (
          <React.Fragment key={params[i].id}>
            {line.comment && (
              <>
                {(i > 0 || allOptional) && '\n'}
                <span className="code-comment">{`  // ${line.comment}`}</span>
                {'\n'}
              </>
            )}
            {line.code}
            {'\n'}
          </React.Fragment>
        ))}
        {'}'}
      </CodeBlock>
    </div>
  );
};

const API_ORIGIN = 'https://app.salesys.se';

/** Splits a line at its // comment. A // inside a string (e.g. "https://…") is not a comment. */
const splitComment = (line: string): [code: string, comment: string | null] => {
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
const toLines = (text: string) => text.split(/\r\n?|\n/);

const hasComments = (text: string | null | undefined) =>
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

/** JSON with // comments, the comments shown in grey */
const CommentedJson = ({ text }: { text: string }) => (
  <CodeBlock>
    {toLines(text.trim()).map((line, i) => {
      const [code, comment] = splitComment(line);
      return (
        <React.Fragment key={i}>
          {i > 0 && '\n'}
          {code}
          {comment && <span className="code-comment">{comment}</span>}
        </React.Fragment>
      );
    })}
  </CodeBlock>
);

/** Builds a copy-pasteable curl command from the endpoint's method, path, required query params and body */
const toCurl = (endpoint: Endpoint) => {
  const query = (endpoint.parameters ?? [])
    .filter((param) => param.in === 'query' && param.required)
    .map((param) => `${param.name}=<${param.name}>`)
    .join('&');
  const url = `${API_ORIGIN}${endpoint.path}${query ? `?${query}` : ''}`;

  const lines = [
    // GET is curl's default, so -X is only needed for other methods
    `curl ${endpoint.method === 'GET' ? '' : `-X ${endpoint.method} `}"${url}"`,
    `  -H "Authorization: Bearer <access-token>"`,
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

const getService = async (slug: string) => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return docs[0];
};

/** Groups endpoints by section, keeping the order they come in */
const groupEndpoints = (endpoints: Endpoint[]) => {
  const groups = new Map<string, Endpoint[]>();
  for (const endpoint of endpoints) {
    const name = endpoint.group || 'Övrigt';
    groups.set(name, [...(groups.get(name) ?? []), endpoint]);
  }
  return [...groups];
};

/** Highlights <placeholders> in a path */
const PathText = ({ path }: { path: string }) => (
  <>
    {path.split(/(<[^>]+>)/).map((part, i) =>
      i % 2 ? (
        <span className="path-param" key={i}>
          {part}
        </span>
      ) : (
        part
      ),
    )}
  </>
);

const Method = ({ method }: { method: Endpoint['method'] }) => (
  <span className={`method method--${method.toLowerCase()}`}>{method}</span>
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService((await params).slug);
  return { title: service ? `${service.name} – API | SaleSys Docs` : 'SaleSys Docs' };
}

export default async function Page({ params }: Props) {
  const service = await getService((await params).slug);
  if (!service) notFound();

  const payload = await getPayload({ config });
  const { docs: endpoints } = await payload.find({
    collection: 'endpoints',
    where: { service: { equals: service.id } },
    sort: 'order',
    limit: 0,
    // 1 so images and files in descriptions come with their URL
    depth: 1,
  });
  const Icon = getIcon(service.icon);

  return (
    <div className="page">
      <div className="glow" />
      <div className="container">
        <Link className="back" href="/api-reference">
          <ArrowLeft size={16} /> API-referens
        </Link>

        <header className="page-header api-service-header">
          <div className="page-title-container">
            <Icon className="api-service-icon" size={48} strokeWidth={1.5} />
            <h1>{service.name}</h1>
          </div>
          <p className="lead">{service.tagline}</p>
          <p className="api-service-meta">
            <code>/api/{service.slug}</code>
            <span>{endpoints.length} endpoints</span>
          </p>
        </header>

        {endpoints.length === 0 ? (
          <p className="api-empty">
            Det finns ingen API-dokumentation för den här funktionen ännu.
          </p>
        ) : (
          groupEndpoints(endpoints).map(([group, items]) => (
            <section className="endpoint-group" key={group}>
              <h2>{group}</h2>
              <ul className="endpoint-rows">
                {items.map((endpoint) => (
                  <li
                    className={endpoint.deprecated ? 'is-deprecated' : undefined}
                    id={endpoint.id}
                    key={endpoint.id}
                  >
                    <details>
                      {/* One compact row; the details open on click */}
                      <summary>
                        <Method method={endpoint.method} />
                        <span className="row-summary">
                          {endpoint.summary}
                          {endpoint.deprecated && <span className="badge">Utfasad</span>}
                        </span>
                        <code className="row-path">
                          <PathText path={endpoint.path} />
                        </code>
                        <ChevronDown className="row-chevron" size={18} />
                      </summary>

                      <div className="endpoint-details">
                        <code className="details-path">
                          <PathText path={endpoint.path} />
                        </code>
                        <FormattedText data={endpoint.description} />

                        <ParameterList
                          params={endpoint.parameters?.filter((param) => param.in !== 'body')}
                        />
                        {endpoint.parameters?.some((param) => param.in === 'body') ? (
                          <BodySchema
                            params={endpoint.parameters.filter((param) => param.in === 'body')}
                          />
                        ) : (
                          // A body written with comments in the CMS is shown as-is
                          endpoint.method !== 'GET' &&
                          hasComments(endpoint.requestBody) && (
                            <div>
                              <h3 className="details-heading">Body</h3>
                              <CommentedJson text={endpoint.requestBody!} />
                            </div>
                          )
                        )}

                        <div>
                          <h3 className="details-heading">cURL-exempel</h3>
                          {/* A command written in the CMS wins over the generated one */}
                          <CodeBlock>{endpoint.curlExample?.trim() || toCurl(endpoint)}</CodeBlock>
                        </div>
                        {/* Only when something is known about the response */}
                        {endpoint.responseExample && (
                          <div>
                            <h3 className="details-heading">Exempelrespons</h3>
                            <CodeBlock>{endpoint.responseExample}</CodeBlock>
                          </div>
                        )}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
