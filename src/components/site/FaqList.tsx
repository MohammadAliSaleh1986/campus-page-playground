import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Accordion type="single" collapsible className="divide-y rounded-xl border bg-card px-5">
      {items.map((f, i) => (
        <AccordionItem key={i} value={`f${i}`} className="border-0">
          <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
