export type LogLevel = "error" | "warn" | "info" | "debug";

export const CommandArgument = {
  AnalyzeRelease: "AnalyzeRelease",
  CreateJiraRelease: "CreateJiraRelease",
} as const;

export type CommandArgument =
  (typeof CommandArgument)[keyof typeof CommandArgument];

export type OutputFormat = "json" | "text";
export const validOutputFormats: OutputFormat[] = ["json", "text"];

export type AnalyzeRelease = {
  command: "AnalyzeRelease";
};

export type CreateJiraRelease = {
  command: "CreateJiraRelease";
  projectKey: string;
  versionName: string;
  issues: string[];
};

export type CommandWithParams = AnalyzeRelease | CreateJiraRelease;

export type Arguments = {
  configFile: string;
  logLevel: LogLevel;
  outputFormat: OutputFormat;
  interactive: boolean;
  command: CommandWithParams;
};

export const defaultConfigurationFile = "auto-release.config.json";

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
  const argConfigurationFile = parameters
    .find((parameter) => parameter.startsWith("--config="))
    ?.split("=")[1];

  const logLevelInput = parameters
    .find((parameter) => parameter.startsWith("--log-level=warn"))
    ?.split("--log-level=")[1];

  const outputFormat: OutputFormat =
    (parameters
      .find((parameter) => parameter.startsWith("--output-format"))
      ?.split("--output-format=")[1] as OutputFormat) || "text";

  const interactive = !(
    parameters.find((parameter) => parameter === "--no-interactive") !==
    undefined
  );

  if (!validOutputFormats.includes(outputFormat as OutputFormat)) {
    throw new InvalidCommandLineOutputFormat(
      `expect output format one of [${validOutputFormats.join(", ")}]`,
    );
  }

  const logLevel =
    logLevelInput !== undefined ? mapLogLevel(logLevelInput) : undefined;

  const commandArgument =
    command === "analyze"
      ? CommandArgument.AnalyzeRelease
      : CommandArgument.CreateJiraRelease;

  const commonCommandArguments = {
    configFile: argConfigurationFile ?? defaultConfigurationFile,
    logLevel: logLevel ?? "error",
    outputFormat,
    interactive,
  };

  if (commandArgument === "CreateJiraRelease") {
    const jiraProjectKeyParam = args.find((arg) =>
      arg.startsWith("--jira-project-key="),
    );

    if (jiraProjectKeyParam === undefined) {
      throw new InvalidCreateJiraReleaseCommand("--jira-project-key required");
    }

    const [, jiraProjectKey] = jiraProjectKeyParam.split("--jira-project-key=");
    if (jiraProjectKey === "") {
      throw new InvalidCreateJiraReleaseCommand(
        "missing --jira-project-key value",
      );
    }

    const jiraVersionNameParam = args.find((arg) =>
      arg.startsWith("--jira-version-name="),
    );
    if (jiraVersionNameParam === undefined) {
      throw new InvalidCreateJiraReleaseCommand("missing --jira-version-name");
    }
    const [, jiraVersionName] = jiraVersionNameParam.split(
      "--jira-version-name=",
    );
    if (jiraVersionName === "") {
      throw new InvalidCreateJiraReleaseCommand(
        "missing --jira-version-name value",
      );
    }

    const jiraIssueIdsParam = args.find((arg) =>
      arg.startsWith("--jira-issues="),
    );

    if (jiraIssueIdsParam === undefined) {
      return {
        ...commonCommandArguments,
        command: {
          command: "CreateJiraRelease",
          projectKey: jiraProjectKey!,
          versionName: jiraVersionName!,
          issues: [],
        },
      };
    }

    const [, jiraIssueIdsString] = jiraIssueIdsParam.split("--jira-issues=");
    if (jiraIssueIdsString == "") {
      return {
        ...commonCommandArguments,
        command: {
          command: "CreateJiraRelease",
          projectKey: jiraProjectKey!,
          versionName: jiraVersionName!,
          issues: [],
        },
      };
    }

    return {
      ...commonCommandArguments,
      command: {
        command: "CreateJiraRelease",
        projectKey: jiraProjectKey!,
        versionName: jiraVersionName!,
        issues: jiraIssueIdsString!
          .split(",")
          .filter((issue) => issue.startsWith(`${jiraProjectKey}-`)),
      },
    };
  }

  return {
    ...commonCommandArguments,
    command: { command: "AnalyzeRelease" },
  };
};

export const mapLogLevel = (inputString: string): LogLevel | undefined => {
  if (["error", "warn", "info", "debug"].includes(inputString)) {
    return inputString as LogLevel;
  }
  return undefined;
};

export class InvalidCommandlineFormat extends Error {
  constructor(message: string) {
    super(`InvalidCommandlineFormat: ${message}`);
  }
}

export class InvalidCommandLineOutputFormat extends Error {
  constructor(message: string) {
    super(`InvalidCommandLineOutputFormat: ${message}`);
  }
}

export class InvalidCreateJiraReleaseCommand extends Error {
  constructor(message: string) {
    super(`InvalidCreateJiraReleaseCommand: ${message}`);
  }
}
