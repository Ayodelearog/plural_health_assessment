import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";

const gilroy = localFont({
	src: [
		{
			path: "./fonts/Gilroy-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "./fonts/Gilroy-Bold.ttf",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: "Plural Health Dashboard",
	description: "Healthcare appointment management system",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${gilroy.variable} antialiased font-sans overflow-hidden`}>
				<Header />
				<main className="h-[calc(100vh-73px)] bg-[#EDF0F8] flex flex-col">
					{children}
				</main>
			</body>
		</html>
	);
}
