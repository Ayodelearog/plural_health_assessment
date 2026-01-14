import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#0B0C7D",
				background: "var(--background)",
				foreground: "var(--foreground)",
				status: {
					processing: "#FFA500",
					notArrived: "#FF0000",
					awaitingVitals: "#9333EA",
					awaitingDoctor: "#3B82F6",
					admittedToWard: "#F59E0B",
					transferred: "#8B5CF6",
					seenDoctor: "#10B981",
				},
			},
			fontFamily: {
				sans: ["var(--font-sans)", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [],
};
export default config;
