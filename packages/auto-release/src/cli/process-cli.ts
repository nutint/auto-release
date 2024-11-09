import { parseArguments } from "@/cli/parse-arguments";
import { readConfiguration } from "@/cli/read-configuration";
import { extractReleaseInformation } from "@/release-helper/release-helper";

export const processCli = async (args: string[]) => {
  const parsedArgument = parseArguments(args);
  const { versionSource } = readConfiguration(parsedArgument.configFile);
  const releaseInformation = await extractReleaseInformation(versionSource);
  console.log(releaseInformation);
};
