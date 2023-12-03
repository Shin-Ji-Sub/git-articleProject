const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    createProxyMiddleware('/svc/search',{
      target: 'https://api.nytimes.com',
      changeOrigin: true,
    }),
  );
};