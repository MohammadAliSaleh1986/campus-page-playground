import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { useAccount } from "@/hooks/use-account";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/courses", label: "Courses" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { user, ready } = useAccount();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  async function signOut() {
    setBusy(true); setError("");
    await queryClient.cancelQueries();
    queryClient.clear();
    const { error: failure } = await supabase.auth.signOut();
    setBusy(false);
    if (failure) { setError("Unable to sign out. Please try again."); return; }
    await navigate({ to: "/auth", replace: true });
  }
  const accountControls = user ? <><Button asChild variant="ghost" size="sm"><Link to="/account">My account</Link></Button><Button variant="ghost" size="sm" disabled={busy} onClick={signOut}>Sign out</Button></> : <Button asChild variant="ghost" size="sm" disabled={!ready}><Link to="/auth">Sign in</Link></Button>;
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden />
          </span>
          {site.brandName}
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary" activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {accountControls}
          <Button asChild variant="accent" size="sm"><Link to="/courses">Explore courses</Link></Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {error && <p role="alert" className="container-page py-2 text-sm text-destructive">{error}</p>}
      {open && (
        <nav aria-label="Mobile" className="border-t md:hidden">
          <div className="container-page flex flex-col py-2">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 font-medium text-foreground">{n.label}</Link>
            ))}
            <div className="flex gap-2 border-t py-3">{accountControls}</div>
          </div>
        </nav>
      )}
    </header>
  );
}
