import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, CreditCard, PlayCircle, PenLine, TrendingUp, Code2, Bot, Wallet, Sigma, FlaskConical, ShieldCheck, Clock, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/site/CourseCard";
import { FaqList } from "@/components/site/FaqList";
import { generalFaqs, subjects } from "@/data/catalog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { catalogQuery } from "@/lib/catalog-query";
import { site } from "@/config/site";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  head: () => ({
    meta: [
      { title: `${site.brandName} — Learn coding, robotics & finance at your own pace` },
      { name: "description", content: "Recorded courses for students aged 10–18 in coding, robotics, finance, maths and science, taught by an experienced educator." },
      { property: "og:title", content: `${site.brandName} — Self-paced online courses` },
      { property: "og:description", content: "Recorded courses in coding, robotics, finance, maths and science for curious students." },
    ],
  }),
  component: Home,
});

const subjectIcons = { coding: Code2, robotics: Bot, finance: Wallet, mathematics: Sigma, science: FlaskConical };
const steps = [
  { icon: Compass, title: "Explore", text: "Browse courses by subject and age." },
  { icon: CreditCard, title: "Enroll", text: "Buy a course or subscribe." },
  { icon: PlayCircle, title: "Learn", text: "Watch short recorded lessons." },
  { icon: PenLine, title: "Practice", text: "Quizzes and hands-on projects." },
  { icon: TrendingUp, title: "Progress", text: "Track every completed lesson." },
];

function Home() {
  const { data: courses } = useSuspenseQuery(catalogQuery);
  const featured = courses.filter((c) => c.featured);
  return (
    <>
      <section className="bg-secondary">
        <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="eyebrow">Self-paced online learning</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-primary md:text-5xl">
              Real skills in coding, robotics and finance — learned at your own pace.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Clear recorded lessons for students aged 10–18, built by an educator with 20 years of business experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/courses">Explore courses</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/auth" search={{ mode: "signup" }}>Create an account</Link></Button>
            </div>
          </div>
          <img src={hero} alt="Student learning online with a laptop and robotics kit" width={1536} height={1024} className="rounded-2xl shadow-lift" />
        </div>
      </section>

      <section className="container-page py-20">
        <div className="flex items-end justify-between gap-4">
          <div><p className="eyebrow">Featured</p><h2 className="mt-2 text-3xl font-bold text-primary">Start with a popular course</h2></div>
          <Link to="/courses" className="hidden text-sm font-semibold text-accent hover:underline sm:block">View all courses →</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => <CourseCard key={c.slug} course={c} />)}
        </div>
      </section>

      <section className="container-page pb-20">
        <p className="eyebrow">Subjects</p>
        <h2 className="mt-2 text-3xl font-bold text-primary">What would you like to learn?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {subjects.map((s) => {
            const Icon = subjectIcons[s.id];
            return (
              <Link key={s.id} to="/courses" search={{ subject: s.id }} className="rounded-xl border bg-card p-5 shadow-card transition hover:border-accent">
                <Icon className="size-7 text-accent" aria-hidden />
                <p className="mt-3 font-semibold">{s.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container-page">
          <h2 className="text-3xl font-bold">How it works</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="grid size-11 place-items-center rounded-full bg-accent text-accent-foreground"><s.icon className="size-5" aria-hidden /></span>
                <p className="mt-4 font-display font-semibold">{i + 1}. {s.title}</p>
                <p className="mt-1 text-sm text-primary-foreground/75">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page grid gap-10 py-20 md:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="eyebrow">Your instructor</p>
          <h2 className="mt-2 text-3xl font-bold text-primary">{site.instructor.name}</h2>
          <p className="mt-1 font-medium text-muted-foreground">{site.instructor.title}</p>
          <p className="mt-4 text-muted-foreground">{site.instructor.bio}</p>
          <Link to="/about" className="mt-5 inline-block text-sm font-semibold text-accent hover:underline">Read the full story →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {site.instructor.experience.map((e) => (
            <div key={e.label} className="rounded-xl border bg-card p-6 shadow-card">
              <p className="font-display text-4xl font-bold text-primary">{e.years}+</p>
              <p className="mt-1 text-sm text-muted-foreground">{e.label}</p>
            </div>
          ))}
          <ul className="space-y-2 rounded-xl border bg-accent-soft p-6 text-sm font-medium sm:col-span-2">
            {site.instructor.qualifications.map((q) => <li key={q}>✓ {q}</li>)}
          </ul>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-primary">Built for students and parents</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { icon: Clock, t: "Learn any time", d: "No live sessions to miss. Pause, rewind and revisit lessons whenever needed." },
              { icon: LineChart, t: "Visible progress", d: "Every completed lesson and quiz is saved, so progress is easy to follow." },
              { icon: ShieldCheck, t: "Safe & focused", d: "A clean, ad-free learning space designed for young learners." },
            ].map((b) => (
              <div key={b.t} className="rounded-xl bg-card p-6 shadow-card">
                <b.icon className="size-6 text-accent" aria-hidden />
                <p className="mt-3 font-semibold">{b.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page max-w-3xl py-20">
        <h2 className="text-3xl font-bold text-primary">Frequently asked questions</h2>
        <div className="mt-8"><FaqList items={generalFaqs.slice(0, 4)} /></div>
      </section>
    </>
  );
}
