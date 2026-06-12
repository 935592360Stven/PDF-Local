"use client"
import { useState, useCallback } from "react"
import { Loader2, Download, ListOrdered } from "lucide-react"
import ToolLayout from "@/components/ToolLayout"
import FileUpload from "@/components/FileUpload"
import { cn } from "@/lib/utils"

export default function AddPageNumbersPage() {
  const [files, setFiles] = useState<File[]>([]), [processing, setProcessing] = useState(false), [blob, setBlob] = useState<Blob | null>(null), [progress, setProgress] = useState("")
  const [startNum, setStartNum] = useState(1)
  const handleFiles = useCallback((f: File[]) => { setFiles(f); setBlob(null) }, [])

  const go = async () => {
    if (!files.length) return
    setProcessing(true); setProgress("Adding page numbers…")
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib")
      const doc = await PDFDocument.load(await files[0].arrayBuffer())
      const font = await doc.embedFont(StandardFonts.Helvetica)
      const pages = doc.getPages()
      for (let i = 0; i < pages.length; i++) {
        setProgress(`Adding page ${i + 1} of ${pages.length}…`)
        const page = pages[i], { width } = page.getSize()
        const num = startNum + i
        const text = `${num}`
        const size = 10
        page.drawText(text, {
          x: width / 2 - (text.length * size * 0.3) / 2,
          y: 20,
          size,
          font,
          color: rgb(0.5, 0.5, 0.5),
        })
      }
      setProgress("Generating…")
      const out = await doc.save()
      setBlob(new Blob([out as BlobPart], { type: "application/pdf" })); setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed"}`) }
    finally { setProcessing(false) }
  }
  const dl = () => { if (!blob) return; const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = `numbered-${files[0]?.name || "output.pdf"}`; a.click(); URL.revokeObjectURL(u) }

  return (
    <ToolLayout title="Add Page Numbers" description="Add page numbers to every page of your PDF." icon={<ListOrdered className="h-7 w-7 text-[#af52de]" />}>
      <FileUpload onFilesSelected={handleFiles} accept=".pdf" multiple={false} maxFiles={1} />
      <div className="mt-8">
        <label className="text-[14px] font-medium text-[#1d1d1f]">Starting Number</label>
        <input type="number" value={startNum} onChange={e => setStartNum(Math.max(1, parseInt(e.target.value) || 1))} min={1}
          className="mt-2 w-24 rounded-[12px] border border-[#e8e8ed] bg-white px-4 py-2.5 text-[15px] text-[#1d1d1f] outline-none transition-all focus:border-[#af52de] focus:ring-1 focus:ring-[#af52de]/20" />
      </div>
      <div className="mt-8 flex flex-col items-center gap-5">
        <button onClick={go} disabled={!files.length || processing}
          className={cn("inline-flex items-center gap-2 rounded-[12px] px-7 py-2.5 text-[15px] font-medium text-white transition-all active:scale-[0.97]",
            !files.length || processing ? "bg-[#e8e8ed] text-[#c7c7cc] cursor-not-allowed" : "bg-[#af52de] hover:bg-[#9a44c8]")}>
          {processing && <Loader2 className="h-4 w-4 animate-spin" />}
          {processing ? progress || "Adding numbers…" : !files.length ? "Upload a PDF file" : "Add Page Numbers"}
        </button>
        {blob && (
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#f5f5f7] px-5 py-2 text-[14px] text-[#1d1d1f]">
              <span className="text-[#34c759]">✓</span>
              <span>Page numbers added — {(blob.size / 1024).toFixed(0)} KB</span>
            </div>
            <button onClick={dl} className="inline-flex items-center gap-2 rounded-[12px] bg-[#af52de] px-7 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-[#9a44c8] active:scale-[0.97]">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        )}
      </div>
      <div className="mt-12 pt-8">
        <h3 className="text-[14px] font-semibold text-[#1d1d1f]">How to add page numbers</h3>
        <ol className="mt-3 space-y-2 text-[14px] text-[#86868b] list-decimal list-inside">
          <li>Upload your PDF file</li>
          <li>Choose the starting page number (defaults to 1)</li>
          <li>Click &ldquo;Add Page Numbers&rdquo; and download</li>
        </ol>
      </div>
    </ToolLayout>
  )
}
