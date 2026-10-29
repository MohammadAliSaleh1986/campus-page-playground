import { z } from "zod";

export const profileSchema = z.object({
  display_name: z.string().trim().min(1).max(100),
  preferred_subject: z.enum(["", "coding", "robotics", "finance", "mathematics", "science"]),
});