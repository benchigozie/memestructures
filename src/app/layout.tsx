import "./globals.css";
import { Outfit } from "next/font/google";
import { Metadata } from "next";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Memestructures | ",
    template: "%s | My Next.js App",
  },
  description: "Structured Investing Across Asset Classes",
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
        {children}
      </body>
    </html>
  );
}