const mongoose = require("mongoose");
const client = require("../config/redisConfig");
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
	this.useCache = true;
	this.hasKey = JSON.stringify(options.key || "");
	return this;
};

mongoose.Query.prototype.exec = async function () {
	if (!this.useCache) {
		return exec.apply(this, arguments);
	}

	// Object.assign(target, source1, source2);
	const key = JSON.stringify(
		Object.assign({}, this.getQuery(), {
			collection: this.mongooseCollection.name,
		})
	);

	// See if the value is key in redis
	const chacheValue = await client.hGet(this.hasKey, key);

	// if we do, return that
	if (chacheValue) {
		const doc = JSON.parse(chacheValue);

		return Array.isArray(doc)
			? doc.map((d) => new this.model(d))
			: new this.model(doc);
	}

	// Otherwise, issue the new query and store the result in redis
	const result = await exec.apply(this, arguments);

	client.hSet(this.hasKey, key, JSON.stringify(result), "EX", 10);

	return result;
};

module.exports = {
	clearCache(hashKey) {
		client.del(JSON.stringify(hashKey));
	},
};
