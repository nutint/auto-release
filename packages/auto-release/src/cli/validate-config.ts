import { z } from "zod";
import { schema as jiraConfigurationSchema } from "@/jira/schema";
import { Configuration } from "@/cli/configuration";

export const extractConfiguration = (
  unvalidatedConfig: object,
): Configuration => {
  const schema = z.object({
    jiraBaseUrl: z.string().url().optional(),
    jiraConfiguration: jiraConfigurationSchema.optional(),
  });

  try {
    return schema.parse(unvalidatedConfig);
  } catch (e) {
    throw new Error("Invalid configuration");
  }
};
