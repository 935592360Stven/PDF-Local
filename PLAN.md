# PDFPro —— AI-Powered PDF Tool Platform

## Product Overview
Browser-based PDF tool suite with AI-enhanced features. Freemium model targeting global users.

## MVP Core Tools (Phase 1)
1. **Merge PDF** (基础免费, 限文件数)
2. **Compress PDF** (基础免费, 限大小)
3. **JPG to PDF** (免费)
4. **Split PDF** (基础免费)
5. **PDF to JPG** (免费)

## AI Differentiator (Phase 2)
1. **AI Summarize PDF** — 输入 URL 或上传，AI 自动总结要点
2. **Chat with PDF** — 对 PDF 提问，AI 从文档中找答案
3. **AI Compare PDF** — 两个版本对比，AI标注差异
4. **AI Translate PDF** — 整份翻译（Pro feature）

## Monetization
- **Free**: 基础功能（有限制）
- **Pro $9.99/mo** 或 $99/yr: 无限使用 + AI 功能 + 高压缩率
- **Business $19.99/mo**: Pro + API 接入 + 批处理

## Tech Stack
- Frontend: Next.js 14 (App Router) + Tailwind + shadcn/ui
- PDF Processing: pdf-lib (client-side for merge/split), Sharp (server-side for compression)
- File Storage: Upload to Vercel Blob / Cloudflare R2
- AI: OpenAI GPT-4o / Anthropic Claude
- Payments: LemonSqueezy (Merchant of Record)
- Database: Supabase (users, usage tracking, subscriptions)
- Deployment: Vercel + Cloudflare CDN

## Directory Structure
```
pdfpro/
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx   # Landing page
│   │   ├── merge-pdf/page.tsx
│   │   ├── compress-pdf/page.tsx
│   │   ├── jpg-to-pdf/page.tsx
│   │   ├── split-pdf/page.tsx
│   │   ├── pdf-to-jpg/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── api/       # API routes
│   ├── components/    # Reusable components
│   ├── lib/           # Utilities
│   └── styles/
├── next.config.js
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

## Build Order (Week 1)
1. Day 1: Project scaffold + Landing page + 全局布局
2. Day 2-3: Merge PDF tool (完整前端+后端处理)
3. Day 4: Compress PDF + JPG to PDF
4. Day 5: Split PDF + PDF to JPG
5. Day 6: Pricing page + LemonSqueezy integration
6. Day 7: Polish + SEO meta + deploy to Vercel
