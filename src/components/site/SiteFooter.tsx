import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy-deep text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={site.logo.src} alt={site.logo.alt} width={497} height={497} loading="lazy" className="size-24 rounded-2xl ring-1 ring-primary-foreground/15" />
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/70">{site.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            {site.social.map((s) => <a key={s.label} href={s.href} className="text-primary-foreground/80 hover:text-primary-foreground">{s.label}</a>)}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            <li><a href={`mailto:${site.contact.email}`} className="hover:text-primary-foreground">{site.contact.email}</a></li>
            <li><a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${site.contact.phone}`} className="inline-flex items-center gap-2 hover:text-primary-foreground"><WhatsAppIcon className="size-4 shrink-0" />{site.contact.phone}</a></li>
            <li>{site.contact.location}</li>
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
