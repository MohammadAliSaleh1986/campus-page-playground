import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DraftNotice } from "@/components/site/PageHeader";
import { site } from "@/config/site";

export const Route = createFileRoute("/refunds")({
  head: () => ({ meta: [
    { title: `Refund Policy — ${site.brandName}` },
    { name: "description", content: '[Define refund window, e.g. 14 days if less than X% of the course was watched.]' },
    { property: "og:title", content: `Refund Policy — ${site.brandName}` },
    { property: "og:description", content: '[Define refund window, e.g. 14 days if less than X% of the course was watched.]' },
  ] }),
  component: () => (
    <>
      <PageHeader title={'Refund Policy'} />
      <div className="container-page max-w-3xl py-12">
        <DraftNotice />
        <p className="text-muted-foreground">{'[Define refund window, e.g. 14 days if less than X% of the course was watched.]'}</p>
      </div>
    </>
  ),
});
