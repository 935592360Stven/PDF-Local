import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Merge PDF Files Privately – No Upload Required | PDF Local",
  description:
    "Combine multiple PDFs into one document privately. All processing happens in your browser — your files never reach a server. Free, no sign-up, works on any device.",
  alternates: { canonical: "https://pdf-local.pages.dev/merge-pdf-files-privately" },
  openGraph: {
    title: "Merge PDF Files Privately – Free Online | PDF Local",
    description: "Combine PDFs without uploading. Private, local, and free.",
  },
}

export default function MergePdfGuidePage() {
  return (
    <div className="mx-auto max-w-[720px] px-6 lg:px-8 py-16 sm:py-24">
      <Link href="/merge-pdf" className="text-[13px] text-[#007aff] hover:underline">
        ← Use the Merge PDF tool
      </Link>

      <h1 className="mt-6 text-[28px] font-semibold leading-[1.2] text-[#1d1d1f] sm:text-[32px]">
        Merge PDF Files Privately in Your Browser
      </h1>
      <p className="mt-3 text-[15px] leading-[1.7] text-[#6e6e73]">
        Need to combine multiple PDFs into one file? Most online PDF mergers require you to upload
        your documents to someone else&rsquo;s server. Our merge tool works entirely in your browser —
        your files never leave your device.
      </p>

      <div className="mt-10 flex justify-center">
        <Link href="/merge-pdf"
          className="inline-flex items-center justify-center rounded-[12px] bg-[#007aff] px-8 py-3.5 text-[17px] font-medium text-white shadow-[0_4px_12px_rgba(0,125,255,0.3)] transition-all hover:bg-[#0066cc] hover:shadow-[0_6px_20px_rgba(0,125,255,0.4)] active:scale-[0.97]">
          Merge PDFs Privately
        </Link>
      </div>
      <p className="mt-3 text-center text-[13px] text-[#86868b]">Files are processed locally in your browser. No upload required.</p>

      <div className="mt-16 rounded-[16px] bg-[#f5f5f7] p-6 sm:p-8">
        <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Why use a private PDF merger?</h2>
        <ul className="mt-4 space-y-2 text-[14px] leading-[1.6] text-[#515154]">
          <li><strong>Your data stays yours</strong> — No uploads means no data leaks, no server logs, no copies stored anywhere</li>
          <li><strong>No file size limits</strong> — Since nothing is uploaded, there are no artificial size restrictions</li>
          <li><strong>Instant processing</strong> — No queue, no waiting for uploads to finish</li>
          <li><strong>Works offline after loading</strong> — Once the page is loaded, you can even disconnect from the internet</li>
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-[17px] font-semibold text-[#1d1d1f]">How to merge PDFs privately</h2>
        <ol className="mt-4 space-y-2 text-[15px] leading-[1.7] text-[#515154] list-decimal list-inside">
          <li>Go to the <Link href="/merge-pdf" className="text-[#007aff] hover:underline">Merge PDF tool</Link></li>
          <li>Upload your PDF files — drag and drop works great</li>
          <li>Reorder the files if needed using drag and drop</li>
          <li>Click &ldquo;Merge&rdquo; and wait a moment</li>
          <li>Download your combined PDF</li>
        </ol>
      </div>

      <div className="mt-10 rounded-[16px] border border-[#e8e8ed] p-6">
        <h2 className="text-[15px] font-semibold text-[#1d1d1f]">How many files can I merge?</h2>
        <p className="mt-2 text-[14px] leading-[1.7] text-[#6e6e73]">
          There is no limit on the number of files you can combine. The only constraint is your
          device&apos;s available memory. For most users, 10–20 standard PDFs work without issue.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-[14px] font-medium text-[#1d1d1f]">Is it really 100% private?</h3>
            <p className="mt-1 text-[14px] leading-[1.6] text-[#6e6e73]">Yes. Your files are processed locally using JavaScript. No data is sent to any server at any point.</p>
          </div>
          <div>
            <h3 className="text-[14px] font-medium text-[#1d1d1f]">Is it free?</h3>
            <p className="mt-1 text-[14px] leading-[1.6] text-[#6e6e73]">Yes, completely free. No sign-up, no account, and no hidden charges.</p>
          </div>
          <div>
            <h3 className="text-[14px] font-medium text-[#1d1d1f]">What if my files are confidential?</h3>
            <p className="mt-1 text-[14px] leading-[1.6] text-[#6e6e73]">This is the perfect tool for confidential documents. Since nothing is uploaded, sensitive information never leaves your computer.</p>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-[#e8e8ed]">
        <Link href="/merge-pdf"
          className="inline-flex items-center justify-center rounded-[12px] bg-[#007aff] px-7 py-3 text-[15px] font-medium text-white transition-all hover:bg-[#0066cc] active:scale-[0.97]">
          Merge Your PDFs Privately →
        </Link>
      </div>
    </div>
  )
}
