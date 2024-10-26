import { z } from "zod";

export const jiraConfigurationSchema = z.object({
  host: z.string().url(),
  authentication: z.object({
    email: z.string().email(),
    apiToken: z.string(),
  }),
});
