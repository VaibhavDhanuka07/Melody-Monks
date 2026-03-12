import CertificateDownloadButton from "@/components/site/CertificateDownloadButton";

const certificates = [
  {
    title: "Foundation Pianist",
    detail: "Awarded after completing the first 4 modules.",
  },
  {
    title: "Developing Pianist",
    detail: "Awarded after completing intermediate modules.",
  },
  {
    title: "Advanced Pianist",
    detail: "Awarded after performance mastery and final recital.",
  },
];

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Certificates</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          Certification levels
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Earn certificates as you complete the program milestones.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {certificates.map((cert) => (
          <div key={cert.title} className="card p-6">
            <p className="text-lg font-semibold text-ink">{cert.title}</p>
            <p className="mt-2 text-sm text-ink-muted">{cert.detail}</p>
            <div className="mt-4">
              <CertificateDownloadButton studentName="Student Name" level={cert.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
