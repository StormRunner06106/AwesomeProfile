// generate layour with footer
import Footer from "@/components/Footer";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Lucas Huang | Projects",
  description: "Explore Lucas Huang's work in AI, web, and mobile applications.",
  path: "/projects",
});
export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
