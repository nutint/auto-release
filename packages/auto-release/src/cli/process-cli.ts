import { parseArguments } from "@/cli/parse-arguments";
import { readConfiguration } from "@/cli/read-configuration";

export const processCli = async (args: string[]) => {
  const parsedArgument = parseArguments(args);
  readConfiguration(parsedArgument.configFile);
};
