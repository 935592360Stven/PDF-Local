"use client"
import { useState, useCallback } from "react"
import { Loader2, Download, Trash2 } from "lucide-react"
import { posthog } from "@/components/PostHogProvider"
import ToolLayout from "@/components/ToolLayout"
import FileUpload from "@/components/FileUpload"
import { cn } from "@/lib/utils"

const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

function loadPdfJs(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) return resolve((window as any).pdfjsLib)
    const s = document.createElement("script")
    s.src = PDFJS_CDN
    s.onload = () => { (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER; resolve((window as any).pdfjsLib) }
    s.onerror = () => reject(new Error("Failed to load PDF.js"))
    document.head.appendChild(s)
  })
}

export default function DeletePagesPage() {
  const [files, setFiles] = useState<File[]>([]), [processing, setProcessing] = useState(false), [blob, setBlob] = useState<Blob | null>(null), [progress, setProgress] = useState("")
  const [totalPages, setTotalPages] = useState(0)
  const [deleting, setDeleting] = useState<Set<number>>(new Set())
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [rendering, setRendering] = useState(false)

  const handleFiles = useCallback(async (f: File[]) => {
    setFiles(f); setBlob(null); setDeleting(new Set()); setThumbnails([]); setTotalPages(0)
    if (!f.length) return
    setRendering(true); setProgress("Loading PDF…")
    try {
      const { PDFDocument } = await import("pdf-lib")
      const doc = await PDFDocument.load(await f[0].arrayBuffer())
      const n = doc.getPageCount()
      setTotalPages(n)
      setProgress("Rendering previews…")

      const pdfjsLib = await loadPdfJs()
      const pdf = await pdfjsLib.getDocument({ data: await f[0].arrayBuffer() }).promise
      const thumbs: string[] = []
      for (let i = 1; i <= Math.min(n, 50); i++) {
        setProgress(`Rendering page ${i} of ${Math.min(n, 50)}…`)
        const page = await pdf.getPage(i)
        const vp = page.getViewport({ scale: 0.3 })
        const c = document.createElement("canvas")
        c.width = vp.width; c.height = vp.height
        await page.render({ canvasContext: c.getContext("2d")!, viewport: vp }).promise
        thumbs.push(c.toDataURL("image/jpeg", 0.6))
      }
      setThumbnails(thumbs)
      setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed to load"}`) }
    finally { setRendering(false) }
  }, [])

  const togglePage = (n: number) => {
    setDeleting(prev => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  const selectAll = () => {
    const all = new Set<number>()
    for (let i = 1; i <= totalPages; i++) all.add(i)
    setDeleting(all)
  }

  const clearAll = () => setDeleting(new Set())

  const go = async () => {
    if (!files.length || !deleting.size) return
    setProcessing(true); setProgress("Deleting pages…")
    try {
      const { PDFDocument } = await import("pdf-lib")
      const doc = await PDFDocument.load(await files[0].arrayBuffer())
      const keep = doc.getPageIndices().filter(i => !deleting.has(i + 1))
      if (!keep.length) { setProgress("Cannot delete all pages"); setTimeout(() => setProgress(""), 2000); setProcessing(false); return }
      const out = await PDFDocument.create()
      const cp = await out.copyPages(doc, keep)
      cp.forEach(p => out.addPage(p))
      setProgress("Generating…")
      const bytes = await out.save()
      setBlob(new Blob([bytes as BlobPart], { type: "application/pdf" })); setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed"}`) }
    finally { setProcessing(false) }
  }
  const dl = () => { if (!blob) return; posthog.capture("delete_download"); const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = `trimmed-${files[0]?.name || "output.pdf"}`; a.click(); URL.revokeObjectURL(u) }

  return (
    <ToolLayout title="Delete Pages" description="Preview and remove unwanted pages from your PDF." icon={<Trash2 className="h-7 w-7 text-[#ff2d55]" />}>
      <FileUpload onFilesSelected={handleFiles} accept=".pdf" multiple={false} maxFiles={1} />

      {rendering && (
        <div className="mt-8 flex items-center justify-center gap-2 py-10 text-[15px] text-[#86868b]">
          <Loader2 className="h-4 w-4 animate-spin" />
          {progress || "Loading…"}
        </div>
      )}

      {totalPages > 0 && !rendering && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-medium text-[#1d1d1f]">{totalPages} page{totalPages > 1 ? "s" : ""}</p>
            <div className="flex gap-3">
              <button onClick={selectAll} className="text-[12px] text-[#007aff] hover:underline">Select all</button>
              <button onClick={clearAll} className="text-[12px] text-[#86868b] hover:underline">Clear</button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => {
              const selected = deleting.has(n)
              const hasThumb = thumbnails[n - 1]
              return (
                <button key={n} onClick={() => togglePage(n)}
                  className={cn("group relative aspect-[3/4] overflow-hidden rounded-[12px] border-2 transition-all",
                    selected
                      ? "border-[#ff2d55] bg-[#ff2d55]/10"
                      : "border-[#e8e8ed] bg-white hover:border-[#007aff] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  )}>
                  {hasThumb ? (
                    <img src={hasThumb} alt={`Page ${n}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f5f5f7] text-[14px] text-[#c7c7cc]">
                      Page {n}
                    </div>
                  )}
                  {/* Selection overlay */}
                  {selected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#ff2d55]/20">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff2d55] text-[11px] font-bold text-white shadow-md">
                        ✕
                      </div>
                    </div>
                  )}
                  {/* Page number badge */}
                  <div className={cn("absolute bottom-1.5 left-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                    selected ? "bg-[#ff2d55] text-white" : "bg-black/50 text-white")}>
                    {n}
                  </div>
                  {totalPages > 50 && n === 50 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-[13px] text-[#86868b]">
                      + {totalPages - 50} more pages
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-[12px] text-[#86868b]">
            {deleting.size > 0
              ? `${deleting.size} page${deleting.size > 1 ? "s" : ""} selected for deletion`
              : "Click pages to mark for deletion"}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-5">
        <button onClick={go} disabled={!files.length || !deleting.size || processing || rendering}
          className={cn("inline-flex items-center gap-2 rounded-[12px] px-7 py-2.5 text-[15px] font-medium text-white transition-all active:scale-[0.97]",
            !files.length || !deleting.size || processing || rendering ? "bg-[#e8e8ed] text-[#c7c7cc] cursor-not-allowed" : "bg-[#ff2d55] hover:bg-[#e6264b]")}>
          {processing && <Loader2 className="h-4 w-4 animate-spin" />}
          {processing ? progress || "Deleting…" : !files.length ? "Upload a PDF file" : !deleting.size ? "Select pages to delete" : `Delete ${deleting.size} page${deleting.size > 1 ? "s" : ""}`}
        </button>
        {blob && (
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#f5f5f7] px-5 py-2 text-[14px] text-[#1d1d1f]">
              <span className="text-[#34c759]">✓</span>
              <span>{(totalPages - deleting.size)} page{(totalPages - deleting.size) !== 1 ? "s" : ""} remaining — {(blob.size / 1024).toFixed(0)} KB</span>
            </div>
            <button onClick={dl} className="inline-flex items-center gap-2 rounded-[12px] bg-[#ff2d55] px-7 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-[#e6264b] active:scale-[0.97]">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        )}
      </div>
      <div className="mt-12 pt-8">
        <h3 className="text-[14px] font-semibold text-[#1d1d1f]">How to delete pages</h3>
        <ol className="mt-3 space-y-2 text-[14px] text-[#86868b] list-decimal list-inside">
          <li>Upload your PDF file — thumbnails load automatically</li>
          <li>Click the pages you want to remove (they turn red with ✕)</li>
          <li>Click &ldquo;Delete&rdquo; and download the trimmed file</li>
        </ol>
      </div>
    </ToolLayout>
  )
}
