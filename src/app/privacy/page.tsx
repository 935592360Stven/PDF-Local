import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - PDF Local",
  description: "PDF Local processes all files entirely in your browser. We never upload, store, or share your documents.",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[720px] px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-[28px] font-semibold leading-[1.2] text-[#1d1d1f] sm:text-[32px]">Privacy Policy</h1>
      <p className="mt-2 text-[14px] text-[#86868b]">Last updated: June 12, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-[1.7] text-[#515154]">
        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">1. We never see your files</h2>
          <p className="mt-2">
            PDF Local processes all PDF files entirely in your browser using client-side JavaScript.
            Your files are never uploaded to any server — they never leave your device.
          </p>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">2. What we collect</h2>
          <p className="mt-2">We use Vercel Analytics to collect anonymous, aggregated data about site usage:</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-[#515154]">
            <li>Page views (which tools are visited)</li>
            <li>Anonymous feature usage (e.g., &ldquo;compression completed&rdquo;)</li>
            <li>Referrer, device type, and approximate country</li>
          </ul>
          <p className="mt-2">
            This data is aggregated and anonymous. We do not use cookies or track individual users.
          </p>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">3. No cookies</h2>
          <p className="mt-2">
            PDF Local does not set any cookies. We do not use third-party tracking scripts, advertising networks,
            or social media pixels.
          </p>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">4. Third-party services</h2>
          <p className="mt-2">
            We use the following third-party services that process minimal data:
          </p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li><strong>Vercel</strong> — hosting and analytics. See Vercel&apos;s Privacy Policy for details.</li>
            <li><strong>CDN services</strong> — PDF.js and other libraries are loaded from CDNs for faster delivery.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">5. Data retention</h2>
          <p className="mt-2">
            Since files never leave your device, we have nothing to retain. Analytics data is retained
            by Vercel for the standard retention period (typically 38 months).
          </p>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">6. Changes to this policy</h2>
          <p className="mt-2">
            If we update this policy, the &ldquo;Last updated&rdquo; date at the top will change.
            We encourage you to review it periodically.
          </p>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">7. Contact</h2>
          <p className="mt-2">
            If you have questions about this policy, please open an issue on our GitHub repository or
            reach out to us through the project page.
          </p>
        </section>
      </div>
    </div>
  )
}
