const fs = require('fs');
const path = require('path');

const filesOnly = clientEntriesByChunk => Object.keys(clientEntriesByChunk).reduce((acc, key) => {
  if (key === 'run' || key === 'manifest') return acc;
  acc[key] = clientEntriesByChunk[key][0];
  return acc;
}, {});

module.exports = (
  serverConfig,
  clientConfig,
  serverEntriesByChunk,
  clientEntriesByChunk,
  cb
) => {
  const clientManifestEntry = clientEntriesByChunk.manifest[0];
  const clientEntry = clientEntriesByChunk.run[0];
  const serverEntry = serverEntriesByChunk.run[0];

  const serverPath = path.resolve(serverConfig.output.path, serverEntry);
  const clientManifestPath = path.resolve(clientConfig.output.path, clientManifestEntry);

  fs.readFile(serverPath, 'utf8', (serverFileErr, serverEntryContents) => {
    if (serverFileErr) throw new Error(serverFileErr);

    fs.readFile(clientManifestPath, 'utf8', (manifestErr, manifestContents) => {
      const manifestSourceMap = new RegExp(/\n\/\/# sourceMappingURL=manifest\.js\.map/, 'g');
      serverEntryContents = serverEntryContents
        .replace(/'{{SAMBELL_WEBPACK_INLINE_MANIFEST}}'/g, `\`${manifestContents.replace(manifestSourceMap, '')}\``)
        .replace(/{{SAMBELL_CLIENT_ENTRY}}/g, clientEntry)
        .replace(/{{SAMBELL_CLIENT_CHUNKS}}/g, JSON.stringify(filesOnly(clientEntriesByChunk)));

      fs.writeFile(serverPath, serverEntryContents, 'utf8', (serverRewriteErr) => {
        if (serverRewriteErr) throw new Error(serverRewriteErr);
        cb()
      });
    });
  });
}
