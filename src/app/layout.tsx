import "./globals.css";
import { Outfit } from "next/font/google";
import { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Memestructures | Structured Investing Across Asset Classes",
    template: "%s | Memestructures",
  },
  description: "",
  icons: {
    icon: "/images/memestructuresfavicon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={outfit.variable}
      >
        <Header />
        <main className="bg-my-white">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}