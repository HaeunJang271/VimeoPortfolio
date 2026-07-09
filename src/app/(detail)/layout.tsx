import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black pt-24 md:pt-28">{children}</div>
      <Footer />
    </>
  );
}
