import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compress PDF Online for Free – Private Browser Tool | PDF Local",
  description:
    "Compress PDF files right in your browser. Three compression levels. No uploads, no servers, no file size limits. 100% free and private.",
  alternates: { canonical: "https://pdf-local.pages.dev/compress-pdf" },
  openGraph: {
    title: "Compress PDF Online – Free & Private | PDF Local",
    description: "Reduce PDF size without uploading files anywhere. Three compression levels.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
