const redis = require("redis");
const keys = require("./keys");

const client = redis.createClient(keys.redisUrl);

client.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
	await client.connect();

	console.log("Redis cache database connected...");
}

connectRedis();

module.exports = client;
