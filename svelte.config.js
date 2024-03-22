import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
 
    kit: {
		appDir: "_app",
        adapter: adapter(),
        paths: {
			base: process.argv.includes('dev') ? '' : '/njt-fatalities',
        }
    },
	preprocess: vitePreprocess()
};

export default config;