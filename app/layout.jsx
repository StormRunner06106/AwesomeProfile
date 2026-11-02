import "./globals.css";
import Navbar from "@/components/Navbar";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import "./nprogress.css";
import { Analytics } from "@vercel/analytics/react";
import ClientTopProgressBar from "@/components/ClientTopProgressBar";
import { createPageMetadata, siteUrl } from "@/lib/site";
import { themeInitializationScript } from "@/lib/themes";

export const metadata = {
	...createPageMetadata(),
	metadataBase: siteUrl,
	authors: [{ name: "Lucas Huang" }],
	applicationName: "Lucas Huang Portfolio",
	keywords: ["Lucas Huang", "software developer", "AI", "web applications", "mobile applications", "Singapore"],
};

export const viewport = { themeColor: "#e6e6e6" };

export default function RootLayout({ children }) {
	return (
		<html lang="en" data-theme="classic" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
			</head>
			<body>
				<ClientTopProgressBar />
				<Navbar />
				{children}
				<Analytics />
			</body>
		</html>
	);
}
