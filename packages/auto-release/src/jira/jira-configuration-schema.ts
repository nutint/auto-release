import { z } from "zod";

const basicAuthenticationSchema = z.object({
  email: z.string().email(),
  apiToken: z.string(),
});

const PATSchema = z.object({
  personalAccessToken: z.string(),
});

export const jiraConfigurationSchema = z.object({
  host: z.string().url(),
  authentication: z.union([basicAuthenticationSchema, PATSchema]),
});
