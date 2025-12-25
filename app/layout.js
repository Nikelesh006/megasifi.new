import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: true });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  title: "Megasifi",
  description: "Your one-stop destination for stylish and quality clothing",
  icons: {
    icon: "/favicon1.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`}>
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: 'white',
                color: '#881337',
                border: '1px solid #f43f5e',
                borderRadius: '0.5rem',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              },
              success: {
                iconTheme: {
                  primary: '#f43f5e',
                  secondary: 'white',
                },
                style: {
                  background: 'white',
                  color: '#059669',
                  border: '1px solid #10b981',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f43f5e',
                  secondary: 'white',
                },
                style: {
                  background: 'white',
                  color: '#dc2626',
                  border: '1px solid #ef4444',
                },
              },
            }}
          />
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
