export default (src, content = '', criticalStyles = '') => {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>sambell</title>
        <script type="text/javascript" src="${src}" async></script>
        <style id="critical-styles">${criticalStyles}</style>
      </head>
      <body>
        <div id="root">${content}</div>
      </body>
    </html>
  `;
};
