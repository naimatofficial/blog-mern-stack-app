const Page = require("./helpers/page");

let page;

// Before every test execution this function executed
beforeEach(async () => {
	page = await Page.build();
	await page.goto("http://localhost:3000");
});

// After every test execution this function executed
afterEach(async () => {
	await page.close();
});

test("🔤 The header has correct text ", async () => {
	const text = await page.getContentsOf("a.brand-logo");

	expect(text).toEqual("Blogster");
});

test("👤 Clicking login start oauth flow ", async () => {
	await page.click(".right a");

	const url = await page.url();

	expect(url).toMatch(/accounts\.google\.com/);
});

test("♾️ When signed in, shows the logout button", async () => {
	await page.login();

	const text = await page.getContentsOf('a[href="/auth/logout"]');

	await expect(text).toEqual("Logout");
});
