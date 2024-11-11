import { parseArguments } from "@/cli/parse-arguments";
import { readConfiguration } from "@/cli/read-configuration";
import { analyzeRelease } from "@/cli/commands/analyze-release";
import { createJiraRelease } from "@/cli/commands/create-jira-release";

export const processCli = async (args: string[]) => {
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
      [],
    );
    return;
  }

  await analyzeRelease(versionSource, { interactive, outputFormat });
};

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(`ConfigurationError: ${message}`);
  }
}
