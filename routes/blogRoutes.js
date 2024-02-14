const client = require("../config/redisConfig");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");

const Blog = mongoose.model("Blog");

module.exports = (app) => {
	app.get("/api/blogs/:id", requireLogin, async (req, res) => {
		const blog = await Blog.findOne({
			_user: req.user.id,
			_id: req.params.id,
		});

		res.send(blog);
	});

	app.get("/api/blogs", requireLogin, async (req, res) => {
		// Do we have any cached data in Redis related to this query
		const cachedBlogs = await client.get(req.user.id);

		// if yes, then respond to the request right away and return the data
		if (cachedBlogs) {
			console.log("SERVING FROM CACHE");
			return res.send(JSON.parse(cachedBlogs));
		}

		// if no, we need to respond to the request
		// and update our cache to store the data
		const blogs = await Blog.find({ _user: req.user.id });
		console.log("SERVING FROM MONGODB");

		// Update Redis cache with the fetched data
		client.set(req.user.id, JSON.stringify(blogs));

		// Send response with blogs fetched from MongoDB
		res.send(blogs);
	});

	app.post("/api/blogs", requireLogin, async (req, res) => {
		const { title, content } = req.body;

		const blog = new Blog({
			title,
			content,
			_user: req.user.id,
		});

		try {
			await blog.save();
			res.send(blog);
		} catch (err) {
			res.send(400, err);
		}
	});
};
