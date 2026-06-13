import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Split PDF Files Online for Free – Local Processing | PDF Local",
  description:
    "Split large PDF files into multiple smaller documents by page count. All processing happens in your browser — nothing is uploaded.",
  alternates: { canonical: "https://pdf-local.pages.dev/split-pdf" },
  openGraph: {
    title: "Split PDF Online – Free & Private | PDF Local",
    description: "Split PDF files into smaller documents locally in your browser.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
