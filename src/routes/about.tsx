import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DraftNotice } from "@/components/site/PageHeader";
import { site } from "@/config/site";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: `About — ${site.brandName}` },
    { name: "description", content: `${site.instructor.name} combines 20 years as a Business Administration Specialist with 7 years teaching Coding, Robotics, Finance, Mathematics and Science to school students.` },
    { property: "og:title", content: `About — ${site.brandName}` },
    { property: "og:description", content: `${site.instructor.name} combines 20 years as a Business Administration Specialist with 7 years teaching Coding, Robotics, Finance, Mathematics and Science to school students.` },
  ] }),
  component: () => (
    <>
      <PageHeader title={'About the instructor'} />
      <div className="container-page max-w-3xl py-12">
        
        <p className="text-muted-foreground">{`${site.instructor.name} combines 20 years as a Business Administration Specialist with 7 years teaching Coding, Robotics, Finance, Mathematics and Science to school students, holding a Master's in Accounting and Auditing, a License in Finance, and a License in Business Informatics.`}</p>
      </div>
    </>
  ),
});
