import { z } from "zod";

export const validateConfiguration = (unvalidatedConfig: object) => {
  const schema = z.object({
    jiraBaseUrl: z.string().url().optional(),
  });

  try {
    schema.parse(unvalidatedConfig);
  } catch (e) {
    throw new Error("Invalid configuration");
  }
};
