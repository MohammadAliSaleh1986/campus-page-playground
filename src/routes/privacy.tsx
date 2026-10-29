import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DraftNotice } from "@/components/site/PageHeader";
import { site } from "@/config/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title: `Privacy Policy — ${site.brandName}` },
    { name: "description", content: 'We collect only the information needed to provide accounts, purchases and progress tracking, and never sell personal data. Student data for minors is ' },
    { property: "og:title", content: `Privacy Policy — ${site.brandName}` },
    { property: "og:description", content: 'We collect only the information needed to provide accounts, purchases and progress tracking, and never sell personal data. Student data for minors is ' },
  ] }),
  component: () => (
    <>
      <PageHeader title={'Privacy Policy'} />
      <div className="container-page max-w-3xl py-12">
        <DraftNotice />
        <p className="text-muted-foreground">{'We collect only the information needed to provide accounts, purchases and progress tracking, and never sell personal data. Student data for minors is handled with extra care.'}</p>
      </div>
    </>
  ),
});
