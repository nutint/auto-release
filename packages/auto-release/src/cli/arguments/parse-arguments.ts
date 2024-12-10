import {
  CommonArguments,
  parseCommonArguments,
} from "@/cli/arguments/common-arguments";

export type ValidCommand = "analyze" | "create-jira-release" | "release";
export const validCommands: ValidCommand[] = [
  "analyze",
  "create-jira-release",
  "release",
];

export const parseArgumentsV2 = (
  args: string[],
): { commonArguments: CommonArguments; command: ValidCommand } => {
  const [command, ...parameters] = args;
  if (command === undefined) {
    throw new InvalidCommandlineFormat("Missing command");
  }
  if (!validCommands.includes(command as ValidCommand)) {
    throw new InvalidCommandlineFormat(
      `Invalid command, expected one of ${validCommands.join(", ")}`,
    );
  }

  const commonArguments = parseCommonArguments(parameters);
  return { commonArguments, command: command as ValidCommand };
};

export class InvalidCommandlineFormat extends Error {
  constructor(message: string) {
    super(`InvalidCommandlineFormat: ${message}`);
  }
}
