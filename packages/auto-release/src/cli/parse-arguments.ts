export type LogLevel = "error" | "warn" | "info" | "debug";

export type Arguments = {
  configFile: string;
  logLevel: LogLevel;
};

export const defaultConfigurationFile = "auto-release.config.json";

export const parseArguments = (args: string[]): Arguments => {
  const argConfigurationFile = args
    .find((arg) => arg.startsWith("--config="))
    ?.split("=")[1];

  const logLevelInput = args
    .find((arg) => arg.startsWith("--log-level=warn"))
    ?.split("--log-level=")[1];

  const logLevel =
    logLevelInput !== undefined ? mapLogLevel(logLevelInput) : undefined;

  return {
    configFile: argConfigurationFile ?? defaultConfigurationFile,
    logLevel: logLevel ?? "error",
  };
};

export const mapLogLevel = (inputString: string): LogLevel | undefined => {
  if (["error", "warn", "info", "debug"].includes(inputString)) {
    return inputString as LogLevel;
  }
  return undefined;
};
