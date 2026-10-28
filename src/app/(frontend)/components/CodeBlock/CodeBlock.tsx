import React from 'react';

import './CodeBlock.css';

/** Dark code panel with a small title bar, e.g. for request and response examples */
export function CodeBlock({ children, title }: { children: string; title?: React.ReactNode }) {
  return (
    <figure className="code-block">
      {title && <figcaption>{title}</figcaption>}
      <pre>
        <code>{children}</code>
      </pre>
    </figure>
  );
}
