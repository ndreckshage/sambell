import domready from 'domready';

let ready = false;
let clientCalledReady = false;
let clientCb = () => {};

const waitForChunks = window.__SAMBELL_WAIT_FOR_CHUNKS__ || 0;
const chunkCount = () => window.__SAMBELL_CHUNK_COUNT__ || 0;
const chunksReady = () => chunkCount() >= waitForChunks;

const maybeLoad = () => {
  if (!ready && clientCalledReady && clientCb && chunksReady()) {
    ready = true;
    domready(clientCb);
  }
}

window.__SAMBELL_CHUNK_CB__ = maybeLoad;

export default cb => {
  clientCalledReady = true;
  clientCb = cb;
  maybeLoad();
};
