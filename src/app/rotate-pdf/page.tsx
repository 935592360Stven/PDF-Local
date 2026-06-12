"use client"
import { useState, useCallback } from "react"
import { Loader2, Download, RotateCw, ChevronDown, ChevronUp } from "lucide-react"
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

const INITIAL_VISIBLE = 8

export default function RotatePDFPage() {
  const [files, setFiles] = useState<File[]>([]), [rotating, setRotating] = useState(false), [blob, setBlob] = useState<Blob | null>(null), [rot, setRot] = useState(90), [progress, setProgress] = useState("")
  const [totalPages, setTotalPages] = useState(0)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [rendering, setRendering] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleFiles = useCallback(async (f: File[]) => {
    setFiles(f); setBlob(null); setSelected(new Set()); setThumbnails([]); setTotalPages(0); setExpanded(false)
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
      // Auto-select all pages by default
      const all = new Set<number>()
      for (let i = 1; i <= Math.min(n, 50); i++) all.add(i)
      setSelected(all)
      setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed to load"}`) }
    finally { setRendering(false) }
  }, [])

  const togglePage = (n: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  const selectAll = () => {
    const all = new Set<number>()
    for (let i = 1; i <= Math.min(totalPages, 50); i++) all.add(i)
    setSelected(all)
  }

  const clearAll = () => setSelected(new Set())

  const displayPages = totalPages > INITIAL_VISIBLE && !expanded
    ? INITIAL_VISIBLE
    : Math.min(totalPages, 50)

  const go = async () => {
    if (!files.length) return
    setRotating(true); setProgress("Processing…")
    try {
      const { PDFDocument, degrees } = await import("pdf-lib")
      const doc = await PDFDocument.load(await files[0].arrayBuffer())
      const pages = doc.getPages()
      const targets = selected.size > 0 ? selected : new Set(Array.from({ length: totalPages }, (_, i) => i + 1))
      targets.forEach(n => {
        if (n <= pages.length) {
          const p = pages[n - 1]
          p.setRotation(degrees(p.getRotation().angle + rot))
        }
      })
      setProgress("Generating…")
      const out = await doc.save()
      setBlob(new Blob([out as BlobPart], { type: "application/pdf" })); setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed"}`) }
    finally { setRotating(false) }
  }
  const dl = () => { if (!blob) return; posthog.capture("rotate_download"); const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = `rotated-${files[0]?.name || "output.pdf"}`; a.click(); URL.revokeObjectURL(u) }

  const hasFile = files.length > 0

  return (
    <ToolLayout title="Rotate PDF" description="Select pages and rotate them by 90°, 180°, or 270°." icon={<RotateCw className="h-7 w-7 text-[#5ac8fa]" />}>
      <FileUpload onFilesSelected={handleFiles} accept=".pdf" multiple={false} maxFiles={1} />

      {rendering && (
        <div className="mt-8 flex items-center justify-center gap-2 py-10 text-[15px] text-[#86868b]">
          <Loader2 className="h-4 w-4 animate-spin" />
          {progress || "Loading…"}
        </div>
      )}

      {totalPages > 0 && !rendering && (
        <div className="mt-8">
          {/* Angle selector */}
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-medium text-[#1d1d1f]">{totalPages} page{totalPages > 1 ? "s" : ""}</p>
            <div className="flex items-center gap-2">
              {[90, 180, 270].map(d => (
                <button key={d} onClick={() => setRot(d)}
                  className={cn("rounded-lg border px-3 py-1 text-[12px] font-medium transition-all",
                    rot === d ? "border-[#5ac8fa] bg-[#5ac8fa] text-white" : "border-[#d2d2d7] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7]")}>
                  {d}°
                </button>
              ))}
            </div>
          </div>

          {/* Select all / Clear */}
          <div className="mt-2 flex items-center gap-3">
            <button onClick={selectAll} className="text-[12px] text-[#007aff] hover:underline">Select all</button>
            <button onClick={clearAll} className="text-[12px] text-[#86868b] hover:underline">Clear</button>
            <span className="text-[12px] text-[#c7c7cc]">|</span>
            <span className="text-[12px] text-[#86868b]">
              {selected.size > 0
                ? `${selected.size} page${selected.size > 1 ? "s" : ""} selected`
                : "Click pages to select"}
            </span>
          </div>

          {/* Thumbnail grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: displayPages }, (_, i) => i + 1).map(n => {
              const isSelected = selected.has(n)
              const hasThumb = thumbnails[n - 1]
              return (
                <button key={n} onClick={() => togglePage(n)}
                  className={cn("group relative aspect-[3/4] overflow-hidden rounded-[12px] border-2 transition-all",
                    isSelected
                      ? "border-[#5ac8fa] bg-[#5ac8fa]/10"
                      : "border-[#e8e8ed] bg-white hover:border-[#007aff] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  )}>
                  {hasThumb ? (
                    <img src={hasThumb} alt={`Page ${n}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f5f5f7] text-[14px] text-[#c7c7cc]">
                      Page {n}
                    </div>
                  )}
                  {/* Rotation indicator on selected pages */}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#5ac8fa]/15">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5ac8fa] text-[11px] font-bold text-white shadow-md">
                        <RotateCw className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  )}
                  {/* Angle badge on selected pages */}
                  {isSelected && (
                    <div className="absolute right-1.5 top-1.5 rounded-md bg-[#5ac8fa] px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm">
                      +{rot}°
                    </div>
                  )}
                  {/* Page number badge */}
                  <div className={cn("absolute bottom-1.5 left-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                    isSelected ? "bg-[#5ac8fa] text-white" : "bg-black/50 text-white")}>
                    {n}
                  </div>
                  {/* "+N more" overlay on the last visible page */}
                  {!expanded && totalPages > INITIAL_VISIBLE && n === INITIAL_VISIBLE && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 text-[13px] text-[#86868b]">
                      <span>+ {totalPages - INITIAL_VISIBLE} more</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Expand / Collapse toggle */}
          {totalPages > INITIAL_VISIBLE && (
            <div className="mt-3 flex justify-center">
              <button onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1 text-[13px] text-[#007aff] hover:underline">
                {expanded ? (
                  <><ChevronUp className="h-3.5 w-3.5" /> Show less</>
                ) : (
                  <><ChevronDown className="h-3.5 w-3.5" /> Show all {totalPages} page{totalPages > 1 ? "s" : ""}</>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-5">
        <button onClick={go} disabled={!hasFile || rotating || rendering}
          className={cn("inline-flex items-center gap-2 rounded-[12px] px-7 py-2.5 text-[15px] font-medium text-white transition-all active:scale-[0.97]",
            !hasFile || rotating || rendering ? "bg-[#e8e8ed] text-[#c7c7cc] cursor-not-allowed" : "bg-[#5ac8fa] hover:bg-[#4db8e6]")}>
          {rotating && <Loader2 className="h-4 w-4 animate-spin" />}
          {rotating ? progress || "Rotating…" : !hasFile
            ? "Upload a PDF file"
            : selected.size > 0
              ? `Rotate ${selected.size} page${selected.size > 1 ? "s" : ""} ${rot}°`
              : `Rotate all pages ${rot}°`
          }
        </button>
        {blob && (
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#f5f5f7] px-5 py-2 text-[14px] text-[#1d1d1f]">
              <span className="text-[#34c759]">✓</span>
              <span>Rotated — {(blob.size / 1024).toFixed(0)} KB</span>
            </div>
            <button onClick={dl} className="inline-flex items-center gap-2 rounded-[12px] bg-[#5ac8fa] px-7 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-[#4db8e6] active:scale-[0.97]">
              <Download className="h-4 w-4" /> Download rotated PDF
            </button>
          </div>
        )}
      </div>
      <div className="mt-12 pt-8">
        <h3 className="text-[14px] font-semibold text-[#1d1d1f]">How to rotate a PDF</h3>
        <ol className="mt-3 space-y-2 text-[14px] text-[#86868b] list-decimal list-inside">
          <li>Upload your PDF — thumbnails load automatically</li>
          <li>Click pages to select them, or leave all unselected to rotate everything</li>
          <li>Choose a rotation angle (90°, 180°, 270°)</li>
          <li>Click &ldquo;Rotate&rdquo; and download</li>
        </ol>
      </div>
    </ToolLayout>
  )
}
