import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DraftNotice } from "@/components/site/PageHeader";
import { site } from "@/config/site";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [
    { title: `Terms of Service — ${site.brandName}` },
    { name: "description", content: 'Course access is personal and non-transferable. Sharing accounts or redistributing course content is not permitted.' },
    { property: "og:title", content: `Terms of Service — ${site.brandName}` },
    { property: "og:description", content: 'Course access is personal and non-transferable. Sharing accounts or redistributing course content is not permitted.' },
  ] }),
  component: () => (
    <>
      <PageHeader title={'Terms of Service'} />
      <div className="container-page max-w-3xl py-12">
        <DraftNotice />
        <p className="text-muted-foreground">{'Course access is personal and non-transferable. Sharing accounts or redistributing course content is not permitted.'}</p>
      </div>
    </>
  ),
});
