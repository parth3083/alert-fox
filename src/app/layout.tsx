import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/lib/Provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${poppins.className}antialiased min-h-[calc(100vh-1px)] flex flex-col`}
        >
          <main className="relative flex flex-1 flex-col ">
            <Provider>{children}</Provider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
