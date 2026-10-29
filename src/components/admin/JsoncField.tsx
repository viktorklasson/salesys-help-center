'use client';

import { loader } from '@monaco-editor/react';
import { CodeField } from '@payloadcms/ui';
import type { CodeFieldClientComponent } from 'payload';
import React, { useEffect } from 'react';

/**
 * Payload's code field, but the JSON editor accepts // comments
 * (by default Monaco marks them as errors).
 */
export const JsoncField: CodeFieldClientComponent = (props) => {
  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: true,
        trailingCommas: 'ignore',
      });
    });
  }, []);

  return <CodeField {...props} />;
};
