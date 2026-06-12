"use client"
import { useState, useCallback, useMemo } from "react"
import { Loader2, Download, Scissors, X, Plus } from "lucide-react"
import { track } from "@vercel/analytics"
import ToolLayout from "@/components/ToolLayout"
import FileUpload from "@/components/FileUpload"
import Slider from "@/components/Slider"
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
const GROUP_COLORS = ["#af52de", "#34c759", "#ff9500", "#007aff", "#ff2d55", "#5ac8fa"]

export default function SplitPDFPage() {
  const [files, setFiles] = useState<File[]>([]), [splitting, setSplitting] = useState(false), [progress, setProgress] = useState("")
  const [totalPages, setTotalPages] = useState(0)
  const [pagesPerFile, setPagesPerFile] = useState(1)
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [rendering, setRendering] = useState(false)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [splitMode, setSplitMode] = useState<"even" | "custom">("even")
  const [splitPointInput, setSplitPointInput] = useState("")
  const [splitPoints, setSplitPoints] = useState<number[]>([])

  // Parse and apply split points
  const parsedPoints = useMemo(() => {
    if (!splitPoints.length) return []
    return [...splitPoints].sort((a, b) => a - b).filter(n => n > 0 && n < totalPages)
  }, [splitPoints, totalPages])

  // Calculate file groups based on mode
  const groups = useMemo(() => {
    if (splitMode === "even") {
      const gs: { start: number; end: number }[] = []
      for (let start = 0; start < totalPages; start += pagesPerFile) {
        gs.push({ start, end: Math.min(start + pagesPerFile, totalPages) })
      }
      return gs
    }
    const pts = parsedPoints
    const gs: { start: number; end: number }[] = []
    let prev = 0
    for (const p of pts) {
      gs.push({ start: prev, end: p })
      prev = p
    }
    if (prev < totalPages) gs.push({ start: prev, end: totalPages })
    return gs
  }, [splitMode, pagesPerFile, totalPages, parsedPoints])

  const addSplitPoint = () => {
    const val = parseInt(splitPointInput)
    if (isNaN(val) || val < 1 || val >= totalPages) return
    if (splitPoints.includes(val)) return
    setSplitPoints(prev => [...prev, val].sort((a, b) => a - b))
    setSplitPointInput("")
  }

  const removeSplitPoint = (n: number) => {
    setSplitPoints(prev => prev.filter(p => p !== n))
  }

  const handleFiles = useCallback(async (f: File[]) => {
    setFiles(f); setBlobUrl(null); setThumbnails([]); setTotalPages(0); setExpanded(false); setSplitPoints([]); setSplitPointInput("")
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
        setProgress(`Page ${i} of ${limit}…`)
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

  const go = async () => {
    if (!files.length) return
    setSplitting(true); setProgress("Splitting…")
    try {
      const { PDFDocument } = await import("pdf-lib")
      const JSZip = (await import("jszip")).default
      const src = await PDFDocument.load(await files[0].arrayBuffer())
      const zip = new JSZip()

      for (let i = 0; i < groups.length; i++) {
        const { start, end } = groups[i]
        const indices = Array.from({ length: end - start }, (_, j) => start + j)
        const out = await PDFDocument.create()
        const cp = await out.copyPages(src, indices)
        cp.forEach(p => out.addPage(p))
        const bytes = await out.save()
        zip.file(`split-${i + 1}-pages-${start + 1}-${end}.pdf`, bytes as Uint8Array)
        setProgress(`Generating file ${i + 1} of ${groups.length}…`)
      }

      const zipBlob = await zip.generateAsync({ type: "blob" })
      setBlobUrl(URL.createObjectURL(zipBlob))
      setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed"}`) }
    finally { setSplitting(false) }
  }

  const dl = () => {
    if (!blobUrl) return
    track("split_download")
    const a = document.createElement("a")
    a.href = blobUrl
    a.download = `split-${splitMode === "custom" ? "custom" : pagesPerFile + "-pages-each"}.zip`
    a.click()
  }

  // Get group index for a given page number (0-based)
  const getGroupIdx = (pageIdx: number) => {
    for (let i = 0; i < groups.length; i++) {
      if (pageIdx >= groups[i].start && pageIdx < groups[i].end) return i
    }
    return 0
  }

  const displayPages = totalPages > INITIAL_VISIBLE && !expanded
    ? INITIAL_VISIBLE
    : Math.min(totalPages, 50)

  return (
    <ToolLayout title="Split PDF" description="Split a PDF into multiple smaller files." icon={<Scissors className="h-7 w-7 text-[#af52de]" />}>
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
            <p className="text-[14px] font-medium text-[#1d1d1f]">{totalPages} pages → <strong className="text-[#af52de]">{groups.length}</strong> file{groups.length > 1 ? "s" : ""}</p>
          </div>

          {/* Split mode toggle */}
          <div className="mt-4 inline-flex rounded-[10px] border border-[#e8e8ed] bg-[#f5f5f7] p-0.5">
            <button onClick={() => setSplitMode("even")}
              className={cn("rounded-[8px] px-3.5 py-1.5 text-[13px] font-medium transition-all",
                splitMode === "even" ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#86868b] hover:text-[#1d1d1f]")}>
              Split evenly
            </button>
            <button onClick={() => setSplitMode("custom")}
              className={cn("rounded-[8px] px-3.5 py-1.5 text-[13px] font-medium transition-all",
                splitMode === "custom" ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#86868b] hover:text-[#1d1d1f]")}>
              Custom split points
            </button>
          </div>

          {/* Mode-specific controls */}
          {splitMode === "even" ? (
            <div className="mt-4">
              <label className="text-[13px] font-medium text-[#1d1d1f]">Pages per file</label>
              <div className="mt-1.5 flex items-center gap-3">
                <Slider min={1} max={Math.max(1, totalPages)} value={pagesPerFile}
                  onChange={setPagesPerFile} accentColor="#af52de" className="w-40" />
                <span className="text-[15px] font-medium text-[#af52de]">{pagesPerFile}</span>
                <span className="text-[13px] text-[#86868b]">· {groups.length} file{groups.length > 1 ? "s" : ""}</span>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <label className="text-[13px] font-medium text-[#1d1d1f]">Split at page numbers</label>
              <p className="mt-0.5 text-[11px] text-[#86868b]">Type a page number where you want to split, then press Add.</p>
              <div className="mt-1.5 flex items-center gap-2">
                <input type="number" min={1} max={totalPages - 1} value={splitPointInput}
                  onChange={e => setSplitPointInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSplitPoint()}
                  placeholder={`1–${totalPages - 1}`}
                  className="w-24 rounded-[8px] border border-[#d2d2d7] px-3 py-1.5 text-[13px] text-[#1d1d1f] outline-none focus:border-[#af52de]" />
                <button onClick={addSplitPoint}
                  className="inline-flex items-center gap-1 rounded-[8px] bg-[#af52de] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#9a44c8]">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
              {/* Display current split points */}
              {splitPoints.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {splitPoints.map(n => (
                    <span key={n} className="inline-flex items-center gap-1 rounded-full bg-[#af52de]/10 px-2.5 py-1 text-[12px] font-medium text-[#af52de]">
                      After page {n}
                      <button onClick={() => removeSplitPoint(n)} className="ml-0.5 hover:text-[#ff2d55]">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Thumbnails with group coloring */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: displayPages }, (_, i) => i).map((numIdx) => {
              const pageNum = numIdx + 1
              const grpIdx = getGroupIdx(numIdx)
              const gc = GROUP_COLORS[grpIdx % GROUP_COLORS.length]
              const isSplitPoint = splitMode === "custom" && splitPoints.includes(pageNum)
              const hasThumb = thumbnails[numIdx]
              return (
                <div key={numIdx}
                  className="relative aspect-[3/4] overflow-hidden rounded-[12px] border-2 bg-white transition-all"
                  style={{ borderColor: gc, backgroundColor: `${gc}08` }}>
                  {hasThumb ? (
                    <img src={hasThumb} alt={`Page ${pageNum}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f5f5f7] text-[14px] text-[#c7c7cc]">
                      Page {pageNum}
                    </div>
                  )}
                  <div className="absolute bottom-1.5 left-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm"
                    style={{ backgroundColor: gc }}>
                    {pageNum}
                  </div>
                  <div className="absolute right-1.5 top-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-medium shadow-sm"
                    style={{ color: gc }}>
                    #{grpIdx + 1}
                  </div>
                  {/* Split point indicator */}
                  {isSplitPoint && (
                    <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-md bg-[#af52de] px-1.5 py-0.5 text-[9px] font-medium text-white shadow-sm">
                      <Scissors className="h-2.5 w-2.5" /> split
                    </div>
                  )}
                  {!expanded && totalPages > INITIAL_VISIBLE && numIdx === INITIAL_VISIBLE - 1 && (
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
              <button onClick={() => setExpanded(!expanded)} className="text-[13px] text-[#007aff] hover:underline">
                {expanded ? "Show less" : `Show all ${totalPages} pages`}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-5">
        <button onClick={go} disabled={!files.length || splitting || rendering || (splitMode === "custom" && splitPoints.length === 0)}
          className={cn("inline-flex items-center gap-2 rounded-xl px-7 py-2.5 text-[15px] font-medium text-white transition-all active:scale-[0.97]",
            !files.length || splitting || rendering || (splitMode === "custom" && splitPoints.length === 0)
              ? "bg-[#e8e8ed] text-[#c7c7cc] cursor-not-allowed"
              : "bg-[#af52de] hover:bg-[#9a44c8]")}>
          {splitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {splitting ? progress || "Splitting…" : !files.length ? "Upload a PDF file" : `Split into ${groups.length} file${groups.length > 1 ? "s" : ""}`}
        </button>
        {blobUrl && (
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#f5f5f7] px-5 py-2 text-[14px] text-[#1d1d1f]">
              <span className="text-[#34c759]">✓</span>
              <span>{groups.length} file{groups.length > 1 ? "s" : ""}</span>
            </div>
            <button onClick={dl} className="inline-flex items-center gap-2 rounded-xl bg-[#af52de] px-7 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-[#9a44c8] active:scale-[0.97]">
              <Download className="h-4 w-4" /> Download ZIP
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 pt-8">
        <h3 className="text-[14px] font-semibold text-[#1d1d1f]">How to split a PDF</h3>
        <ol className="mt-3 space-y-2 text-[14px] text-[#86868b] list-decimal list-inside">
          <li>Upload your PDF — thumbnails load with group coloring</li>
          <li>Choose <strong>Split evenly</strong> (every N pages) or <strong>Custom split points</strong> (split at specific pages)</li>
          <li>Click &ldquo;Split&rdquo; and download the ZIP with all files</li>
        </ol>
        <p className="mt-3 text-[13px] text-[#86868b]">Custom split points: e.g., entering 3, 7 means pages 1-3, 4-7, and 8-end become three separate files.</p>
      </div>
    </ToolLayout>
  )
}