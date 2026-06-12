import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - PDF Local",
  description: "Terms of service for PDF Local — free browser-based PDF tools.",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[720px] px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-[28px] font-semibold leading-[1.2] text-[#1d1d1f] sm:text-[32px]">Terms of Service</h1>
      <p className="mt-2 text-[14px] text-[#86868b]">Last updated: June 12, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-[1.7] text-[#515154]">
        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">1. Service Description</h2>
          <p className="mt-2">
            PDF Local provides browser-based PDF processing tools. All processing
            happens locally on your device — no files are uploaded to our servers.
          </p>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">2. Use of Service</h2>
          <p className="mt-2">You agree to use PDF Local only for lawful purposes and in accordance with these terms. You may not:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Use the service to process illegal or copyrighted material without authorization</li>
            <li>Attempt to reverse-engineer or exploit the service</li>
            <li>Use automated scripts to abuse the service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">3. Intellectual Property</h2>
          <p className="mt-2">
            The PDF Local name, logo, and website design are owned by the project maintainers.
            The underlying open-source components (PDF.js, pdf-lib) are licensed separately.
          </p>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">4. Disclaimer</h2>
          <p className="mt-2">
            PDF Local is provided &ldquo;as is&rdquo; without warranty of any kind. We do not guarantee
            that the tools will be error-free or that file processing will always succeed.
            Since files are processed locally, we cannot recover files lost due to browser crashes.
          </p>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">5. Limitation of Liability</h2>
          <p className="mt-2">
            PDF Local shall not be liable for any indirect, incidental, or consequential damages
            arising from the use or inability to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">6. Changes to Terms</h2>
          <p className="mt-2">
            We reserve the right to update these terms. Changes will be posted here with an updated date.
            Continued use after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">7. Contact</h2>
          <p className="mt-2">
            For questions about these terms, please open an issue on our GitHub repository.
          </p>
        </section>
      </div>
    </div>
  )
}
