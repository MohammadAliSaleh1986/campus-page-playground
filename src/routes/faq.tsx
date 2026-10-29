import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { FaqList } from "@/components/site/FaqList";
import { generalFaqs } from "@/data/catalog";
import { site } from "@/config/site";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: `FAQ — ${site.brandName}` },
    { name: "description", content: "Answers about courses, access, subscriptions and cancellations." },
    { property: "og:title", content: `FAQ — ${site.brandName}` },
    { property: "og:description", content: "Answers about courses, access, subscriptions and cancellations." },
  ] }),
  component: () => (
    <>
      <PageHeader eyebrow="Help" title="Frequently asked questions" />
      <div className="container-page max-w-3xl py-12"><FaqList items={generalFaqs} /></div>
    </>
  ),
});
