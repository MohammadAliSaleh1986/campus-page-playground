import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DraftNotice } from "@/components/site/PageHeader";
import { site } from "@/config/site";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: `About — ${site.brandName}` },
    { name: "description", content: '[Instructor Name] combines 20 years as a Business Administration Specialist with 7 years teaching Coding, Robotics, Finance, Mathematics and Science t' },
    { property: "og:title", content: `About — ${site.brandName}` },
    { property: "og:description", content: '[Instructor Name] combines 20 years as a Business Administration Specialist with 7 years teaching Coding, Robotics, Finance, Mathematics and Science t' },
  ] }),
  component: () => (
    <>
      <PageHeader title={'About the instructor'} />
      <div className="container-page max-w-3xl py-12">
        
        <p className="text-muted-foreground">{"[Instructor Name] combines 20 years as a Business Administration Specialist with 7 years teaching Coding, Robotics, Finance, Mathematics and Science to school students. Qualifications: Master's in Accounting and Auditing, License in Finance, License in Informatics."}</p>
      </div>
    </>
  ),
});
