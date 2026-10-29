import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <section className="border-b bg-secondary">
      <div className="container-page py-14">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-bold text-primary md:text-4xl">{title}</h1>
        {children && <div className="mt-3 max-w-2xl text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}

export function DraftNotice() {
  return (
    <p role="note" className="mb-8 rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning">
      Draft content — review with a qualified advisor and replace placeholders before launch.
    </p>
  );
}
