import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@/hooks/use-account";
import { myEnrollmentsQuery } from "@/lib/learning";
import { courseStage } from "@/lib/course-stage";

export function useCourseStages() {
  const { user, ready } = useAccount();
  const query = useQuery({ ...myEnrollmentsQuery, enabled: ready && Boolean(user) });
  return {
    signedIn: Boolean(user),
    loading: Boolean(user) && query.isPending,
    error: Boolean(user) && query.isError,
    stageFor: (slug: string) => user && query.data ? courseStage(slug, query.data) : undefined,
  };
}