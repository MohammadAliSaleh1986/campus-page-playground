import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

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
