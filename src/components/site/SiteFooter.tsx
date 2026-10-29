import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy-deep text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-xl font-bold">{site.brandName}</p>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/70">{site.tagline}</p>
          <div className="mt-5 flex gap-4 text-sm">
            {site.social.map((s) => <a key={s.label} href={s.href} className="text-primary-foreground/80 hover:text-primary-foreground">{s.label}</a>)}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            <li>{site.contact.email}</li><li>{site.contact.phone}</li><li>{site.contact.location}</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Policies</p>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/privacy" className="hover:text-primary-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary-foreground">Terms of Service</Link></li>
            <li><Link to="/refunds" className="hover:text-primary-foreground">Refund Policy</Link></li>
            <li><Link to="/cancellation" className="hover:text-primary-foreground">Cancelling a subscription</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} {site.brandName}. All rights reserved.
      </div>
    </footer>
  );
}
