// generate layour with footer
import Footer from "@/components/Footer";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Lucas Huang | Articles",
  description: "Articles, ideas, and updates from software developer Lucas Huang.",
  path: "/posts",
});
export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
