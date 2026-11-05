import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCourseCertificate } from "@/lib/student-dashboard.functions";
import { deliverFile } from "@/lib/download";

export function CertificateDownload({ slug }: { slug: string }) {
  const getCertificate = useServerFn(getCourseCertificate);
  const [ready, setReady] = useState<{ blob: Blob; filename: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function prepare() {
    setBusy(true); setError("");
    try {
      const result = await getCertificate({ data: { slug } });
      const bytes = Uint8Array.from(atob(result.base64), char => char.charCodeAt(0));
      setReady({ blob: new Blob([bytes], { type: "application/pdf" }), filename: result.filename });
    } catch (e) { setError(e instanceof Error ? e.message : "Certificate unavailable. Please try again."); }
    finally { setBusy(false); }
  }
  return <div>
    {ready ? <Button size="sm" variant="accent" onClick={() => void deliverFile(ready.blob, ready.filename)}><Download className="size-4" aria-hidden />Download PDF</Button> : <Button size="sm" variant="accent" onClick={prepare} disabled={busy}><Award className="size-4" aria-hidden />{busy ? "Preparing…" : "Get certificate"}</Button>}
    {error && <p role="alert" className="mt-2 max-w-sm text-sm text-destructive">{error}</p>}
  </div>;
}