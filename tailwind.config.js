/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			fontFamily: {
				"sans": ["Inter", "sans-serif"],
				"header": ["Plus Jakarta Sans", "sans-serif"]
			},
			colors: {
				"custom-purple": "#AA87BE"
			}
		}
	},
	plugins: []
};
