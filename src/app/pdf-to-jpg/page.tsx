"use client"
import { useState, useCallback } from "react"
import { Loader2, Download, ImageDown } from "lucide-react"
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

export default function PdfToJpgPage() {
  const [files, setFiles] = useState<File[]>([]), [converting, setConverting] = useState(false), [images, setImages] = useState<{ blob: Blob; name: string }[]>([]), [progress, setProgress] = useState(""), [pages, setPages] = useState(0)
  const handleFiles = useCallback((f: File[]) => { setFiles(f); setImages([]) }, [])
  const go = async () => {
    if (!files.length) return
    setConverting(true); setProgress("Loading PDF engine…")
    try {
      const pdfjsLib = await loadPdfJs()
      const pdf = await pdfjsLib.getDocument({ data: await files[0].arrayBuffer() }).promise
      const n = pdf.numPages; setPages(n)
      const out: { blob: Blob; name: string }[] = []
      const base = files[0].name.replace(/\.pdf$/i, "")
      for (let i = 1; i <= n; i++) {
        setProgress(`Rendering page ${i} of ${n}…`)
        const page = await pdf.getPage(i), vp = page.getViewport({ scale: 2 })
        const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height
        await page.render({ canvasContext: c.getContext("2d")!, viewport: vp }).promise
        const b = await new Promise<Blob | null>(r => c.toBlob(r, "image/jpeg", 0.92))
        if (b) out.push({ blob: b, name: `${base}_page_${i}.jpg` })
      }
      setImages(out); setProgress("")
    } catch (err) { setProgress(`Error: ${err instanceof Error ? err.message : "Failed"}`) }
    finally { setConverting(false) }
  }
  const dlAll = () => { images.forEach(img => { const u = URL.createObjectURL(img.blob); const a = document.createElement("a"); a.href = u; a.download = img.name; a.click(); URL.revokeObjectURL(u) }) }

  return (
    <ToolLayout title="PDF to JPG" description="Convert each page into a high-quality image." icon={<ImageDown className="h-7 w-7 text-[#ff2d55]" />}>
      <FileUpload onFilesSelected={handleFiles} accept=".pdf" multiple={false} maxFiles={1} />
      <div className="mt-10 flex flex-col items-center gap-5">
        <button onClick={go} disabled={!files.length || converting}
          className={cn("inline-flex items-center gap-2 rounded-xl px-7 py-2.5 text-[15px] font-medium text-white transition-all",
            !files.length || converting ? "bg-[#e8e8ed] text-[#c7c7cc] cursor-not-allowed" : "bg-[#ff2d55] hover:bg-[#e6264b]")}>
          {converting && <Loader2 className="h-4 w-4 animate-spin" />}
          {converting ? progress || "Converting…" : !files.length ? "Upload a PDF file" : "Convert to JPG"}
        </button>
        {images.length > 0 && (
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#f5f5f7] px-5 py-2 text-[14px] text-[#1d1d1f]">
              <span className="text-[#34c759]">✓</span>
              <span>{pages} page{pages !== 1 ? "s" : ""} converted</span>
            </div>
            <button onClick={dlAll} className="inline-flex items-center gap-2 rounded-xl bg-[#ff2d55] px-7 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-[#e6264b]">
              <Download className="h-4 w-4" /> Download all images
            </button>
          </div>
        )}
      </div>
      <div className="mt-12 pt-8">
        <h3 className="text-[14px] font-medium text-[#1d1d1f]">How to convert PDF to JPG</h3>
        <ol className="mt-3 space-y-2 text-[14px] text-[#86868b] list-decimal list-inside">
          <li>Upload your PDF file</li>
          <li>Click &ldquo;Convert to JPG&rdquo;</li>
          <li>Each page becomes a separate JPG image</li>
          <li>Download all images at once</li>
        </ol>
      </div>
    </ToolLayout>
  )
}
