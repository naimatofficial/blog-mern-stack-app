const passport = require("passport");

module.exports = (app) => {
	app.get(
		"/auth/google",
		passport.authenticate("google", {
			scope: ["profile", "email"],
		})
	);

	app.get(
		"/auth/google/callback",
		passport.authenticate("google"),
		(req, res) => {
			// Get the redirect URL from the query parameters or default to localhost:3000
			const redirectUrl = req.query.redirect || "http://localhost:3000/blogs";
			res.redirect(redirectUrl);
		}
	);

	app.get("/auth/logout", (req, res) => {
		req.logout();
		res.redirect("/");
	});

	app.get("/api/current_user", (req, res) => {
		res.send(req.user);
	});
};
