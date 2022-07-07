// 配置反向代理
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://114.55.43.23:8090', // 配置转发目标地址 (能返回数据的服务器地址)
            changeOrigin: true,
        })
    );
    app.use(
        '/api1',
        createProxyMiddleware({
            target: 'http://localhost:8000',
            changeOrigin: true,
        })
    );
};