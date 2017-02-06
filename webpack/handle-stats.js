module.exports = cb => (err, multiStats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) console.error(err.details);
    return;
  }

  let clientEntry = null;
  let serverEntry = null;
  multiStats.stats.forEach((stats) => {
    const json = stats.toJson();
    if (stats.hasErrors()) console.error(json.errors);
    if (stats.hasWarnings()) console.warn(json.warnings);
    console.log(stats.toString({ chunks: false, colors: true }));

    const entry = typeof json.assetsByChunkName.run === 'object' ? json.assetsByChunkName.run[0] : json.assetsByChunkName.run;
    if (stats.compilation.compiler.options.target === 'web') {
      clientEntry = entry;
    } else {
      serverEntry = entry;
    }
  });

  cb(clientEntry, serverEntry);
};
