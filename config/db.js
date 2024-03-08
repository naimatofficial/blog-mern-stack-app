const mongoose = require("mongoose");
const keys = require("./keys");

mongoose.set("strictQuery", false);

const connectDB = async () => {
	try {
		const connect = await mongoose.connect(keys.mongoURI);

		console.log(`Mongodb connected: ${connect.connection.host}`);
	} catch (error) {
		console.log(`Error: ${error.message}`);
	}
};

module.exports = connectDB;
