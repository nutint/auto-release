import { z } from "zod";

export const jiraIssueSchema = z.object({
  id: z.string(),
  fields: z.object({
    summary: z.string(),
    fixVersions: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        released: z.boolean(),
      }),
    ),
    status: z.object({
      name: z.string(),
    }),
    issuetype: z.object({
      name: z.string(),
    }),
  }),
});
