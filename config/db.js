const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDB = async () => {
	try {
		const connect = await mongoose.connect("mongodb://0.0.0.0:27017/blog", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log("Connent: ", connect.connection.host);

		console.log(`Mongodb connected: ${connect.connection.host}`);
	} catch (error) {
		console.log(`Error: ${error.message}`);
	}
};

module.exports = connectDB;
