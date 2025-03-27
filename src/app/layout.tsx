import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/lib/Provider";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Alert Fox",
  description: "IT Alert Tracking and Monitoring System",
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
            <Toaster />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
