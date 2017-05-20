import sambellReady from 'sambell/ready';

// sambellReady tells us all our async chunks have loaded
sambellReady(() => { require('client/start') });
