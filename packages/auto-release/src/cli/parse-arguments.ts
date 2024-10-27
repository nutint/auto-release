export type LogLevel = "error" | "warn" | "info" | "debug";

export const CommandArgument = {
  AnalyzeRelease: "AnalyzeRelease",
} as const;

export type CommandArgument =
  (typeof CommandArgument)[keyof typeof CommandArgument];

export type Arguments = {
  configFile: string;
  logLevel: LogLevel;
  commands: { command: CommandArgument }[];
};

export const defaultConfigurationFile = "auto-release.config.json";

export const parseArguments = (args: string[]): Arguments => {
  const argConfigurationFile = args
    .find((arg) => arg.startsWith("--config="))
    ?.split("=")[1];

  const logLevelInput = args
    .find((arg) => arg.startsWith("--log-level=warn"))
    ?.split("--log-level=")[1];

  const analyzeReleaseCommand = args.find((arg) =>
    arg.startsWith("--analyze-release"),
  );

  const logLevel =
    logLevelInput !== undefined ? mapLogLevel(logLevelInput) : undefined;

  return {
    configFile: argConfigurationFile ?? defaultConfigurationFile,
    logLevel: logLevel ?? "error",
    commands: [
      ...(analyzeReleaseCommand !== undefined
        ? [{ command: CommandArgument.AnalyzeRelease }]
        : []),
    ],
  };
};

export const mapLogLevel = (inputString: string): LogLevel | undefined => {
  if (["error", "warn", "info", "debug"].includes(inputString)) {
    return inputString as LogLevel;
  }
  return undefined;
};
