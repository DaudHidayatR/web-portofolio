// @ts-check

import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://daudhidayatramadhan.my.id",
	integrations: [sitemap(), svelte()],

	vite: {
		plugins: [tailwindcss()],
	},

	output: "static",
});
