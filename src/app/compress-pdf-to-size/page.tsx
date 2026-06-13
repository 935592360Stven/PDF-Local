import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Compress PDF to 2MB or Smaller – Free Online Tool | PDF Local",
  description:
    "Compress your PDF to under 2MB, 1MB, or any target size. Three compression levels. No uploads — your files stay on your device. 100% free.",
  alternates: { canonical: "https://pdf-local.pages.dev/compress-pdf-to-size" },
  openGraph: {
    title: "Compress PDF to Any Size – Free Online Tool | PDF Local",
    description: "Reduce your PDF to 2MB or smaller without uploading files anywhere.",
  },
}

export default function CompressToSizePage() {
  return (
    <div className="mx-auto max-w-[720px] px-6 lg:px-8 py-16 sm:py-24">
      <Link href="/compress-pdf" className="text-[13px] text-[#007aff] hover:underline">
        ← Use the Compress PDF tool
      </Link>

      <h1 className="mt-6 text-[28px] font-semibold leading-[1.2] text-[#1d1d1f] sm:text-[32px]">
        How to Compress a PDF to 2MB or Smaller
      </h1>
      <p className="mt-3 text-[15px] leading-[1.7] text-[#6e6e73]">
        Need to shrink a PDF to fit a file size limit for email, a job application, or an upload portal?
        Our browser-based compressor can get your PDF down to 2MB, 1MB, or even smaller — without
        uploading your file anywhere.
      </p>

      <div className="mt-10 flex justify-center">
        <Link href="/compress-pdf"
          className="inline-flex items-center justify-center rounded-[12px] bg-[#007aff] px-8 py-3.5 text-[17px] font-medium text-white shadow-[0_4px_12px_rgba(0,125,255,0.3)] transition-all hover:bg-[#0066cc] hover:shadow-[0_6px_20px_rgba(0,125,255,0.4)] active:scale-[0.97]">
          Compress Your PDF Now
        </Link>
      </div>
      <p className="mt-3 text-center text-[13px] text-[#86868b]">Files are processed locally in your browser. No upload required.</p>

      <div className="mt-16 rounded-[16px] bg-[#f5f5f7] p-6 sm:p-8">
        <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Three compression levels</h2>
        <ul className="mt-4 space-y-3 text-[14px] leading-[1.6] text-[#515154]">
          <li><strong className="text-[#1d1d1f]">Low compression</strong> — Near lossless quality, typically reduces file by 20–40%. Best for keeping text sharp.</li>
          <li><strong className="text-[#1d1d1f]">Medium compression</strong> — Good balance between size and quality, 40–70% reduction. Good for most use cases.</li>
          <li><strong className="text-[#1d1d1f]">High compression</strong> — Maximum size reduction, 70–95% smaller. Best when file size is the priority.</li>
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-[17px] font-semibold text-[#1d1d1f]">How to use it</h2>
        <ol className="mt-4 space-y-2 text-[15px] leading-[1.7] text-[#515154] list-decimal list-inside">
          <li>Go to the <Link href="/compress-pdf" className="text-[#007aff] hover:underline">Compress PDF tool</Link></li>
          <li>Upload your PDF file (drag and drop or click to browse)</li>
          <li>Choose a compression level (start with Medium)</li>
          <li>Click &ldquo;Compress&rdquo; and wait a few seconds</li>
          <li>Check the resulting size — if it&rsquo;s still too large, try High compression</li>
          <li>Download your compressed PDF</li>
        </ol>
      </div>

      <div className="mt-10 rounded-[16px] border border-[#e8e8ed] p-6">
        <h2 className="text-[15px] font-semibold text-[#1d1d1f]">Is it private?</h2>
        <p className="mt-2 text-[14px] leading-[1.7] text-[#6e6e73]">
          Yes. Your file is processed entirely in your browser using JavaScript. We never upload,
          store, or even see your document.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-[14px] font-medium text-[#1d1d1f]">What maximum file size can I compress?</h3>
            <p className="mt-1 text-[14px] leading-[1.6] text-[#6e6e73]">There is no hard limit — it depends on your browser&apos;s memory. Files up to 100MB usually work fine on modern devices.</p>
          </div>
          <div>
            <h3 className="text-[14px] font-medium text-[#1d1d1f]">Will the text still be readable after compression?</h3>
            <p className="mt-1 text-[14px] leading-[1.6] text-[#6e6e73]">Yes. Even at High compression, text is typically readable. Low compression preserves near-original quality.</p>
          </div>
          <div>
            <h3 className="text-[14px] font-medium text-[#1d1d1f]">Can I compress to exactly 2MB?</h3>
            <p className="mt-1 text-[14px] leading-[1.6] text-[#6e6e73]">The tool offers three preset levels. If the result isn&apos;t exactly 2MB, try a different level or combine pages differently.</p>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-[#e8e8ed]">
        <Link href="/compress-pdf"
          className="inline-flex items-center justify-center rounded-[12px] bg-[#007aff] px-7 py-3 text-[15px] font-medium text-white transition-all hover:bg-[#0066cc] active:scale-[0.97]">
          Compress Your PDF Now →
        </Link>
      </div>
    </div>
  )
}
