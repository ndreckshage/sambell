const fs = require('fs');
const path = require('path');

// @NOTE - webpack build vs run give us different things...
const getAdjustedChunkPath = chunkPath => typeof chunkPath === 'object' ? chunkPath[0] : chunkPath;

const filesOnly = clientEntriesByChunk => Object.keys(clientEntriesByChunk).reduce((acc, key) => {
  if (key === 'run' || key === 'manifest') return acc;
  acc[key] = getAdjustedChunkPath(clientEntriesByChunk[key]);
  return acc;
}, {});

module.exports = (
  serverConfig,
  clientConfig,
  serverEntriesByChunk,
  clientEntriesByChunk,
  cb
) => {
  const clientManifestEntry = getAdjustedChunkPath(clientEntriesByChunk.manifest);
  const clientVendorEntry = getAdjustedChunkPath(clientEntriesByChunk.vendor);
  const clientEntry = getAdjustedChunkPath(clientEntriesByChunk.run);
  const serverEntry = getAdjustedChunkPath(serverEntriesByChunk.run);

  const serverPath = path.resolve(serverConfig.output.path, serverEntry);
  const clientManifestPath = path.resolve(clientConfig.output.path, clientManifestEntry);

  fs.readFile(serverPath, 'utf8', (serverFileErr, serverEntryContents) => {
    if (serverFileErr) throw new Error(serverFileErr);

    fs.readFile(clientManifestPath, 'utf8', (manifestErr, manifestContents) => {
      const manifestSourceMap = new RegExp(/\n\/\/# sourceMappingURL=manifest\.js\.map/, 'g');
      serverEntryContents = serverEntryContents
        .replace(/'{{SAMBELL_CLIENT_WEBPACK_MANIFEST}}'/g, `\`${manifestContents.replace(manifestSourceMap, '')}\``)
        .replace(/{{SAMBELL_CLIENT_VENDOR_ENTRY}}/g, clientVendorEntry)
        .replace(/{{SAMBELL_CLIENT_ENTRY}}/g, clientEntry)
        .replace(/{{SAMBELL_CLIENT_CHUNKS}}/g, JSON.stringify(filesOnly(clientEntriesByChunk)));

      fs.writeFile(serverPath, serverEntryContents, 'utf8', (serverRewriteErr) => {
        if (serverRewriteErr) throw new Error(serverRewriteErr);
        cb()
      });
    });
  });
}
