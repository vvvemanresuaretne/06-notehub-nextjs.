import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { Toaster } from "react-hot-toast";
import 'modern-normalize';

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "400", "700", "500"],
});

export const metadata: Metadata = {
  title: "Note Hub",
  description:
    "Fast, clean, and open to all — Note Hub is your go-to app for quick note-taking.",
  openGraph: {
    title: "Note Hub",
    description:
      "Fast, clean, and open to all — Note Hub is your go-to app for quick note-taking.",
    url: "https://08-zustand-seven.vercel.app/",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Note Hub App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Note Hub",
    description:
      "Fast, clean, and open to all — Note Hub is your go-to app for quick note-taking.",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          {modal}
          <Footer />
          <Toaster position="top-center" reverseOrder={false} />
        </TanStackProvider>
      </body>
    </html>
  );
}