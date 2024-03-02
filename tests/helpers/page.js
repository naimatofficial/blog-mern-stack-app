const puppeteer = require("puppeteer");
const userFactory = require("../factories/userFactory");
const sessionFactory = require("../factories/sessionFactory");

class CustomPage {
	static async build() {
		const browser = await puppeteer.launch({
			headless: false,
		});

		const page = await browser.newPage();
		const customPage = new CustomPage(page);

		return new Proxy(customPage, {
			// Define a new proxy for the 'customPage' object
			get: (target, prop) => {
				// 'target': the original object being proxied (customPage)
				// 'property': the property being accessed

				// Check if the property exists in the original object (customPage)
				if (prop in target) {
					// If the property exists in the original object, return its value directly
					return target[prop];
				}

				// If the property does not exist in the original object, try to find it in the browser or page objects
				const value = browser[prop] || page[prop];

				// If the found value is a function
				if (typeof value === "function") {
					// Return a new function that will execute the original function with the correct context

					// Determine the context for the function execution (either browser or page)
					const context = browser[prop] ? browser : page;

					// Return a function that applies the context and arguments to the original function
					return function (...args) {
						return value.apply(context, args);
					};
				}

				// If the found value is not a function, return it as is
				return value;
			},
		});
	}

	constructor(page) {
		this.page = page;
	}

	async login() {
		const user = await userFactory();

		const { session, sign } = sessionFactory(user);

		await this.page.setCookie({ name: "session", value: session });
		await this.page.setCookie({ name: "session.sig", value: sign });
		await this.page.goto("http://localhost:3000/blogs");
		await this.page.waitForSelector('a[href="/auth/logout"]');
	}

	async getContentsOf(selector) {
		return this.page.$eval(selector, (el) => el.innerHTML);
	}
}

module.exports = CustomPage;
