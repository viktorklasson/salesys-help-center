import React from 'react';

import './CodeBlock.css';

/** Dark code panel with a small title bar, e.g. for request and response examples */
export function CodeBlock({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
}) {
  return (
    <figure className="code-block">
      {title && <figcaption>{title}</figcaption>}
      <pre>
        {/* Text pasted on Windows uses \r\n, which the browser shows as an extra blank line */}
        <code>{typeof children === 'string' ? children.replace(/\r\n?/g, '\n') : children}</code>
      </pre>
    </figure>
  );
}
