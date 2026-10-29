import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { plans } from "@/data/catalog";
import { formatPrice, site } from "@/config/site";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: `Pricing — ${site.brandName}` },
      { name: "description", content: "Buy a single course or subscribe monthly or yearly. Clear terms on access and renewal." },
      { property: "og:title", content: `Pricing — ${site.brandName}` },
      { property: "og:description", content: "Individual courses or flexible subscriptions — choose what suits you." },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  return (
    <>
      <PageHeader eyebrow="Pricing" title="Simple, transparent options">Sample prices for development — final prices are set by the instructor.</PageHeader>
      <div className="container-page grid gap-6 py-14 md:grid-cols-3">
        {plans.filter((p) => p.enabled).map((p) => (
          <div key={p.id} className={`flex flex-col rounded-2xl border bg-card p-7 shadow-card ${p.highlight ? "border-accent ring-2 ring-accent" : ""}`}>
            {p.highlight && <span className="eyebrow">Most flexible</span>}
            <h2 className="mt-1 text-xl font-bold text-primary">{p.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
            <p className="mt-5 font-display text-4xl font-bold text-primary">
              {p.price == null ? "Per course" : formatPrice(p.price)}
              {p.interval !== "one-time" && <span className="text-base font-medium text-muted-foreground"> / {p.interval}</span>}
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {p.benefits.map((b) => <li key={b} className="flex gap-2"><Check className="size-4 shrink-0 text-accent" aria-hidden />{b}</li>)}
            </ul>
            <dl className="mt-6 space-y-2 border-t pt-5 text-sm">
              <div><dt className="font-semibold">Access</dt><dd className="text-muted-foreground">{p.expires}</dd></div>
              <div><dt className="font-semibold">Auto-renews?</dt><dd className="text-muted-foreground">{p.renews}</dd></div>
            </dl>
            <div className="mt-auto pt-6">
              {p.interval === "one-time"
                ? <Button asChild variant="outline" className="w-full"><Link to="/courses">Browse courses</Link></Button>
                : <Button className="w-full" variant={p.highlight ? "accent" : "default"} disabled title="Checkout arrives in a later stage">Subscribe — coming soon</Button>}
            </div>
          </div>
        ))}
      </div>
      <p className="container-page text-sm text-muted-foreground">
        Subscriptions cover courses marked "In subscription". See our <Link to="/cancellation" className="text-accent underline">cancellation</Link> and <Link to="/refunds" className="text-accent underline">refund</Link> policies.
      </p>
    </>
  );
}
