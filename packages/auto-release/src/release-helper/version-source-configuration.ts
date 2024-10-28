import { z } from "zod";

export type VersionSourceConfiguration = {
  versionFile?: string;
};

export const versionSourceSchema = z.object({
  versionFile: z.string().optional(),
});
