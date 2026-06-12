"use client"
import { useState, useCallback, useRef } from "react"
import { Loader2, Download, Shuffle, GripVertical } from "lucide-react"
import { track } from "@vercel/analytics"
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

const INITIAL_VISIBLE = 8

export default function ReorderPagesPage() {
  const [files, setFiles] = useState<File[]>([]), [processing, setProcessing] = useState(false), [blob, setBlob] = useState<Blob | null>(null), [progress, setProgress] = useState("")
  const [totalPages, setTotalPages] = useState(0)
  const [order, setOrder] = useState<number[]>([])
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [rendering, setRendering] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const dragIdxRef = useRef<number | null>(null)

  const handleFiles = useCallback(async (f: File[]) => {
    setFiles(f); setBlob(null); setThumbnails([]); setTotalPages(0); setOrder([]); setExpanded(false)
    if (!f.length) return
    setRendering(true); setProgress("Loading PDF…")
    try {
      const { PDFDocument } = await import("pdf-lib")
      const doc = await PDFDocument.load(await f[0].arrayBuffer())
      const n = doc.getPageCount()
      setTotalPages(n)
      setOrder(Array.from({ length: n }, (_, i) => i))

      setProgress("Rendering previews…")
      const pdfjsLib = await loadPdfJs()
      const pdf = await pdfjsLib.getDocument({ data: await f[0].arrayBuffer() }).promise
      const thumbs: string[] = []
      const limit = Math.min(n, 50)
      for (let i = 1; i <= limit; i++) {
        setProgress(`Rendering page ${i} of ${limit}…`)
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

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    dragIdxRef.current = idx
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(idx))
    // Make the source element semi-transparent during drag
    ;(e.target as HTMLElement).closest("[data-drag-card]")?.classList.add("opacity-40")
  }

  const handleDragEnd = (e: React.DragEvent) => {
    dragIdxRef.current = null
    setDragOverIdx(null)
    ;(e.target as HTMLElement).closest("[data-drag-card]")?.classList.remove("opacity-40")
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverIdx !== idx) setDragOverIdx(idx)
  }

  const handleDragLeave = () => {
    setDragOverIdx(null)
  }

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault()
    const dragIdx = dragIdxRef.current
    if (dragIdx === null || dragIdx === dropIdx) {
      setDragOverIdx(null)
      return
    }

    setOrder(prev => {
      const next = [...prev]
      const [removed] = next.splice(dragIdx, 1)
      next.splice(dropIdx, 0, removed)
      return next
    })
    setDragOverIdx(null)
  }

  const resetOrder = () => setOrder(Array.from({ length: totalPages }, (_, i) => i))

  const displayCount = totalPages > INITIAL_VISIBLE && !expanded ? INITIAL_VISIBLE : Math.min(totalPages, 50)

  const go = async () => {
    if (!files.length) return
    setProcessing(true); setProgress("Reordering…")
    try {
      const { PDFDocument } = await import("pdf-lib")
      const doc = await PDFDocument.load(await files[0].arrayBuffer())
      const out = await PDFDocument.create()
      const cp = await out.copyPages(doc, order)
      cp.forEach(p => out.addPage(p))
      setProgress("Generating…")
      const bytes = await out.save()
      setBlob(new Blob([bytes as BlobPart], { type: "application/pdf" })); setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed"}`) }
    finally { setProcessing(false) }
  }
  const dl = () => { if (!blob) return; track("reorder_download"); const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = `reordered-${files[0]?.name || "output.pdf"}`; a.click(); URL.revokeObjectURL(u) }

  return (
    <ToolLayout title="Reorder Pages" description="Drag pages to rearrange them in your PDF." icon={<Shuffle className="h-7 w-7 text-[#ff9500]" />}>
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
            <button onClick={resetOrder} className="text-[12px] text-[#007aff] hover:underline">Reset order</button>
          </div>
          <p className="mt-1 text-[12px] text-[#86868b]">Drag thumbnails to rearrange. Gray bar = original position.</p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: displayCount }, (_, i) => i).map((displayIdx) => {
              const pageIdx = order[displayIdx]
              const pageNum = pageIdx + 1
              const hasThumb = thumbnails[pageIdx]
              return (
                <div
                  key={`${pageIdx}-${displayIdx}`}
                  data-drag-card
                  draggable
                  onDragStart={e => handleDragStart(e, displayIdx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => handleDragOver(e, displayIdx)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(e, displayIdx)}
                  className={cn(
                    "relative aspect-[3/4] overflow-hidden rounded-[12px] border-2 bg-white transition-all cursor-grab active:cursor-grabbing select-none",
                    dragOverIdx === displayIdx ? "border-[#ff9500] shadow-[0_0_0_3px_rgba(255,149,0,0.25)]" : "border-[#e8e8ed] hover:border-[#d2d2d7]",
                  )}
                >
                  {hasThumb ? (
                    <img src={hasThumb} alt={`Page ${pageNum}`} className="h-full w-full object-cover pointer-events-none" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f5f5f7] text-[14px] text-[#c7c7cc]">
                      Page {pageNum}
                    </div>
                  )}
                  {/* Drag handle */}
                  <div className="absolute left-1.5 top-1.5 rounded-md bg-black/40 p-1 text-white shadow-sm">
                    <GripVertical className="h-3.5 w-3.5" />
                  </div>
                  {/* Page number */}
                  <div className="absolute bottom-1.5 left-1.5 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    #{displayIdx + 1}
                  </div>
                  {/* Original position indicator */}
                  {pageIdx !== displayIdx && (
                    <div className="absolute bottom-1.5 right-1.5 rounded-md bg-[#86868b]/70 px-1.5 py-0.5 text-[9px] font-medium text-white">
                      orig: #{pageIdx + 1}
                    </div>
                  )}

                  {!expanded && totalPages > INITIAL_VISIBLE && displayIdx === INITIAL_VISIBLE - 1 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 text-[13px] text-[#86868b]">
                      <span>+ {totalPages - INITIAL_VISIBLE} more</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {totalPages > INITIAL_VISIBLE && (
            <div className="mt-3 flex justify-center">
              <button onClick={() => setExpanded(!expanded)} className="inline-flex items-center gap-1 text-[13px] text-[#007aff] hover:underline">
                {expanded ? "Show less" : `Show all ${totalPages} page${totalPages > 1 ? "s" : ""}`}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-4">
        <button onClick={go} disabled={!files.length || processing || rendering}
          className={cn("inline-flex items-center gap-2 rounded-[12px] px-7 py-2.5 text-[15px] font-medium text-white transition-all active:scale-[0.97]",
            !files.length || processing || rendering ? "bg-[#e8e8ed] text-[#c7c7cc] cursor-not-allowed" : "bg-[#ff9500] hover:bg-[#e68600]")}>
          {processing && <Loader2 className="h-4 w-4 animate-spin" />}
          {processing ? progress || "Reordering…" : !files.length ? "Upload a PDF file" : "Apply new order"}
        </button>
        {blob && (
          <div className="flex flex-col items-center gap-8">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#F2F2F7] px-5 py-2 text-[14px] text-[#6e6e73]">
              <span className="text-[#34c759]">✓</span>
              <span>{totalPages} page{totalPages !== 1 ? "s" : ""} reordered — {(blob.size / 1024).toFixed(0)} KB</span>
            </div>
            <button onClick={dl} className="inline-flex items-center gap-2 rounded-[12px] bg-[#ff9500] px-7 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-[#e68600] active:scale-[0.97]">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        )}
      </div>
      <div className="mt-12 pt-8">
        <h3 className="text-[14px] font-semibold text-[#1d1d1f]">How to reorder pages</h3>
        <ol className="mt-3 space-y-2 text-[14px] text-[#86868b] list-decimal list-inside">
          <li>Upload your PDF — thumbnails load automatically</li>
          <li><strong>Drag</strong> thumbnails to rearrange them (grab the handle)</li>
          <li>Click &ldquo;Apply new order&rdquo; and download</li>
        </ol>
      </div>
    </ToolLayout>
  )
}