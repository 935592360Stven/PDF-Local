"use client"
import { useState, useCallback } from "react"
import { Loader2, Download, FileImage } from "lucide-react"
import ToolLayout from "@/components/ToolLayout"
import FileUpload from "@/components/FileUpload"
import { cn } from "@/lib/utils"

export default function JpgToPDFPage() {
  const [files, setFiles] = useState<File[]>([]), [converting, setConverting] = useState(false), [blob, setBlob] = useState<Blob | null>(null), [progress, setProgress] = useState("")
  const handleFiles = useCallback((f: File[]) => { setFiles(f); setBlob(null) }, [])
  const go = async () => {
    if (!files.length) return
    setConverting(true); setProgress("Processing…")
    try {
      const { PDFDocument } = await import("pdf-lib")
      const doc = await PDFDocument.create()
      for (let i = 0; i < files.length; i++) {
        setProgress(`Processing image ${i + 1} of ${files.length}…`)
        const buf = new Uint8Array(await files[i].arrayBuffer())
        const page = doc.addPage()
        const isPng = files[i].type === "image/png"
        const img = isPng ? await doc.embedPng(buf) : await doc.embedJpg(buf)
        const { width: w, height: h } = img.scale(1)
        const s = Math.min(page.getWidth() / w, page.getHeight() / h) * 0.9
        page.drawImage(img, { x: (page.getWidth() - w * s) / 2, y: (page.getHeight() - h * s) / 2, width: w * s, height: h * s })
      }
      setProgress("Generating…")
      const out = await doc.save()
      setBlob(new Blob([out as BlobPart], { type: "application/pdf" })); setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed"}`) }
    finally { setConverting(false) }
  }
  const dl = () => { if (!blob) return; const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = "images.pdf"; a.click(); URL.revokeObjectURL(u) }

  return (
    <ToolLayout title="JPG to PDF" description="Turn images into a polished PDF document." icon={<FileImage className="h-7 w-7 text-[#ff9500]" />}>
      <FileUpload onFilesSelected={handleFiles} accept=".jpg,.jpeg,.png" multiple maxFiles={20} />
      <div className="mt-10 flex flex-col items-center gap-5">
        <button onClick={go} disabled={!files.length || converting}
          className={cn("inline-flex items-center gap-2 rounded-xl px-7 py-2.5 text-[15px] font-medium text-white transition-all",
            !files.length || converting ? "bg-[#e8e8ed] text-[#c7c7cc] cursor-not-allowed" : "bg-[#ff9500] hover:bg-[#e68600]")}>
          {converting && <Loader2 className="h-4 w-4 animate-spin" />}
          {converting ? progress || "Converting…" : !files.length ? "Upload images" : `Convert ${files.length} image${files.length > 1 ? "s" : ""} to PDF`}
        </button>
        {blob && (
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#f5f5f7] px-5 py-2 text-[14px] text-[#1d1d1f]">
              <span className="text-[#34c759]">✓</span>
              <span>PDF created — {(blob.size / 1024).toFixed(0)} KB</span>
            </div>
            <button onClick={dl} className="inline-flex items-center gap-2 rounded-xl bg-[#ff9500] px-7 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-[#e68600]">
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        )}
      </div>
      <div className="mt-12 pt-8">
        <h3 className="text-[14px] font-medium text-[#1d1d1f]">How to convert JPG to PDF</h3>
        <ol className="mt-3 space-y-2 text-[14px] text-[#86868b] list-decimal list-inside">
          <li>Upload your images — drag and drop or click to browse</li>
          <li>Each image becomes one page</li>
          <li>Click &ldquo;Convert to PDF&rdquo; and download</li>
        </ol>
      </div>
    </ToolLayout>
  )
}
