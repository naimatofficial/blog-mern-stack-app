const Page = require("./helpers/page");

let page;

beforeEach(async () => {
	page = await Page.build();
	await page.goto("http://localhost:3000");
});

afterEach(async () => {
	await page.close();
});

// Nested Describe tests
describe("When logged in", () => {
	beforeEach(async () => {
		await page.login();
		await page.click("a.btn-floating");
	});

	test("Can see the create blogs form", async () => {
		const label = await page.getContentsOf("form label");

		expect(label).toEqual("Blog Title");
	});

	describe("And using valid inputs", () => {
		const blogTitle = "My Title";
		const blogContent = "My Content";

		beforeEach(async () => {
			await page.type(".title input", blogTitle);
			await page.type(".content input", blogContent);
			await page.click("form button");
		});

		test("Submitting takes user to review screen", async () => {
			const text = await page.getContentsOf("form h5");
			expect(text).toEqual("Please confirm your entries");
		});

		test("Submitting then saving adds blog to index page", async () => {
			await page.click("form button.green");
			await page.waitForSelector(".card");

			const title = await page.getContentsOf(".card-content .card-title");
			const content = await page.getContentsOf(".card-content p");

			expect(title).toEqual(blogTitle);
			expect(content).toEqual(blogContent);
		});
	});

	describe("And using invalid inputs", () => {
		beforeEach(async () => {
			await page.click("form button");
		});

		test("The form shows an error message", async () => {
			const titleError = await page.getContentsOf(".title .red-text");
			const contentError = await page.getContentsOf(".content .red-text");

			expect(titleError).toEqual("You must provide a value");
			expect(contentError).toEqual("You must provide a value");
		});
	});
});

describe("When user is not logged in", () => {
	test("User cannot create a blog post", async () => {
		const result = await page.evaluate(() => {
			return fetch("/api/blogs", {
				method: "POST",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title: "My Title",
					content: "This is new content",
				}),
			}).then((res) => res.json());
		});

		expect(result).toEqual({ error: "You must log in!" });
	});

	test("User cannot get blogs", async () => {
		const result = await page.evaluate(() => {
			return fetch("/api/blogs", {
				method: "GET",
				credentials: "same-origin",
				headers: {
					"Content-Type": "application/json",
				},
			}).then((res) => res.json());
		});

		expect(result).toEqual({ error: "You must log in!" });
	});
});
