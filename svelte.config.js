import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
 
    kit: {
        adapter: adapter(),
        paths: {
			base: process.argv.includes('dev') ? '' : '/njt-fatalities',
        }
    }
};

export default config;