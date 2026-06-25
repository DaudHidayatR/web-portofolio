// @ts-check

import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://daudhr.com",
	integrations: [
		sitemap({
			filter: (page) => !page.endsWith("/blog/"),
		}),
		svelte(),
	],

	vite: {
		plugins: [tailwindcss()],
	},

	output: "static",
});
