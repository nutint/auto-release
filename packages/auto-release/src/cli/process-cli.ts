import { parseArguments } from "@/cli/parse-arguments";
import { readConfiguration } from "@/cli/read-configuration";
import { analyzeRelease } from "@/cli/commands/analyze-release";

export const processCli = async (args: string[]) => {
  const { configFile, outputFormat, interactive } = parseArguments(args);
  const { versionSource } = readConfiguration(configFile);

  await analyzeRelease(versionSource, { interactive, outputFormat });
};
