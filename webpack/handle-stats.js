module.exports = (cb) => (err, multiStats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) console.error(err.details);
    return;
  }

  let entries = [];
  multiStats.stats.forEach((stats) => {
    const json = stats.toJson();
    if (stats.hasErrors()) console.error(json.errors);
    if (stats.hasWarnings()) console.warn(json.warnings);

    const entry = typeof json.assetsByChunkName.run === 'object' ? json.assetsByChunkName.run[0] : json.assetsByChunkName.run;
    entries.push(entry);

    console.log(stats.toString({ chunks: false, colors: true }));
  });

  cb(entries);
};
