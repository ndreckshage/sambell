import React from 'react';

// @NOTE render our script tags.
// take array of async chunkNames if using @humblespark/react-loadable (recommended)

export const renderScripts = (asyncChunks = []) => {
  if (typeof window !== 'undefined') {
    throw new Error('ONLY AVAILABLE ON SERVER.');
  }

  const clientChunks = JSON.parse('{{SAMBELL_CLIENT_CHUNKS}}');
  const filteredAsyncChunks = asyncChunks.reduce(
    (acc, asyncChunk) =>
      acc.includes(asyncChunk) || !clientChunks[asyncChunk]
        ? acc
        : [...acc, clientChunks[asyncChunk]],
    [],
  );

  const totalChunks = [
    '{{SAMBELL_CLIENT_VENDOR_ENTRY}}',
    '{{SAMBELL_CLIENT_ENTRY}}',
    ...filteredAsyncChunks,
  ];

  const MANIFEST = '{{SAMBELL_CLIENT_WEBPACK_MANIFEST}}';
  const WAIT_FOR = `window.__SAMBELL_WAIT_FOR_CHUNKS__=${totalChunks.length};`;

  return [
    <script
      key="__sambell_init__"
      type="text/javascript"
      dangerouslySetInnerHTML={{ __html: `${MANIFEST}${WAIT_FOR}` }}
    />,
    totalChunks.map(chunk => (
      <script
        key={`__sambell_chunk_${chunk}__`}
        type="text/javascript"
        src={`{{SAMBELL_WEBPACK_PUBLIC_PATH}}${chunk}`}
        async
      />
    )),
  ];
};
