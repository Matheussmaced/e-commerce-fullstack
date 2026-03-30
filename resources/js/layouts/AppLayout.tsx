import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-foreground">

      <Navbar />

      <main>
        {children}
      </main>

      <Footer />

    </div>
  );
}