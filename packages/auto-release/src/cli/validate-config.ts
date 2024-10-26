import { z } from "zod";
import { jiraConfigurationSchema } from "@/jira/jira-configuration-schema";
import { Configuration } from "@/cli/configuration";
import { versionRulesSchema } from "@/version/version-rules-schema";

export const extractConfiguration = (
  unvalidatedConfig: object,
): Configuration => {
  const schema = z.object({
    jiraConfiguration: jiraConfigurationSchema.optional(),
    versionRules: versionRulesSchema.optional(),
  });

  try {
    return schema.parse(unvalidatedConfig);
  } catch (e) {
    throw new Error("Invalid configuration");
  }
};
