const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
	// Proxy middleware for /auth/* and /api/*
	app.use(
		["/auth", "/api"], // paths to proxy
		createProxyMiddleware({
			target: "http://localhost:5000", // target host
			changeOrigin: true, // needed for virtual hosted sites
			pathRewrite: {
				"^/auth": "/auth", // remove base path
				"^/api": "/api", // remove base path
			},
		})
	);
};
