import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AppLayout({ children }: any) {
  return (
    <div className="min-h-screen bg-white text-white">

      <Navbar />

      <main>
        {children}
      </main>

      <Footer />

    </div>
  );
}