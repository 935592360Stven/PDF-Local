"use client"
import { useState, useCallback } from "react"
import { Loader2, Download, Combine } from "lucide-react"
import { posthog } from "@/components/PostHogProvider"
import ToolLayout from "@/components/ToolLayout"
import FileUpload from "@/components/FileUpload"
import { cn } from "@/lib/utils"

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]), [merging, setMerging] = useState(false), [blob, setBlob] = useState<Blob | null>(null), [progress, setProgress] = useState("")
  const handleFiles = useCallback((f: File[]) => { setFiles(f); setBlob(null) }, [])

  const handleMerge = async () => {
    if (files.length < 2) return
    setMerging(true); setProgress("Processing…")
    try {
      const { PDFDocument } = await import("pdf-lib")
      const out = await PDFDocument.create()
      for (let i = 0; i < files.length; i++) {
        setProgress(`Processing page ${i + 1} of ${files.length}…`)
        const pdf = await PDFDocument.load(await files[i].arrayBuffer())
        const cp = await out.copyPages(pdf, pdf.getPageIndices())
        cp.forEach(p => out.addPage(p))
      }
      setProgress("Generating…")
      const bytes = await out.save()
      setBlob(new Blob([bytes as BlobPart], { type: "application/pdf" }))
      setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed"}`) }
    finally { setMerging(false) }
  }

  const download = () => { if (!blob) return; posthog.capture("merge_download"); const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = "merged.pdf"; a.click(); URL.revokeObjectURL(u) }

  return (
    <ToolLayout title="Merge PDF" description="Combine multiple PDFs into one document in seconds." icon={<Combine className="h-7 w-7 text-[#007aff]" />}>
      <FileUpload onFilesSelected={handleFiles} accept=".pdf" multiple maxFiles={10} />
      <div className="mt-10 flex flex-col items-center gap-4">
        <button onClick={handleMerge} disabled={files.length < 2 || merging}
          className={cn("inline-flex items-center gap-2 rounded-[12px] px-7 py-2.5 text-[15px] font-medium text-white transition-all active:scale-[0.97]",
            files.length < 2 || merging ? "bg-[#e8e8ed] text-[#c7c7cc] cursor-not-allowed" : "bg-[#007aff] hover:bg-[#0066cc]")}>
          {merging && <Loader2 className="h-4 w-4 animate-spin" />}
          {merging ? progress || "Merging…" : files.length < 2 ? "Upload at least 2 PDF files" : `Merge ${files.length} files`}
        </button>
        {blob && (
          <div className="flex flex-col items-center gap-8">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#F2F2F7] px-5 py-2 text-[14px] text-[#6e6e73]">
              <span className="text-[#34c759]">✓</span>
              <span>Merged — {(blob.size / 1024).toFixed(0)} KB</span>
            </div>
            <button onClick={download}
              className="inline-flex items-center gap-2 rounded-[12px] bg-[#007aff] px-7 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-[#0066cc] active:scale-[0.97]">
              <Download className="h-4 w-4" /> Download merged.pdf
            </button>
          </div>
        )}
      </div>
      <div className="mt-12 pt-8">
        <h3 className="text-[14px] font-medium text-[#1d1d1f]">How to merge PDFs</h3>
        <ol className="mt-3 space-y-2 text-[14px] text-[#86868b] list-decimal list-inside">
          <li>Upload your PDF files — drag and drop or click to browse</li>
          <li>Click &ldquo;Merge&rdquo; and wait a few seconds</li>
          <li>Download your merged PDF</li>
        </ol>
      </div>
    </ToolLayout>
  )
}
