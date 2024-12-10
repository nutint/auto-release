import { parseArgumentsV2 } from "@/cli/arguments/parse-arguments";
import { readConfiguration } from "@/cli/read-configuration";
import { analyzeRelease } from "@/cli/commands/analyze-release";
import { createJiraRelease } from "@/cli/commands/create-jira-release";
import { logger } from "@/logger/logger";
import { release } from "@/cli/commands/release";

export const processCli = async (args: string[]) => {
  try {
    const { commonArguments, command: commandString } = parseArgumentsV2(args);
    const { outputFormat, interactive, configFile } = commonArguments;
    const configuration = readConfiguration(configFile);

    const foundCommand = [
      {
        validCommand: "create-jira-release",
        processor: async () => await createJiraRelease(configuration, args),
      },
      {
        validCommand: "release",
        processor: async () => await release(configuration),
      },
      {
        validCommand: "analyze",
        processor: async () =>
          await analyzeRelease(configuration.versionSource, {
            interactive,
            outputFormat,
          }),
      },
    ].find((operations) => operations.validCommand === commandString);

    return await foundCommand!.processor();
  } catch (e) {
    logger.error(e);
  }
};

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(`ConfigurationError: ${message}`);
  }
}
