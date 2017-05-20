// if (typeof window !== "undefined") {
//   setTimeout(function() {
//     if (!window.__SAMBELL_CHUNK_COUNT__) {
//       window.__SAMBELL_CHUNK_COUNT__ = 0;
//     }
//     window.__SAMBELL_CHUNK_COUNT__ = window.__SAMBELL_CHUNK_COUNT__ + 1;
//     if (typeof window.__SAMBELL_CHUNK_CB__ === "function") {
//       window.__SAMBELL_CHUNK_CB__();
//     }
//   }, 0);
// }

module.exports = '"undefined"!=typeof window&&setTimeout(function(){window.__SAMBELL_CHUNK_COUNT__||(window.__SAMBELL_CHUNK_COUNT__=0),window.__SAMBELL_CHUNK_COUNT__=window.__SAMBELL_CHUNK_COUNT__+1,"function"==typeof window.__SAMBELL_CHUNK_CB__&&window.__SAMBELL_CHUNK_CB__()},0);';
