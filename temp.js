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
