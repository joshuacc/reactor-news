const { adjustWorkbox, override } = require('customize-cra');

module.exports = override(
  // adjust the underlying workbox
  adjustWorkbox((wb) => {
    Object.assign(wb, {
      clientsClaim: true,
      skipWaiting: true,
      importWorkboxFrom: 'local',
      importScripts: ['sw-custom.js'],
    });
  })
);
