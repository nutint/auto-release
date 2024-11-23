import { z } from "zod";

export const jiraVersionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  released: z.boolean(),
});
