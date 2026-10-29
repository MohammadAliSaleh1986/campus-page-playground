import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Search } from "lucide-react";
import { CourseCard } from "@/components/site/CourseCard";
import { PageHeader } from "@/components/site/PageHeader";
import { subjects, type AgeGroup, type Difficulty, type Format, type Subject } from "@/data/catalog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogQuery } from "@/lib/catalog-query";
import { site } from "@/config/site";

type Sort = "featured" | "newest" | "price-asc" | "price-desc";
interface CatalogSearch {
  q?: string | undefined; subject?: Subject | undefined; age?: AgeGroup | undefined; level?: Difficulty | undefined; format?: Format | undefined; maxPrice?: number | undefined; sort?: Sort | undefined;
}

export const Route = createFileRoute("/courses/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  validateSearch: (s: Record<string, unknown>): CatalogSearch => ({
    q: typeof s["q"] === "string" ? s["q"] : undefined,
    subject: subjects.some((x) => x.id === s["subject"]) ? (s["subject"] as Subject) : undefined,
    age: typeof s["age"] === "string" ? (s["age"] as AgeGroup) : undefined,
    level: typeof s["level"] === "string" ? (s["level"] as Difficulty) : undefined,
    format: typeof s["format"] === "string" ? (s["format"] as Format) : undefined,
    maxPrice: s["maxPrice"] ? Number(s["maxPrice"]) : undefined,
    sort: typeof s["sort"] === "string" ? (s["sort"] as Sort) : undefined,
  }),
  head: () => ({
    meta: [
      { title: `Course catalog — ${site.brandName}` },
      { name: "description", content: "Browse self-paced courses in coding, robotics, finance, maths and science. Filter by subject, age, level and price." },
      { property: "og:title", content: `Course catalog — ${site.brandName}` },
      { property: "og:description", content: "Find the right self-paced course by subject, age group and difficulty." },
    ],
  }),
  component: Catalog,
});

const selectCls = "h-10 rounded-lg border border-input bg-background px-3 text-sm";

function Catalog() {
  const { data: courses } = useSuspenseQuery(catalogQuery);
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/courses/" });
  const set = (patch: Partial<CatalogSearch>) => navigate({ search: (p) => ({ ...p, ...patch }), replace: true });

  const results = useMemo(() => {
    const q = s.q?.toLowerCase().trim();
    const list = courses.filter((c) =>
      (!q || [c.title, c.subtitle, c.description, ...c.objectives].join(" ").toLowerCase().includes(q)) &&
      (!s.subject || c.subject === s.subject) && (!s.age || c.ageGroup === s.age) &&
      (!s.level || c.difficulty === s.level) && (!s.format || c.format === s.format) &&
      (s.maxPrice == null || c.price <= s.maxPrice));
    const sort = s.sort ?? "featured";
    return [...list].sort((a, b) =>
      sort === "newest" ? b.publishedAt.localeCompare(a.publishedAt)
      : sort === "price-asc" ? a.price - b.price
      : sort === "price-desc" ? b.price - a.price
      : Number(b.featured) - Number(a.featured));
  }, [s, courses]);

  return (
    <>
      <PageHeader eyebrow="Catalog" title="All courses">Recorded lessons you can start today and finish at your own pace.</PageHeader>
      <div className="container-page py-10">
        <div className="grid gap-3 rounded-xl border bg-card p-4 shadow-card md:grid-cols-[2fr_repeat(5,1fr)]">
          <label className="relative">
            <span className="sr-only">Search courses</span>
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden />
            <input value={s.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Search title or keyword" className={`${selectCls} w-full pl-9`} />
          </label>
          <label><span className="sr-only">Subject</span>
            <select className={`${selectCls} w-full`} value={s.subject ?? ""} onChange={(e) => set({ subject: (e.target.value || undefined) as Subject })}>
              <option value="">All subjects</option>{subjects.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
            </select></label>
          <label><span className="sr-only">Age group</span>
            <select className={`${selectCls} w-full`} value={s.age ?? ""} onChange={(e) => set({ age: (e.target.value || undefined) as AgeGroup })}>
              <option value="">All ages</option>{["10-12", "13-15", "16-18", "Adults"].map((a) => <option key={a}>{a}</option>)}
            </select></label>
          <label><span className="sr-only">Difficulty</span>
            <select className={`${selectCls} w-full`} value={s.level ?? ""} onChange={(e) => set({ level: (e.target.value || undefined) as Difficulty })}>
              <option value="">All levels</option>{["Beginner", "Intermediate", "Advanced"].map((a) => <option key={a}>{a}</option>)}
            </select></label>
          <label><span className="sr-only">Format</span>
            <select className={`${selectCls} w-full`} value={s.format ?? ""} onChange={(e) => set({ format: (e.target.value || undefined) as Format })}>
              <option value="">All formats</option>{["Video", "Video + Quizzes", "Project-based"].map((a) => <option key={a}>{a}</option>)}
            </select></label>
          <label><span className="sr-only">Maximum price</span>
            <select className={`${selectCls} w-full`} value={s.maxPrice ?? ""} onChange={(e) => set({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}>
              <option value="">Any price</option><option value="40">Up to 40</option><option value="60">Up to 60</option>
            </select></label>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground" aria-live="polite">{results.length} course{results.length === 1 ? "" : "s"}</p>
          <label className="flex items-center gap-2 text-sm">Sort
            <select className={selectCls} value={s.sort ?? "featured"} onChange={(e) => set({ sort: e.target.value as Sort })}>
              <option value="featured">Featured</option><option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
            </select></label>
        </div>
        {results.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{results.map((c) => <CourseCard key={c.slug} course={c} />)}</div>
        ) : (
          <div className="mt-10 rounded-xl border border-dashed p-12 text-center">
            <p className="font-semibold">No courses match those filters.</p>
            <button className="mt-3 text-sm font-semibold text-accent hover:underline" onClick={() => navigate({ search: {} })}>Clear filters</button>
          </div>
        )}
      </div>
    </>
  );
}
