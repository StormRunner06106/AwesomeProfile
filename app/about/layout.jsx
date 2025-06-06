import Footer from "@/components/Footer";

export const metadata = {
  title: "Lucas | About"
};
export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
