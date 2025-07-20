import Link from "next/link";
import css from "./not-found.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
  description: "404 Not Found — The requested page could not be found.",
  openGraph: {
    title: "Not Found (404)",
    description: "404 Not Found — The requested page could not be found.",
    url: "https://08-zustand-seven.vercel.app/not-found",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Not Found",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Not Found (404)",
    description: "404 Not Found — The requested page could not be found.",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link className={css.linkBack} href="/">
        &#8592; Go back
      </Link>
    </>
  );
}
