import { site } from "@/config/site";

export function pageMeta(title: string, description: string) {
  return [
    { title: `${title} — ${site.brandName}` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — ${site.brandName}` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}