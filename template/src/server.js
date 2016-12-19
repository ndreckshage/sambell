import React from 'react';
import express from 'express';
import template from 'template';
import { renderToString } from 'react-dom/server';
import { GatherCriticalStyles, stringifyStyles } from 'react-ssr-critical-styles';
import App from 'App';

const server = express();
server.use('/assets/', express.static(process.env.SAMBELL_CLIENT_OUTPUT_DIR));

server.get('*', (req, res) => {
  let criticalStyles = [];
  const content = renderToString(
    <GatherCriticalStyles addCriticalStyles={(s) => criticalStyles.push(s)}>
      <App />
    </GatherCriticalStyles>
  );

  res.status(200).send(template(process.env.SAMBELL_CLIENT_ENTRY, content, stringifyStyles(criticalStyles)));
});

server.listen(3000);
