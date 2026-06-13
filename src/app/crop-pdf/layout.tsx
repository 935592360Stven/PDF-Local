import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Crop PDF Pages Online – Free Tool | PDF Local",
  description:
    "Remove unwanted margins from your PDF pages. Crop any page to focus on the content you need. Free, private, works in your browser.",
  alternates: { canonical: "https://pdf-local.pages.dev/crop-pdf" },
  openGraph: {
    title: "Crop PDF Pages – Free Online Tool | PDF Local",
    description: "Remove unwanted margins from PDF pages without uploading files.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
