import { queryOptions } from "@tanstack/react-query";
import { getCourses } from "./catalog.functions";
import type { Course } from "@/data/catalog";
import coding from "@/assets/course-coding.jpg";
import finance from "@/assets/course-finance.jpg";
import robotics from "@/assets/course-robotics.jpg";

const thumbnails: Record<string, string> = { coding, finance, robotics };
export const catalogQuery = queryOptions({
  queryKey: ["courses"],
  staleTime: 60_000,
  queryFn: async (): Promise<Course[]> => (await getCourses()).map((row) => {
    const content = row.content as unknown as Omit<Course, "slug" | "thumbnail">;
    return { ...content, slug: row.slug, thumbnail: thumbnails[content.subject] ?? coding };
  }),
});