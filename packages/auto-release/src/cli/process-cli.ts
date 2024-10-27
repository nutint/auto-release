import { CommandArgument, parseArguments } from "@/cli/parse-arguments";
import { readConfiguration } from "@/cli/read-configuration";
import { extractReleaseInformation } from "@/release-helper/release-helper";

export const processCli = async (args: string[]) => {
  const parsedArgument = parseArguments(args);
  readConfiguration(parsedArgument.configFile);
  if (
    parsedArgument.commands.find(
      (command) => command.command === CommandArgument.AnalyzeRelease,
    )
  ) {
    const releaseInformation = extractReleaseInformation();
    console.log(releaseInformation);
  }
};
