import { z } from "zod";

export const jiraIssueV3Schema = z.object({
  key: z.string(),
  id: z.string(),
  fields: z.object({
    issuetype: z.object({
      name: z.string(),
    }),
    summary: z.string(),
    fixVersions: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        released: z.boolean(),
        description: z.string().optional(),
      }),
    ),
    status: z.object({
      name: z.string(),
    }),
  }),
});
