import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Convert PDF to JPG Online – Free Tool | PDF Local",
  description:
    "Convert PDF pages to high-quality JPG images. Extract each page as an image. All processing is local — no files are uploaded to any server.",
  alternates: { canonical: "https://pdf-local.pages.dev/pdf-to-jpg" },
  openGraph: {
    title: "PDF to JPG – Free Online Converter | PDF Local",
    description: "Convert PDF pages to JPG images locally in your browser.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
