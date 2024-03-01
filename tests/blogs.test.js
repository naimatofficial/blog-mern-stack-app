const Page = require("./helpers/page");

let page;

beforeEach(async () => {
	page = await Page.build();
	page.goto("http://localhost:3000");
});

afterEach(async () => {
	await page.close();
});

test("When login in, show the blogs from", async () => {
	await page.login();
	await page.goto("http://localhost:3000/blogs");
});
