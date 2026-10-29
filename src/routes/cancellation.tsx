import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DraftNotice } from "@/components/site/PageHeader";
import { site } from "@/config/site";

export const Route = createFileRoute("/cancellation")({
  head: () => ({ meta: [
    { title: `Cancellation — ${site.brandName}` },
    { name: "description", content: 'You can cancel any time. Access continues until the end of the paid period; it does not renew afterwards.' },
    { property: "og:title", content: `Cancellation — ${site.brandName}` },
    { property: "og:description", content: 'You can cancel any time. Access continues until the end of the paid period; it does not renew afterwards.' },
  ] }),
  component: () => (
    <>
      <PageHeader title={'Cancelling a subscription'} />
      <div className="container-page max-w-3xl py-12">
        <DraftNotice />
        <p className="text-muted-foreground">{'You can cancel any time. Access continues until the end of the paid period; it does not renew afterwards.'}</p>
      </div>
    </>
  ),
});
