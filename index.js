const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
const connectDB = require("./config/db");

require("./models/User");
require("./models/Blog");
require("./services/passport");
require("./services/cache");

connectDB();

const app = express();

app.use(bodyParser.json());
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey],
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
	res.send("API is Running...");
});

require("./routes/authRoutes")(app);
require("./routes/blogRoutes")(app);

if (["production", "ci"].includes(process.env.NODE_ENV)) {
	app.use(express.static("client/build"));

	const path = require("path");
	app.get("*", (req, res) => {
		res.sendFile(path.resolve("client", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Listening on port`, PORT);
});
