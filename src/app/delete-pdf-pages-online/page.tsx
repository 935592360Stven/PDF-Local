import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Delete Pages from PDF Online for Free – Remove Unwanted Pages | PDF Local",
  description:
    "Select and delete specific pages from any PDF file. Remove cover pages, blank pages, or unwanted sections. All processing is local — no uploads required.",
  alternates: { canonical: "https://pdf-local.pages.dev/delete-pdf-pages-online" },
  openGraph: {
    title: "Delete Pages from PDF – Free Online | PDF Local",
    description: "Select and remove unwanted pages from any PDF without uploading files.",
  },
}

export default function DeletePagesGuidePage() {
  return (
    <div className="mx-auto max-w-[720px] px-6 lg:px-8 py-16 sm:py-24">
      <Link href="/delete-pages" className="text-[13px] text-[#007aff] hover:underline">
        ← Use the Delete Pages tool
      </Link>

      <h1 className="mt-6 text-[28px] font-semibold leading-[1.2] text-[#1d1d1f] sm:text-[32px]">
        How to Delete Pages from a PDF Online
      </h1>
      <p className="mt-3 text-[15px] leading-[1.7] text-[#6e6e73]">
        Whether you need to remove a cover page, delete blank pages, or cut out unwanted sections,
        our browser-based tool makes it easy. No software to install and no files to upload.
      </p>

      <div className="mt-10 rounded-[16px] bg-[#f5f5f7] p-6 sm:p-8">
        <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Common use cases</h2>
        <ul className="mt-4 space-y-2 text-[14px] leading-[1.6] text-[#515154]">
          <li>Remove the first or last page of a document</li>
          <li>Delete blank pages inserted by scanners</li>
          <li>Remove confidential pages before sharing</li>
          <li>Delete title pages or appendices</li>
          <li>Remove duplicate pages from merged PDFs</li>
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-[17px] font-semibold text-[#1d1d1f]">How to use it</h2>
        <ol className="mt-4 space-y-2 text-[15px] leading-[1.7] text-[#515154] list-decimal list-inside">
          <li>Go to the <Link href="/delete-pages" className="text-[#007aff] hover:underline">Delete Pages tool</Link></li>
          <li>Upload your PDF file</li>
          <li>Select the pages you want to delete by clicking on them</li>
          <li>Click &ldquo;Delete Selected&rdquo;</li>
          <li>Download the cleaned-up PDF</li>
        </ol>
      </div>

      <div className="mt-10 rounded-[16px] border border-[#e8e8ed] p-6">
        <h2 className="text-[15px] font-semibold text-[#1d1d1f]">Is it safe?</h2>
        <p className="mt-2 text-[14px] leading-[1.7] text-[#6e6e73]">
          Your file never leaves your device. All processing happens in your browser using
          client-side JavaScript. We cannot access or see your document. Once you close the page,
          your file is gone.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-[14px] font-medium text-[#1d1d1f]">Can I delete multiple pages at once?</h3>
            <p className="mt-1 text-[14px] leading-[1.6] text-[#6e6e73]">Yes. You can select any number of pages and delete them all in one action.</p>
          </div>
          <div>
            <h3 className="text-[14px] font-medium text-[#1d1d1f]">Can I recover deleted pages?</h3>
            <p className="mt-1 text-[14px] leading-[1.6] text-[#6e6e73]">No — the tool creates a new PDF without the deleted pages. Keep your original file as a backup.</p>
          </div>
          <div>
            <h3 className="text-[14px] font-medium text-[#1d1d1f]">Is there a file size limit?</h3>
            <p className="mt-1 text-[14px] leading-[1.6] text-[#6e6e73]">No artificial limit. Performance depends on your device and browser memory.</p>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-[#e8e8ed]">
        <Link href="/delete-pages"
          className="inline-flex items-center justify-center rounded-[12px] bg-[#007aff] px-7 py-3 text-[15px] font-medium text-white transition-all hover:bg-[#0066cc] active:scale-[0.97]">
          Delete Pages from Your PDF →
        </Link>
      </div>
    </div>
  )
}
