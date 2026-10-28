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

const PARAMETER_LOCATION = { path: 'Sökväg', query: 'Query', header: 'Header' } as const;

const API_ORIGIN = 'https://app.salesys.se';

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
    const body = endpoint.requestBody.trim().replace(/'/g, `'\\''`).replace(/\n/g, '\n  ');
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
    depth: 0,
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
          <Icon className="api-service-icon" size={32} strokeWidth={1.5} />
          <h1>{service.name}</h1>
          <p className="lead">{service.tagline}</p>
          <p className="api-service-meta">
            <code>/api/{service.slug}</code>
            <span>{endpoints.length} endpoints</span>
          </p>
        </header>

        {endpoints.length === 0 ? (
          <p className="api-empty">Det finns ingen API-dokumentation för den här funktionen ännu.</p>
        ) : (
          groupEndpoints(endpoints).map(([group, items]) => (
            <section className="endpoint-group" key={group}>
              <h2>{group}</h2>
              <ul className="endpoint-rows">
                {items.map((endpoint) => (
                  <li className={endpoint.deprecated ? 'is-deprecated' : undefined} id={endpoint.id} key={endpoint.id}>
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

                        {!!endpoint.parameters?.length && (
                          <div className="parameters">
                            <h3 className="details-heading">Parametrar</h3>
                            <dl>
                              {endpoint.parameters.map((param) => (
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
                        )}

                        <div>
                          <h3 className="details-heading">cURL-exempel</h3>
                          <CodeBlock>{toCurl(endpoint)}</CodeBlock>
                        </div>
                        {/* Only when something is known about the response */}
                        {(endpoint.responseExample || endpoint.responseDescription) && (
                          <div>
                            <h3 className="details-heading">Exempelrespons</h3>
                          <CodeBlock
                          >
                            {endpoint.responseExample ?? 'Inget innehåll i svaret.'}
                          </CodeBlock>
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
