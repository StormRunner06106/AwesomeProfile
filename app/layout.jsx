import "./globals.css";
import Navbar from "@/components/Navbar";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import "./nprogress.css";
import { Analytics } from "@vercel/analytics/react";
import Chat from "@/components/Chat";
import ClientTopProgressBar from "@/components/ClientTopProgressBar";

export const metadata = {
    title: "Lucas/Storm | Portofolio",

    description:
		"My name is Lucas Taylor, I'm a fullstack software developer and passionate about it. I'm currently managing innovative ideas to come true.",

    author: "Lucas Taylor",
    siteUrl: "https://www.lucas.my.id",
    applicationName: "Lucas",

    keywords: [
		"lucas",
		"lucas taylor",
		"storm",
		"storm runner",
		"singapore",
	],

    openGraph: {
		type: "website",
		url: "https://www.lucas.my.id",
		title: "Lucas | Portofolio",
		site_name: "Luacs | Portofolio",
		description: "My name is Lucas, This is my portofolio website.",
		width: 1200,
		height: 630,
		images: [
			{
				url: "/og-image-rev.png",
				alt: "Lucas Portofolio",
			},
		],
		site_name: "Lucas | Portofolio",
	}
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<ClientTopProgressBar />
				<Navbar />
				{children}
				{/* <Chat /> */}
				<Analytics />
			</body>
		</html>
	);
}
