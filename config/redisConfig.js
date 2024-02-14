const redis = require("redis");

const redisUrl = "redis://127.0.0.1:6379";
const redisClient = redis.createClient(redisUrl);

redisClient.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
	await redisClient.connect();

	console.log("Redis cache database connected...");
}

connectRedis();

module.exports = redisClient;
