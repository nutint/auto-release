export type OutputFormat = "json" | "text";
export const validOutputFormats: OutputFormat[] = ["json", "text"];
export type LogLevel = "error" | "warn" | "info" | "debug";
export type CommonArguments = {
  configFile: string;
  logLevel: LogLevel;
  outputFormat: OutputFormat;
  interactive: boolean;
};

export const defaultConfigurationFile = "auto-release.config.json";

export class InvalidCommandLineOutputFormat extends Error {
  constructor(message: string) {
    super(`InvalidCommandLineOutputFormat: ${message}`);
  }
}

export const mapLogLevel = (inputString: string): LogLevel | undefined => {
  if (["error", "warn", "info", "debug"].includes(inputString)) {
    return inputString as LogLevel;
  }
  return undefined;
};
export const parseCommonArguments = (
  commonArguments: string[],
): CommonArguments => {
  const argConfigurationFile = commonArguments
    .find((parameter) => parameter.startsWith("--config="))
    ?.split("=")[1];

  const logLevelInput = commonArguments
    .find((parameter) => parameter.startsWith("--log-level=warn"))
    ?.split("--log-level=")[1];

  const outputFormat: OutputFormat =
    (commonArguments
      .find((parameter) => parameter.startsWith("--output-format"))
      ?.split("--output-format=")[1] as OutputFormat) || "text";

  const interactive = !(
    commonArguments.find((parameter) => parameter === "--no-interactive") !==
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
  };
};
