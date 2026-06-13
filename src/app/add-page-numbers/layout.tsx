import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF – Free Online Tool | PDF Local",
  description:
    "Add page numbers to every page of your PDF document. Customize position and style. Free browser-based tool — no uploads, no sign-up.",
  alternates: { canonical: "https://pdf-local.pages.dev/add-page-numbers" },
  openGraph: {
    title: "Add Page Numbers to PDF – Free Online | PDF Local",
    description: "Add page numbers to any PDF without uploading files.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
