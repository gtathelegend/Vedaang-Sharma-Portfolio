import Footer from "@/components/Footer";

export const metadata = {
  title: "Vedaang | About"
};
export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
