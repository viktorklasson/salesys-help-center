import React from 'react';

import { CopyButton } from '../CopyButton/CopyButton';
import './CodeBlock.css';

/**
 * Dark code panel with a small title bar, e.g. for request and response examples.
 * With `copyText`, a button in the corner copies that text (which can differ from what's shown,
 * e.g. a body without its comments).
 */
export function CodeBlock({
  children,
  copyText,
  title,
}: {
  children: React.ReactNode;
  copyText?: string;
  title?: React.ReactNode;
}) {
  return (
    <figure className={copyText ? 'code-block has-copy' : 'code-block'}>
      {title && <figcaption>{title}</figcaption>}
      {copyText && (
        <div className="code-block-copy">
          <CopyButton text={copyText} />
        </div>
      )}
      <pre>
        {/* Text pasted on Windows uses \r\n, which the browser shows as an extra blank line */}
        <code>{typeof children === 'string' ? children.replace(/\r\n?/g, '\n') : children}</code>
      </pre>
    </figure>
  );
}
