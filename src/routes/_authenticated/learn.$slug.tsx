import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogQuery } from "@/lib/catalog-query";
import { courseVideosQuery, myEnrollmentsQuery } from "@/lib/learning";
import { driveEmbedUrl } from "@/lib/drive";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/_authenticated/learn/$slug")({
  head: () => ({ meta: pageMeta("Course lessons", "Watch your course videos.") }),
  loader: ({ context, params }) => Promise.all([
    context.queryClient.ensureQueryData(catalogQuery),
    context.queryClient.ensureQueryData(myEnrollmentsQuery),
    context.queryClient.ensureQueryData(courseVideosQuery(params.slug)),
  ]),
  component: Learn,
});

function Learn() {
  const { slug } = Route.useParams();
  const { data: courses } = useSuspenseQuery(catalogQuery);
  const { data: mine } = useSuspenseQuery(myEnrollmentsQuery);
  const { data: videos } = useSuspenseQuery(courseVideosQuery(slug));
  const [current, setCurrent] = useState(0);
  const course = courses.find((c) => c.slug === slug);
  const approved = mine.some((e) => e.course_slug === slug && e.status === "approved");
  const video = videos[current];
  return <section className="container-page py-10">
    <h1 className="text-3xl font-bold text-primary">{course?.title ?? "Course"}</h1>
    {!approved && <p className="mt-3 rounded-lg bg-secondary p-3 text-sm">You can watch free previews. <Link to="/enroll/$slug" params={{ slug }} className="font-semibold text-accent underline">Enroll</Link> to unlock every lesson.</p>}
    {!videos.length ? <p className="mt-8 text-muted-foreground">No videos available yet.</p> :
    <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div>
        <iframe key={video.id} src={driveEmbedUrl(video.drive_file_id)} title={video.title} allow="autoplay" allowFullScreen className="aspect-video w-full rounded-xl border bg-muted" />
        <p className="mt-3 text-lg font-semibold">{video.title}</p>
      </div>
      <ol className="space-y-2">
        {videos.map((v, i) => <li key={v.id}><Button variant={i === current ? "default" : "outline"} className="w-full justify-start" onClick={() => setCurrent(i)}><PlayCircle className="size-4" aria-hidden />{i + 1}. {v.title}</Button></li>)}
      </ol>
    </div>}
  </section>;
}
