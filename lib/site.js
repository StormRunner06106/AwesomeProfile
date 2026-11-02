export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lucashuangdev.vercel.app");

const socialImage = {
  url: new URL("/social/lucas-huang-portfolio.png", siteUrl).href,
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Lucas Huang — AI, web and mobile applications",
};

export function createPageMetadata({
  title = "Lucas Huang | Portfolio",
  description = "Lucas Huang is a software developer building AI, web, and mobile applications. Explore his projects and experience.",
  path = "/",
} = {}) {
  const url = new URL(path, siteUrl).href;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Lucas Huang | Portfolio",
      locale: "en_US",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}
