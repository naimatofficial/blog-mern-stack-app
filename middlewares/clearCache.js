const { clearCache } = require("../services/cache");

module.exports = async (req, res, next) => {
	// first execute the route handler
	await next();

	// after that clear the cache according to user id
	clearCache(req.user.id);
};
