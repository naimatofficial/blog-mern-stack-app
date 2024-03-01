const redis = require("redis");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

client.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
	await client.connect();

	console.log("Redis cache database connected...");
}

connectRedis();

module.exports = client;
