import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import Header from "../components/Header/Header";
import { Metadata } from "next";
import Web2Provider from "../contexts/web2Context";
import Image from "next/image";
import swamp from "@/src/statics/images/swamp.jpg";

import { Bungee, Mukta } from "next/font/google";

const bungeeFont = Bungee({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Mukta({
  weight: ["400", "500", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Base OGRE",
    description: "$OGRE now on Base Chain",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`relative ${bungeeFont.className} ${inter.variable}`}>
        <Image src={swamp} fill alt="noise" />

        <Providers>
          <Web2Provider>
            <main className="relative min-h-screen overflow-hidden w-full">
              <Header />

              <div className="h-full mx-auto mt-10 md:mt-16 w-full pb-16 md:pb-0 max-w-[1400px] px-4">
                {children}
              </div>
            </main>
          </Web2Provider>
        </Providers>
      </body>
    </html>
  );
}
