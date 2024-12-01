import { parseArguments } from "@/cli/arguments/parse-arguments";
import { readConfiguration } from "@/cli/read-configuration";
import { analyzeRelease } from "@/cli/commands/analyze-release";
import { createJiraRelease } from "@/cli/commands/create-jira-release";
import { logger } from "@/logger/logger";

export const processCli = async (args: string[]) => {
  try {
    const { configFile, outputFormat, interactive, command } =
      parseArguments(args);
    const { versionSource, jiraConfiguration } = readConfiguration(configFile);

    if (command.command === "CreateJiraRelease") {
      if (jiraConfiguration === undefined) {
        throw new ConfigurationError("missing jiraConfiguration");
      }
      await createJiraRelease(
        jiraConfiguration,
        command.projectKey,
        command.versionName,
        command.issues,
      );
      return;
    }

    await analyzeRelease(versionSource, { interactive, outputFormat });
  } catch (e) {
    logger.error(e);
  }
};

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(`ConfigurationError: ${message}`);
  }
}
