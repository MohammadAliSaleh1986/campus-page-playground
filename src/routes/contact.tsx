import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DraftNotice } from "@/components/site/PageHeader";
import { site } from "@/config/site";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: `Contact — ${site.brandName}` },
    { name: "description", content: 'Email: [contact@example.com] · Phone: [+000 000 000] · Location: [City, Country]. A contact form arrives with the backend stage.' },
    { property: "og:title", content: `Contact — ${site.brandName}` },
    { property: "og:description", content: 'Email: [contact@example.com] · Phone: [+000 000 000] · Location: [City, Country]. A contact form arrives with the backend stage.' },
  ] }),
  component: () => (
    <>
      <PageHeader title={'Get in touch'} />
      <div className="container-page max-w-3xl py-12">
        
        <p className="text-muted-foreground">{'Email: [contact@example.com] · Phone: [+000 000 000] · Location: [City, Country]. A contact form arrives with the backend stage.'}</p>
      </div>
    </>
  ),
});
