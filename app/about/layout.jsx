import Footer from "@/components/Footer";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Lucas Huang | About",
  description: "Meet Lucas Huang and explore his software development experience, skills, and education.",
  path: "/about",
});
export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
