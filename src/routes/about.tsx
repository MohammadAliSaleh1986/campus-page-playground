import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/config/site";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: `About — ${site.brandName}` },
    { name: "description", content: `${site.instructor.name} combines 20 years as a Business Administration Specialist with 7 years teaching Coding, Robotics, Finance, Mathematics and Science to school students.` },
    { property: "og:title", content: `About — ${site.brandName}` },
    { property: "og:description", content: `${site.instructor.name} combines 20 years as a Business Administration Specialist with 7 years teaching Coding, Robotics, Finance, Mathematics and Science to school students.` },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => (
    <>
      <PageHeader title={'About the instructor'} />
      <div className="container-page grid items-start gap-8 py-12 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
        <img src={site.instructor.photo} alt={site.instructor.name} width={705} height={719} className="aspect-square w-full max-w-md rounded-lg object-cover" />
        <div>
        <h2 className="mb-3 text-3xl font-bold text-primary">{site.instructor.name}</h2>
        <p className="text-muted-foreground">{`${site.instructor.name} combines 20 years as a Business Administration Specialist with 7 years teaching Coding, Robotics, Finance, Mathematics and Science to school students, holding a Master's in Accounting and Auditing, a License in Finance, and a License in Business Informatics.`}</p>
        <div className="mt-8 grid grid-cols-2 gap-6 border-t pt-6">
          {site.instructor.achievements.map((achievement) => (
            <div key={achievement.label}>
              <p className="text-sm text-muted-foreground">{achievement.qualifier}</p>
              <p className="mt-1 font-display text-4xl font-bold text-primary">{achievement.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{achievement.label}</p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </>
  ),
});
