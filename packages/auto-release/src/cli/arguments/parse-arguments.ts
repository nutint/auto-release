import {
  CommonArguments,
  parseCommonArguments,
} from "@/cli/arguments/common-arguments";
import {
  CreateJiraRelease,
  parseCreateJiraReleaseCommand,
} from "@/cli/arguments/create-jira-release-command";
import {
  AnalyzeRelease,
  parseAnalyzeReleaseCommand,
} from "@/cli/arguments/analyze-release-command";

export const CommandArgument = {
  AnalyzeRelease: "AnalyzeRelease",
  CreateJiraRelease: "CreateJiraRelease",
} as const;

export type CommandArgument =
  (typeof CommandArgument)[keyof typeof CommandArgument];

export type CommandWithParams = AnalyzeRelease | CreateJiraRelease;

export type Arguments = CommonArguments & {
  command: CommandWithParams;
};

export type ValidCommand = "analyze" | "create-jira-release";
export const validCommands: ValidCommand[] = ["analyze", "create-jira-release"];

export const parseArguments = (args: string[]): Arguments => {
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

  const commandArgument =
    command === "analyze"
      ? CommandArgument.AnalyzeRelease
      : CommandArgument.CreateJiraRelease;

  if (commandArgument === "CreateJiraRelease") {
    const createReleaseCommand = parseCreateJiraReleaseCommand(args);
    return {
      ...commonArguments,
      command: createReleaseCommand,
    };
  }

  return {
    ...commonArguments,
    command: parseAnalyzeReleaseCommand(),
  };
};

export class InvalidCommandlineFormat extends Error {
  constructor(message: string) {
    super(`InvalidCommandlineFormat: ${message}`);
  }
}
