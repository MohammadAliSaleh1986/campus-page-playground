import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/config/site";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: `Contact — ${site.brandName}` },
    { name: "description", content: `Reach ${site.brandName} by email or WhatsApp. Based in ${site.contact.location}.` },
    { property: "og:title", content: `Contact — ${site.brandName}` },
    { property: "og:description", content: `Reach ${site.brandName} by email or WhatsApp. Based in ${site.contact.location}.` },
  ] }),
  component: () => (
    <>
      <PageHeader title="Get in touch" />
      <div className="container-page max-w-3xl py-12">
        <p className="text-muted-foreground">
          Have a question about a course, pricing or enrollment? Reach out any time — I usually reply the same day.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href={`mailto:${site.contact.email}`}
            className="flex items-start gap-4 rounded-xl border bg-card p-6 shadow-card transition hover:border-accent"
          >
            <Mail className="mt-1 size-6 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="block font-semibold">Send an email</span>
              <span className="mt-1 block break-all text-sm text-muted-foreground">{site.contact.email}</span>
            </span>
          </a>
          <a
            href={site.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 rounded-xl border bg-card p-6 shadow-card transition hover:border-accent"
          >
            <MessageCircle className="mt-1 size-6 shrink-0 text-accent" aria-hidden />
            <span>
              <span className="block font-semibold">Message on WhatsApp</span>
              <span className="mt-1 block text-sm text-muted-foreground">{site.contact.phone}</span>
            </span>
          </a>
        </div>
        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 text-accent" aria-hidden />
          {site.contact.location}
        </p>
      </div>
    </>
  ),
});
