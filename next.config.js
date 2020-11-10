const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
runtimeCaching[0].handler = 'StaleWhileRevalidate'

module.exports = withPWA({
    pwa: {
      dest: 'public',
      register: false,
      skipWaiting: false,
      runtimeCaching
    }
});