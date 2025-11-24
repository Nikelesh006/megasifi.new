import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  title: "Megasifi",
  description: "Your one-stop destination for stylish and quality clothing",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`}>
          <Toaster position="top-center" />
          <AppContextProvider>
            <RootLayoutWithNav>
              {children}
            </RootLayoutWithNav>
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

// Client-side component to include Navbar and Footer
function RootLayoutWithNav({ children }) {
  // Using dynamic import to avoid SSR issues with Clerk
  const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: true });
  const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Import dynamic from next/dynamic at the bottom to avoid circular dependencies
import dynamic from 'next/dynamic';
