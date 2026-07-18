import type {Config} from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./sanity/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			screens: {
				xs: "475px",
			},
			colors: {
				primary: {
					50: '#eef2ff',
					100: '#e0e7ff',
					200: '#c7d2fe',
					300: '#a5b4fc',
					400: '#818cf8',
					500: '#6366f1',
					600: '#4f46e5', // Indigo 600 as main accent
					700: '#4338ca',
					800: '#3730a3',
					900: '#312e81',
					DEFAULT: "#4f46e5", // Indigo 600
				},
				secondary: "#f3f4f6", // zinc-100
				black: {
					100: "#3f3f46", // zinc-700
					200: "#27272a", // zinc-800
					300: "#18181b", // zinc-900
					DEFAULT: "#09090b", // zinc-950
				},
				white: {
					100: "#fafafa", // zinc-50
					DEFAULT: "#ffffff",
				},
			},
			fontFamily: {
				"inter": ["var(--font-inter)", "sans-serif"],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;