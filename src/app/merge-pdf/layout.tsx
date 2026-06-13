import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Merge PDF Files Online for Free – No Upload Required | PDF Local",
  description:
    "Combine multiple PDF files into one document in your browser. No uploads, no servers. Free, private, and works on any device.",
  alternates: { canonical: "https://pdf-local.pages.dev/merge-pdf" },
  openGraph: {
    title: "Merge PDF Files Online – Free & Private | PDF Local",
    description: "Combine PDFs in your browser. No file uploads needed.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
