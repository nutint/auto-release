export type LogLevel = "error" | "warn" | "info" | "debug";

export const CommandArgument = {
  AnalyzeRelease: "AnalyzeRelease",
} as const;

export type CommandArgument =
  (typeof CommandArgument)[keyof typeof CommandArgument];

export type OutputFormat = "json" | "text";
export const validOutputFormats: OutputFormat[] = ["json", "text"];

export type Arguments = {
  configFile: string;
  logLevel: LogLevel;
  outputFormat: OutputFormat;
  interactive: boolean;
  command: { command: CommandArgument };
};

export const defaultConfigurationFile = "auto-release.config.json";

export type ValidCommand = "analyze";
export const validCommands: ValidCommand[] = ["analyze"];

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

  return {
    configFile: argConfigurationFile ?? defaultConfigurationFile,
    logLevel: logLevel ?? "error",
    outputFormat,
    interactive,
    command: { command: CommandArgument.AnalyzeRelease },
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
