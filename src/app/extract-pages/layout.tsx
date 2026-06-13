import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Extract Pages from PDF Online – Free Tool | PDF Local",
  description:
    "Extract specific pages from a PDF and save them as a new document. Pick individual pages or a range. Free, private, works in your browser.",
  alternates: { canonical: "https://pdf-local.pages.dev/extract-pages" },
  openGraph: {
    title: "Extract PDF Pages – Free Online Tool | PDF Local",
    description: "Pick and extract specific pages from any PDF without uploading.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
