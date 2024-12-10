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
import { Release } from "@/cli/arguments/release-command";

export const CommandArgument = {
  AnalyzeRelease: "AnalyzeRelease",
  CreateJiraRelease: "CreateJiraRelease",
} as const;

export type CommandArgument =
  (typeof CommandArgument)[keyof typeof CommandArgument];

export type CommandWithParams = AnalyzeRelease | CreateJiraRelease | Release;

export type Arguments = CommonArguments & {
  command: CommandWithParams;
};

export type ValidCommand = "analyze" | "create-jira-release" | "release";
export const validCommands: ValidCommand[] = [
  "analyze",
  "create-jira-release",
  "release",
];

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

  switch (command) {
    case "create-jira-release":
      return {
        ...commonArguments,
        command: parseCreateJiraReleaseCommand(args),
      };
    case "release":
      return {
        ...commonArguments,
        command: { command: "Release" },
      };
    default:
      return {
        ...commonArguments,
        command: parseAnalyzeReleaseCommand(),
      };
  }
};

export class InvalidCommandlineFormat extends Error {
  constructor(message: string) {
    super(`InvalidCommandlineFormat: ${message}`);
  }
}
